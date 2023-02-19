import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { NecordExecutionContext } from 'necord';

@Injectable()
export class LicencedCommandGuard implements CanActivate {
  private readonly logger = new Logger(LicencedCommandGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = NecordExecutionContext.create(context);
    const [i] = ctx.getContext<'interactionCreate'>();

    if (!i.inGuild()) {
      throw new ForbiddenException('Command not allowed inside Discord DMs');
    }

    if (!i.isCommand()) {
      return;
    }
    const { guildId, commandName } = i;

    const licenced = await this.getLicencedCommands(guildId);
    if (licenced.includes(commandName)) return true;

    throw new ForbiddenException(
      'You are not authorized to use that command : Upgrade'
    );
  }

  async getLicencedCommands(guildId: string) {
    return ['test'];
  }
}
