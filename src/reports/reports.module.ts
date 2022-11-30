import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from './report.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  controllers: [ReportsController],
  imports: [TypeOrmModule.forFeature([ReportEntity])],
  providers: [ReportsService],
})
export class ReportsModule {}
