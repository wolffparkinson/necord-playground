import { IsNumber } from 'class-validator';
import { Injectable,  ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { Button, ButtonContext, ComponentParam, Ctx } from 'necord';
import { codeBlock } from 'discord.js';
import { Type } from 'class-transformer';

export const vPipe = (options:ValidationPipeOptions) => {
  return new ValidationPipe({validateCustomDecorators:true,...options})
}

export class ButtonOptions {
  @IsNumber()
  @Type(()=>Number)
  arg1!:number  
}

@Injectable()
export class Buttons {
  @Button('hello/:arg1')
  onHello(@Ctx() [interaction]:ButtonContext,@ComponentParam(new ValidationPipe({validateCustomDecorators:true,transform:true})) params: ButtonOptions){
    return interaction.reply({
      ephemeral:true,
      content:codeBlock('JSON',JSON.stringify(params))
    })
  }
}
