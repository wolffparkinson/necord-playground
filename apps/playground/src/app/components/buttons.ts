import { IsInt } from 'class-validator';
import { Injectable, ValidationPipe } from '@nestjs/common';
import { Button, ButtonContext, ComponentParam, Ctx } from 'necord';
import { codeBlock } from 'discord.js';

export class ButtonOptions {
  @IsInt()
  arg1!:number  
}

@Injectable()
export class Buttons {
  @Button('hello/:arg1')
  onHello(@Ctx() [interaction]:ButtonContext,@ComponentParam(new ValidationPipe()) params: ButtonOptions){
    return interaction.reply({
      ephemeral:true,
      content:codeBlock('JSON',JSON.stringify(params))
    })
  }
}
