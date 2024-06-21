import { Module } from '@nestjs/common';
import { ApiService } from './api/api.service';
import { IcsController } from './ics/ics.controller';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [IcsController],
  providers: [ApiService],
})
export class AppModule {}
