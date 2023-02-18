import { Injectable } from '@nestjs/common';
import { AutocompleteInteraction, CacheType } from 'discord.js';
import { ContextMenusService, SlashCommandsService } from 'necord';
import { AutocompleteInterceptor } from './autocomplete.interceptor';

export const createCommandsAutocomplete = (option: string) => {
  @Injectable()
  class DiscoveryAutocomplete extends AutocompleteInterceptor {
    constructor(
      private readonly slashCommands: SlashCommandsService,
      private readonly contextMenus: ContextMenusService
    ) {
      super(option);
    }

    async transformOptions(i: AutocompleteInteraction<CacheType>) {
      let query = i.options.getString(option, true);
      query = query.trim().toLowerCase();

      let results = [
        ...this.slashCommands.getCommands(),
        ...this.contextMenus.getCommands(),
      ];

      if (query.length) {
        results = results.filter((command) => {
          return command.getName().toLowerCase().includes(query);
        });
      }

      return i.respond(
        results
          .map((c) => ({ name: `${c.getName()}`, value: c.getName() }))
          .slice(0, 24)
      );
    }
  }

  return DiscoveryAutocomplete;
};
