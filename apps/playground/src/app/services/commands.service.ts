import {
  BadRequestException,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import {
  CommandsService,
  SlashCommandDiscovery,
  SlashCommandsService,
} from 'necord';
import { ExplorerService } from 'necord/dist/necord-explorer.service';
import {
  Client,
  REST,
  RESTPostAPIApplicationGuildCommandsJSONBody,
  RESTPostAPIApplicationGuildCommandsResult,
  Routes,
} from 'discord.js';

@Injectable()
export class GuildCommandService implements OnApplicationBootstrap {
  private readonly logger = new Logger();

  constructor(
    private readonly slashCommandService: SlashCommandsService,
    private readonly explorerService: ExplorerService<SlashCommandDiscovery>,
    private readonly commandService: CommandsService,
    private readonly client: Client,
    private readonly rest: REST
  ) {}

  async onApplicationBootstrap() {
    this.client.once('ready', async (client) =>
      this.commandService.register(client)
    );

    // TODO: Figure something out for initial registration
    // await this.updateMeta();
    // setInterval(() => this.updateMeta(), 60000);
  }

  // // Fetch guild ids from API
  // async fetchGuildIds() {
  //   return [{ id: 1, name: 'dynamic', guildIds: [process.env.DB_GUILD_ID] }];
  // }

  // async updateMeta() {
  //   this.logger.verbose('Updating metadata for SlashCommands');

  //   const slashCommands = this.explorerService.explore(SLASH_COMMAND_METADATA);
  //   this.logger.verbose(`${slashCommands.length} SlashCommand (s) explored`);

  //   const db = await this.fetchGuildIds();
  //   slashCommands.forEach((command) => {
  //     this.slashCommandService.add(command);
  //     const data = db.find((d) => d.name === command.getName());
  //     if (!data) return;

  //     this.logger.verbose(
  //       `Updating  metadata (guildIds) for SlashCommand : ${command.getName()}`
  //     );
  //     this.showInfo(command);

  //     command['meta']['guilds'] = data.guildIds ?? [];
  //     this.slashCommandService.add(command);
  //     this.showInfo(command);
  //   });

  //   if (!this.client.isReady()) return;
  //   await this.commandService.register(this.client);
  // }

  // private showInfo(command: CommandDiscovery) {
  //   this.logger.debug({ guildIds: command.getGuilds() ?? [] });
  // }

  register(commandName: string, guildId: string) {
    const command = this.client.application.commands.cache.find(
      (c) => c.name === commandName
    );
    if (!command) {
      throw new BadRequestException(
        `Command with name : ${commandName} is not present in application command cache`
      );
    }
    return this.createGuildCommand(guildId, command);
  }

  async createGuildCommand(
    guildId: string,
    data: RESTPostAPIApplicationGuildCommandsJSONBody
  ) {
    const result = await this.rest.post(
      Routes.applicationGuildCommands(this.client.user.id, guildId),
      { body: data }
    );
    return result as RESTPostAPIApplicationGuildCommandsResult;
  }
}
