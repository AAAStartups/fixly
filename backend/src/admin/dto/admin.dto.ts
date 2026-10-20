import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray, IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class AssignRiderDto {
  @IsNotEmpty()
  @IsString()
  riderId: string;
}

export class AssignTechDto {
  @IsNotEmpty()
  @IsString()
  technicianId: string;
}

export class SubmitDiagnosisDto {
  @IsNotEmpty()
  @IsString()
  diagnosisNotes: string;

  @IsOptional()
  @IsArray()
  requiredParts?: string[];
}

export class CreateEstimateDto {
  @IsNotEmpty()
  @IsNumber()
  laborFee: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  pickupFee?: number;

  @IsNotEmpty()
  @IsArray()
  items: { title: string; amount: number; partId?: string }[];
}

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  timelineTitle?: string;

  @IsOptional()
  @IsString()
  timelineDescription?: string;
}

export class ManageSparePartDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  modelId: string;

  @IsNotEmpty()
  @IsString()
  partName: string;

  @IsNotEmpty()
  @IsString()
  partCode: string;

  @IsNotEmpty()
  @IsNumber()
  costPrice: number;

  @IsNotEmpty()
  @IsNumber()
  sellingPrice: number;

  @IsNotEmpty()
  @IsNumber()
  stockQuantity: number;

  @IsOptional()
  @IsNumber()
  minThreshold?: number;
}

export class UpdatePricingServiceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @IsOptional()
  @IsString()
  warrantyText?: string;

  @IsOptional()
  isLiveStreamSupported?: boolean;

  @IsOptional()
  @IsString()
  icon?: string;
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  addressLine?: string;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  pincode?: string;
}

export class UpdateOrderDetailsDto {
  @IsOptional()
  @IsString()
  issueDescription?: string;

  @IsOptional()
  @IsString()
  diagnosisNotes?: string;

  @IsOptional()
  @IsNumber()
  pickupFee?: number;

  @IsOptional()
  pickupSlot?: string | Date;
}

