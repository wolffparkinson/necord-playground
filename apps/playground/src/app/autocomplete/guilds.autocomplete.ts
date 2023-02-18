import { Injectable } from '@nestjs/common';
import { AutocompleteInteraction, CacheType, Client } from 'discord.js';
import { AutocompleteInterceptor } from './autocomplete.interceptor';

export const createGuildAutocomplete = (option: string) => {
  @Injectable()
  class GuildAutocomplete extends AutocompleteInterceptor {
    constructor(private readonly client: Client) {
      super(option);
    }

    async transformOptions(i: AutocompleteInteraction<CacheType>) {
      let query = i.options.getString(option, true);
      query = query.trim().toLowerCase();
      let results = this.client.guilds.cache;
      if (query.length) {
        results = results.filter((guild) => {
          if (guild.id.includes(query)) return true;
          if (guild.name.toLowerCase().includes(query)) return true;
        });
      }

      return i.respond(
        results
          .map((g) => ({ name: `${g.name}・${g.id}`, value: g.id }))
          .slice(0, 24)
      );
    }
  }

  return GuildAutocomplete;
};
