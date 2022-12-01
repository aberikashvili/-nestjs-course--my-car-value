import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/user.entity';
import { ReportEntity } from './reports/report.entity';
import { RxjsModule } from './rxjs/rxjs.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dbConfig = require('../ormconfig.js');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot(dbConfig),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     type: 'sqlite',
    //     database: config.get<string>('DB_NAME'),
    //     synchronize: true,
    //     entities: [UserEntity, ReportEntity],
    //   }),
    // }),
    UsersModule,
    ReportsModule,
    RxjsModule,
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [UserEntity, ReportEntity],
    //   synchronize: true,
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // Applying Globally Scoped Pipes
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private _configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // Applying Globally Scoped Middlewares
    consumer
      .apply(
        cookieSession({
          keys: [this._configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
