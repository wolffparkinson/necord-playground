import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';

import * as events from './events';
import * as components from './components';
import * as commands from './commands';
import * as services from './services';
import { DiscoveryModule } from '@nestjs/core';
import { ExplorerService } from 'necord/dist/necord-explorer.service';

@Module({
  imports: [
    NecordModule.forRoot({
      intents: ['Guilds'],
      token: process.env['DISCORD_TOKEN'],
      prefix: '.',
      skipRegistration: true,
    }),
    DiscoveryModule,
  ],
  providers: [
    ExplorerService,
    ...[events, components, commands, services]
      .map((e) => Object.values(e))
      .flat(),
  ],
})
export class AppModule {}
