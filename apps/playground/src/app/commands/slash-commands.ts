import { Injectable, ValidationPipe } from '@nestjs/common';
import { IsInt } from 'class-validator';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder } from 'discord.js';
import {  Ctx, Options, SlashCommand, SlashCommandContext, StringOption } from 'necord';

export class HelloOptions {
  @IsInt()
  @StringOption({name:'string',description:'some string',required:true})
  str!:string
}

@Injectable()
export class SlashCommands {
  @SlashCommand({name:'hello',description:'Hello world command'})
  onHello(@Ctx() [interaction]:SlashCommandContext,@Options(new ValidationPipe()) options:HelloOptions){
    return interaction.reply({
      ephemeral:true,
      components:[
      new ActionRowBuilder<MessageActionRowComponentBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('hello/1')
          .setLabel('Integer')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('hello/true')
          .setLabel('Boolean')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('hello/1.5')
          .setLabel('Float')
          .setStyle(ButtonStyle.Primary),
      )
    ]});
  }
}
