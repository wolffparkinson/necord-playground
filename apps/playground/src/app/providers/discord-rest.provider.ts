import { Provider } from '@nestjs/common';
import { REST } from 'discord.js';

export const DiscordRestProvider: Provider<REST> = {
  provide: REST,
  useFactory: () => new REST().setToken(process.env.DISCORD_TOKEN),
};
