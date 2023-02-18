import {
  BadRequestException,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import {
  Client,
  REST,
  RESTPostAPIApplicationGuildCommandsJSONBody,
  RESTPostAPIApplicationGuildCommandsResult,
  RESTPutAPIApplicationCommandsJSONBody,
  Routes,
} from 'discord.js';
import {
  CommandDiscovery,
  CommandsService,
  ContextMenusService,
  SlashCommandsService,
} from 'necord';

@Injectable()
export class GuildCommandService implements OnApplicationBootstrap {
  private readonly logger = new Logger();
  private readonly commands: CommandDiscovery[] = [];
  private readonly guildCommands = new Map<string, string[]>();

  constructor(
    private readonly client: Client,
    private readonly rest: REST,
    private readonly slashCommands: SlashCommandsService,
    private readonly contextMenus: ContextMenusService
  ) {}

  async onApplicationBootstrap() {
    this.commands.push(...this.slashCommands.getCommands());
    this.commands.push(...this.contextMenus.getCommands());

    // Do not await
    this.registerGuilds().catch((e) => this.logger.error(e));
    setInterval(() => this.pollAPI(), 5000);
  }

  async pollAPI() {
    const configs = await this.getGuildConfigs();
    for (const config of configs) {
      const { commands, guildId } = config;
      const guildCommands = this.guildCommands.get(guildId);
      if (!guildCommands) {
        this.guildCommands.set(guildId, commands);
        // Register commands
        continue;
      } else if (!this.hasChanged(guildCommands, commands)) continue;

      // Register commands
    }
  }

  hasChanged(a: string[], b: string[]) {
    if (a.length !== b.length) return true;
    a.some((a) => !b.includes(a)) || b.some((b) => !a.includes(b));
  }

  async registerGuilds() {
    const configs = await this.getGuildConfigs();
    for (const config of configs) {
      const { commands, guildId } = config;
      const cmds = this.commands.filter((c) => {
        return commands.includes(c.getName());
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const data: RESTPutAPIApplicationCommandsJSONBody = cmds.map((cmd) => {
        return cmd.toJSON();
      });

      const result = await this.rest.put(
        Routes.applicationGuildCommands(this.client.user.id, guildId),
        { body: data }
      );
      console.log(result);
    }
  }

  private async getGuildConfigs() {
    // Replace with database call
    return [{ guildId: process.env.DEV_GUILD_ID, commands: ['dynamic'] }];
  }

  async registerCommand(commandName: string, guildId: string) {
    const command = this.commands.find((c) => c.getName() === commandName);
    if (!command) {
      throw new BadRequestException(
        `Command with name : ${commandName} not found`
      );
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return this.createGuildCommand(guildId, command.toJSON());
  }

  private async createGuildCommand(
    guildId: string,
    data: RESTPostAPIApplicationGuildCommandsJSONBody
  ) {
    // Add your database call here
    // this.dbService.insert({guildId,name:data.name})

    const result = await this.rest.post(
      Routes.applicationGuildCommands(this.client.user.id, guildId),
      { body: data }
    );

    return result as RESTPostAPIApplicationGuildCommandsResult;
  }
}
