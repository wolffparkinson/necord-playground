import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NecordExecutionContext } from 'necord';
@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = NecordExecutionContext.create(context);
    const [interaction] = ctx.getContext<'interactionCreate'>();
    if (!interaction.isChatInputCommand()) return false

    // Business logic

    return false
    
  }
}
