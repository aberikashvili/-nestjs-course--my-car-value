import { Module } from '@nestjs/common';
import { RxjsController } from './rxjs.controller';

@Module({
  controllers: [RxjsController]
})
export class RxjsModule {}
