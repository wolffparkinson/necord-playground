import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  CommandDiscovery,
  CommandsService,
  SlashCommandDiscovery,
  SlashCommandsService,
  SLASH_COMMAND_METADATA,
} from 'necord';
import { ExplorerService } from 'necord/dist/necord-explorer.service';
import { Client } from 'discord.js';

@Injectable()
export class CommandService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CommandService.name);

  constructor(
    private readonly slashCommandService: SlashCommandsService,
    private readonly explorerService: ExplorerService<SlashCommandDiscovery>,
    private readonly commandService: CommandsService,
    private readonly client: Client
  ) {}

  async onApplicationBootstrap() {
    await this.updateMeta();
  }

  // Fetch guild ids from API
  async fetchGuildIds() {
    return [{ id: 1, name: 'dynamic', guildIds: [process.env.DB_GUILD_ID] }];
  }

  async updateMeta() {
    this.logger.log('Updating metadata for SlashCommands');

    const slashCommands = this.explorerService.explore(SLASH_COMMAND_METADATA);
    this.logger.log(`${slashCommands.length} SlashCommand (s) explored`);

    const db = await this.fetchGuildIds();
    slashCommands.forEach((command) => {
      this.slashCommandService.add(command);
      const data = db.find((d) => d.name === command.getName());
      if (!data) return;

      this.logger.log(
        `Updating guildIds for SlashCommand : ${command.getName()}`
      );
      this.showInfo(command);

      command['meta']['guilds'] = [
        ...(command.getGuilds() ?? []),
        ...data.guildIds,
      ];
      this.slashCommandService.add(command);
      this.showInfo(command);
    });

    this.client.once('ready', async (client) =>
      this.commandService.register(client as any)
    );

    return;
  }

  private showInfo(command: CommandDiscovery) {
    this.logger.log({ guildIds: command.getGuilds() ?? [] });
  }
}
