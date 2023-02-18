import { Injectable } from '@nestjs/common';
import { Ctx, SlashCommand, SlashCommandContext } from 'necord';

@Injectable()
export class PingCommand {
  @SlashCommand({ name: 'ping', description: 'Bot status', dmPermission: true })
  async run(@Ctx() [i]: SlashCommandContext) {
    return i.reply({ ephemeral: true, content: 'Pong !' });
  }
}
