import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  AssignRiderDto,
  AssignTechDto,
  SubmitDiagnosisDto,
  CreateEstimateDto,
  UpdateOrderStatusDto,
  ManageSparePartDto,
} from './dto/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('orders')
  async getOrders(
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getOrders(status, page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Patch('orders/:id/assign-rider')
  async assignRider(@Param('id') orderId: string, @Body() dto: AssignRiderDto) {
    return this.adminService.assignRider(orderId, dto);
  }

  @Patch('orders/:id/assign-tech')
  async assignTechnician(@Param('id') orderId: string, @Body() dto: AssignTechDto) {
    return this.adminService.assignTechnician(orderId, dto);
  }

  @Post('orders/:id/diagnosis')
  async submitDiagnosis(@Param('id') orderId: string, @Body() dto: SubmitDiagnosisDto) {
    return this.adminService.submitDiagnosis(orderId, dto);
  }

  @Post('orders/:id/estimate')
  async createEstimate(@Param('id') orderId: string, @Body() dto: CreateEstimateDto) {
    return this.adminService.createEstimate(orderId, dto);
  }

  @Patch('orders/:id/status')
  async updateOrderStatus(@Param('id') orderId: string, @Body() dto: UpdateOrderStatusDto) {
    return this.adminService.updateOrderStatus(orderId, dto);
  }

  @Get('inventory/parts')
  async getPartsInventory() {
    return this.adminService.getPartsInventory();
  }

  @Post('inventory/parts')
  async upsertSparePart(@Body() dto: ManageSparePartDto) {
    return this.adminService.upsertSparePart(dto);
  }
}
