import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { UserEntity } from '../users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetestimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
@Serialize(ReportDto)
export class ReportsController {
  constructor(private _reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createReport(
    @Body() body: CreateReportDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this._reportsService.create(body, currentUser);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this._reportsService.changeApproval(+id, body.approved);
  }

  @Get()
  getEstimate(@Query() query: GetestimateDto) {
    // console.log(query);
    return this._reportsService.createEstimate(query);
  }
}
