import { IsNotEmpty, IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  modelId: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsOptional()
  @IsString()
  pickupDate?: string;

  @IsOptional()
  @IsString()
  pickupSlot?: string;

  @IsOptional()
  @IsString()
  pickupAddress?: string;

  @IsOptional()
  @IsString()
  issueDescription?: string;

  @IsOptional()
  @IsArray()
  customerMedia?: string[];

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  customerName?: string;
}

export class RespondEstimateDto {
  @IsNotEmpty()
  isApproved: boolean;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class ClaimWarrantyDto {
  @IsNotEmpty()
  @IsString()
  claimNotes: string;
}
