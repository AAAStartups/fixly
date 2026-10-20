import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('FIXLY-Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS for web and mobile clients
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable request validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`========================================================`);
  logger.log(`🚀 FIXLY Backend API Service is running on port ${port}`);
  logger.log(`📡 Base API URL: http://localhost:${port}/api/v1`);
  logger.log(`🔌 WebSocket Gateway (Socket.IO): ws://localhost:${port}`);
  logger.log(`========================================================`);
  logger.log(`Available Endpoints:`);
  logger.log(`• POST /api/v1/auth/otp/send`);
  logger.log(`• POST /api/v1/auth/otp/verify`);
  logger.log(`• GET  /api/v1/catalog/brands`);
  logger.log(`• GET  /api/v1/catalog/brands/:id/models`);
  logger.log(`• GET  /api/v1/catalog/services`);
  logger.log(`• GET  /api/v1/catalog/estimates`);
  logger.log(`• POST /api/v1/orders/create`);
  logger.log(`• GET  /api/v1/orders/active`);
  logger.log(`• GET  /api/v1/orders/history`);
  logger.log(`• POST /api/v1/orders/:id/estimate/respond`);
  logger.log(`• GET  /api/v1/orders/:id/invoice`);
  logger.log(`• POST /api/v1/orders/:id/warranty/claim`);
  logger.log(`• POST /api/v1/payments/razorpay/create-order`);
  logger.log(`• POST /api/v1/payments/razorpay/verify`);
  logger.log(`• GET  /api/v1/admin/dashboard/stats`);
  logger.log(`• GET  /api/v1/admin/orders`);
  logger.log(`• PATCH /api/v1/admin/orders/:id/status`);
  logger.log(`========================================================`);
}
bootstrap();
