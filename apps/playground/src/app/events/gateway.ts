import { Injectable, Logger } from '@nestjs/common';
import { ContextOf, Ctx, On } from 'necord';

@Injectable()
export class Gateway {
  private logger = new Logger(Gateway.name);

  @On('debug')
  onDebug(@Ctx() [data]: ContextOf<'debug'>) {
    this.logger.debug(data);
  }

  @On('warn')
  onWarn(@Ctx() [data]: ContextOf<'warn'>) {
    this.logger.warn(data);
  }

  @On('error')
  onError(@Ctx() [data]: ContextOf<'error'>) {
    this.logger.error(data);
  }
}
