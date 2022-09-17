import { Injectable } from '@nestjs/common';
import { codeBlock } from 'discord.js';
import { Button, ButtonContext, ComponentParam, Ctx } from 'necord';

export class ButtonOptions {
  arg1!:number  
}

@Injectable()
export class Buttons {
  @Button('hello/:arg1')
  onHello(@Ctx() [interaction]:ButtonContext,@ComponentParam() params: ButtonOptions){
    return interaction.reply({
      ephemeral:true,
      content:codeBlock('JSON',JSON.stringify(params))
    })
  }
}
