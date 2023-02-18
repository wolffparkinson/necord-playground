import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { DeferInteractionGuard } from './defer-interaction.guard';

export const DEFER_INTERACTION = 'discord:__defer_interaction__';
export type DeferOptions =
  | { ephemeral?: boolean; mode: 'reply' | 'update' }
  | undefined;

export const DeferReply = (options?: { ephemeral?: boolean }) => {
  return applyDecorators(
    SetMetadata(
      DEFER_INTERACTION,
      options ? { ...options, mode: 'reply' } : undefined
    ),
    UseGuards(DeferInteractionGuard)
  );
};
export const DeferUpdate = () => {
  return applyDecorators(
    SetMetadata(DEFER_INTERACTION, { mode: 'update' }),
    UseGuards(DeferInteractionGuard)
  );
};
