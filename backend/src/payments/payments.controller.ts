import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentOrderDto, VerifyPaymentDto } from './dto/payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('razorpay/create-order')
  @HttpCode(HttpStatus.OK)
  async createOrder(@Body() dto: CreatePaymentOrderDto) {
    return this.paymentsService.createRazorpayOrder(dto);
  }

  @Post('razorpay/verify')
  @HttpCode(HttpStatus.OK)
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyRazorpayPayment(dto);
  }
}
