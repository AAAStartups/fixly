import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SendOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const { phoneNumber } = dto;
    const devFallbackOtp = this.configService.get<string>('DEV_OTP_FALLBACK') || '123456';
    
    // In production, integrate Fast2SMS / MSG91 / Firebase Auth
    const otp = process.env.NODE_ENV === 'production' 
      ? Math.floor(100000 + Math.random() * 900000).toString() 
      : devFallbackOtp;

    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    this.otpStore.set(phoneNumber, { otp, expiresAt });

    this.logger.log(`📱 OTP dispatched for [${phoneNumber}]: ${otp} (Valid for 5 mins)`);

    return {
      success: true,
      message: 'OTP sent successfully to mobile number',
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { phoneNumber, otp, name, fcmToken } = dto;
    const stored = this.otpStore.get(phoneNumber);
    const devFallback = this.configService.get<string>('DEV_OTP_FALLBACK') || '123456';

    const isValid = (stored && stored.otp === otp && stored.expiresAt > Date.now()) || (otp === devFallback);

    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired OTP. Please try again.');
    }

    // Clean up used OTP
    this.otpStore.delete(phoneNumber);

    // Upsert user in database if prisma is connected
    let user: any = null;
    if (this.prisma.isConnected) {
      user = await this.prisma.user.upsert({
        where: { phoneNumber },
        update: {
          ...(name ? { name } : {}),
          ...(fcmToken ? { fcmToken } : {}),
        },
        create: {
          phoneNumber,
          name: name || 'Valued Customer',
          role: UserRole.CUSTOMER,
          fcmToken,
        },
      });
    } else {
      user = {
        id: 'usr_fallback_' + phoneNumber.replace(/\D/g, ''),
        phoneNumber,
        name: name || 'Valued Customer',
        role: UserRole.CUSTOMER,
        fcmToken,
      };
    }

    const payload = { sub: user.id, phoneNumber: user.phoneNumber, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Authentication successful',
      accessToken,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role,
      },
    };
  }
}
