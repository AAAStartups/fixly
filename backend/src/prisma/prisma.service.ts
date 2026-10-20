import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public isConnected = false;

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('🚀 Successfully connected to PostgreSQL via Prisma ORM.');
    } catch (error) {
      this.isConnected = false;
      this.logger.warn(
        `⚠️ Could not connect to PostgreSQL (${error?.message || 'DB Unavailable'}). Using resilient fallback state until database is active.`,
      );
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
      this.logger.log('Prisma ORM disconnected.');
    }
  }
}
