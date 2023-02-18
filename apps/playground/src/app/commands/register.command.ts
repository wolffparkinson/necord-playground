import { Injectable, UseInterceptors } from '@nestjs/common';
import { codeBlock, EmbedBuilder } from 'discord.js';
import {
  Ctx,
  Options,
  SlashCommand,
  SlashCommandContext,
  StringOption,
} from 'necord';
import {
  createCommandsAutocomplete,
  createGuildAutocomplete,
} from '../autocomplete';
import { DeferReply } from '../decorators';
import { GuildCommandService } from '../services';

class RegisterOptions {
  @StringOption({
    name: 'name',
    description: 'Command name',
    required: true,
    autocomplete: true,
    min_length: 1,
  })
  name!: string;

  @StringOption({
    name: 'guild',
    description: 'Guild name or ID',
    required: true,
    autocomplete: true,
    min_length: 1,
  })
  guildId!: string;
}

@Injectable()
export class RegisterCommand {
  constructor(private readonly guildCommandService: GuildCommandService) {}

  @DeferReply({ ephemeral: true })
  @UseInterceptors(
    createCommandsAutocomplete('name'),
    createGuildAutocomplete('guild')
  )
  @SlashCommand({
    name: 'register',
    description: 'Register a slash command for a guild',
  })
  async run(
    @Ctx() [i]: SlashCommandContext,
    @Options() { guildId, name }: RegisterOptions
  ) {
    const result = await this.guildCommandService.registerCommand(
      name,
      guildId
    );
    return i.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor('Green')
          .setTitle('Registered')
          .addFields(
            {
              name: 'Guild',
              value: `${codeBlock('fix', guildId)}`,
            },
            {
              name: 'Command',
              value: `${codeBlock('json', JSON.stringify(result, null, 2))}`,
            }
          ),
      ],
    });
  }
}
