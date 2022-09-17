import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';

import { TextCommands } from './commands/text-commands';
import { Gateway } from './events/gateway';
import { Buttons } from './components/buttons';
import { SlashCommands } from './commands/slash-commands';

@Module({
  imports: [
    NecordModule.forRoot({
      intents: ['Guilds', 'GuildMessages', 'MessageContent'],
      token:process.env['DISCORD_TOKEN'],
      prefix: '.',
    }),
  ],
  providers: [TextCommands,SlashCommands, Gateway, Buttons],
})
export class AppModule {}
