import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { AutocompleteInteraction, InteractionType } from 'discord.js';
import { AutocompleteContext, NecordExecutionContext } from 'necord';

@Injectable()
export abstract class AutocompleteInterceptor implements NestInterceptor {
  constructor(readonly optionName?: string) {}

  public abstract transformOptions(
    interaction: AutocompleteInteraction,
    next?: CallHandler<any>
  );

  public async intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Promise<Observable<any>> {
    const necordContext = NecordExecutionContext.create(context);
    const [interaction] = necordContext.getContext<AutocompleteContext>();
    const discovery = necordContext.getDiscovery();

    if (
      interaction.type !== InteractionType.ApplicationCommandAutocomplete ||
      !discovery.isSlashCommand()
    ) {
      return next.handle();
    }

    if (
      this.optionName &&
      interaction.options.getFocused(true).name !== this.optionName
    ) {
      return next.handle();
    }

    return of(this.transformOptions(interaction, next));
  }
}
