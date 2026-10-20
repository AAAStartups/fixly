import { Controller, Post, Get, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, RespondEstimateDto, ClaimWarrantyDto } from './dto/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get('active')
  async getActiveOrder(@Query('customerId') customerId?: string) {
    return this.ordersService.getActiveOrder(customerId);
  }

  @Get('history')
  async getOrderHistory(@Query('customerId') customerId?: string) {
    return this.ordersService.getOrderHistory(customerId);
  }

  @Post('upload-media')
  async uploadMedia(@Body() body: { fileName: string; fileType: string }) {
    return this.ordersService.getPresignedUploadUrl(body.fileName, body.fileType);
  }

  @Get(':id')
  async getOrderById(@Param('id') orderId: string) {
    return this.ordersService.getOrderById(orderId);
  }

  @Post(':id/estimate/respond')
  async respondToEstimate(
    @Param('id') orderId: string,
    @Body() dto: RespondEstimateDto,
  ) {
    return this.ordersService.respondToEstimate(orderId, dto);
  }

  @Get(':id/invoice')
  async getInvoice(@Param('id') orderId: string) {
    return this.ordersService.getInvoice(orderId);
  }

  @Post(':id/warranty/claim')
  async claimWarranty(
    @Param('id') orderId: string,
    @Body() dto: ClaimWarrantyDto,
  ) {
    return this.ordersService.claimWarranty(orderId, dto);
  }
}
