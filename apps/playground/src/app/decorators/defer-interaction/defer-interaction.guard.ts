import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NecordExecutionContext } from 'necord';
import { DeferOptions, DEFER_INTERACTION } from './defer-interaction.decorator';

@Injectable()
export class DeferInteractionGuard implements CanActivate {
  private readonly logger = new Logger(DeferInteractionGuard.name);

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = NecordExecutionContext.create(context);
    const interaction = ctx.getContext<'interactionCreate'>()[0];

    const defer = this.reflector.getAllAndOverride<DeferOptions>(
      DEFER_INTERACTION,
      [context.getHandler(), context.getClass()]
    );

    if (defer) {
      if (interaction.isRepliable()) {
        if (defer.mode === 'reply') {
          await interaction.deferReply(defer);
        }
      }
      if (interaction.isMessageComponent()) {
        if (defer.mode === 'update') {
          await interaction.deferUpdate();
        }
      }
    }

    return true;
  }
}
