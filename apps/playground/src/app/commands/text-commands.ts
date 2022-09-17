import { Injectable } from '@nestjs/common';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, codeBlock, MessageActionRowComponentBuilder } from 'discord.js';
import { Args, Ctx, TextCommand, TextCommandContext } from 'necord';

@Injectable()
export class TextCommands {
  @TextCommand({name:'hello',description:'Hello world command'})
  onHello(@Ctx() [message]: TextCommandContext,@Args() args:string[]){
    return message.reply({
      content:codeBlock('JSON',JSON.stringify(args)),
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
