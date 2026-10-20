import { IsNotEmpty, IsPhoneNumber, IsString, IsOptional } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  fcmToken?: string;
}
