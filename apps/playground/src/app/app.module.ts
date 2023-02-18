import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';

import * as components from './components';
import * as commands from './commands';
import * as services from './services';
import * as providers from './providers';

import { APP_FILTER, DiscoveryModule } from '@nestjs/core';
import { ExplorerService } from 'necord/dist/necord-explorer.service';
import { GlobalDiscordFilter } from './filters';

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
    {
      provide: APP_FILTER,
      useClass: GlobalDiscordFilter,
    },
    ...[components, providers, commands, services]
      .map((e) => Object.values(e))
      .flat(),
  ],
})
export class AppModule {}
