import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import {
  BaseInteraction,
  codeBlock,
  DiscordAPIError,
  EmbedBuilder,
  Interaction,
} from 'discord.js';
import { NecordContextType } from 'necord';

@Catch()
export class GlobalDiscordFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(GlobalDiscordFilter.name);
  constructor(readonly httpAdapterHost: HttpAdapterHost) {
    super();
  }

  override async catch(exception: unknown, host: ArgumentsHost) {
    const hostType = host.getType<NecordContextType>();
    switch (hostType) {
      case 'necord':
        return await this.necord(exception, host);

      default: {
        this.logger.error(exception);
        return super.catch(exception, host);
      }
    }
  }

  private async necord(exception: unknown, host: ArgumentsHost) {
    if (
      exception instanceof Error &&
      exception.message.includes('Unknown interaction')
    ) {
      this.logger.log(exception);
      return;
    }

    const [interaction] = host.getArgByIndex<[Interaction]>(0) ?? [undefined];

    const { title, description } = this.getMessage(exception);
    const message = {
      embeds: [
        new EmbedBuilder()
          .setColor('Red')
          .setTitle(title)
          .setDescription(
            description ??
              'Yikes, something went wrong\nReport this issue to our support staff so that we can resolve it as soon as possible'
          ),
      ],
    };

    if (
      interaction &&
      interaction instanceof BaseInteraction &&
      interaction.isRepliable()
    ) {
      if (interaction.deferred) {
        await interaction.editReply(message);
      } else if (interaction.replied) {
        await interaction.followUp({ ...message, ephemeral: true });
      } else {
        await interaction.reply({ ...message, ephemeral: true });
      }
    }
  }

  private getMessage(err: unknown): { title?: string; description?: string } {
    // Not instance of error
    if (!(err instanceof Error)) {
      this.logger.error(err);
      return { description: `${err}` };
    }

    this.logger.error(err);

    // API Offline
    if ((err as any)['code'] === 'ECONNREFUSED') {
      return { title: 'OFFLINE', description: 'API is offline' };
    }

    // DiscordAPIError
    if (err instanceof DiscordAPIError) {
      this.logger.warn(err);
      return {
        title: 'Discord API Error',
        description: `Yikes we received an error from Discord :\n${codeBlock(
          'fix',
          err.message
        )}`,
      };
    }

    // DiscordClientError
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const clientError = err?.response?.errors?.at(0);
    if (clientError)
      return {
        description: clientError.message,
        title:
          clientError?.extensions?.response?.error ??
          clientError?.extensions?.code ??
          'Error',
      };

    // Other errors
    return { description: err.message, title: err.name };
  }
}
