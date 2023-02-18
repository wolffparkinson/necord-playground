import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';

import * as events from './events';
import * as components from './components';
import * as commands from './commands';

@Module({
  imports: [
    NecordModule.forRoot({
      intents: ['Guilds'],
      token: process.env['DISCORD_TOKEN'],
      prefix: '.',
    }),
  ],
  providers: [
    ...[events, components, commands].map((e) => Object.values(e)).flat(),
  ],
})
export class AppModule {}
