import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Standard catalog definitions matching plan.md & client specifications
const FALLBACK_BRANDS = [
  { id: 'apple', name: 'Apple', logoText: '', color: '#FFFFFF' },
  { id: 'samsung', name: 'Samsung', logoText: 'SAMSUNG', color: '#1428A0' },
  { id: 'oneplus', name: 'OnePlus', logoText: '1+', color: '#EB0029' },
  { id: 'google', name: 'Google', logoText: 'G', color: '#4285F4' },
  { id: 'xiaomi', name: 'Xiaomi', logoText: 'mi', color: '#FF6900' },
  { id: 'vivo', name: 'Vivo', logoText: 'vivo', color: '#008CD6' },
  { id: 'motorola', name: 'Motorola', logoText: 'M', color: '#00142E' },
  { id: 'realme', name: 'Realme', logoText: 'realme', color: '#FFC915' },
  { id: 'oppo', name: 'OPPO', logoText: 'oppo', color: '#008B45' },
  { id: 'poco', name: 'POCO', logoText: 'POCO', color: '#FFD600' },
  { id: 'iqoo', name: 'iQOO', logoText: 'iQOO', color: '#F18800' },
  { id: 'huawei', name: 'Huawei', logoText: 'HUAWEI', color: '#CF0A2C' },
];

const FALLBACK_MODELS: Record<string, any[]> = {
  xiaomi: [
    { id: 'xm-11i', brandId: 'xiaomi', name: 'Xiaomi 11i 5G', year: '2022', network: '5G' },
    { id: 'xm-11i-hc', brandId: 'xiaomi', name: 'Xiaomi 11i HyperCharge', year: '2022', network: '5G' },
    { id: 'xm-11-lite', brandId: 'xiaomi', name: 'Xiaomi 11 Lite NE 5G', year: '2021', network: '5G' },
    { id: 'xm-11t-pro', brandId: 'xiaomi', name: 'Xiaomi 11T Pro 5G', year: '2021', network: '5G' },
    { id: 'xm-12-pro', brandId: 'xiaomi', name: 'Xiaomi 12 Series 12 Pro 5G', year: '2022', network: '5G' },
    { id: 'xm-7a', brandId: 'xiaomi', name: 'Xiaomi 7A', year: '2019', network: '4G' },
    { id: 'xm-8', brandId: 'xiaomi', name: 'Xiaomi 8', year: '2018', network: '4G' },
  ],
  apple: [
    { id: 'ap-14', brandId: 'apple', name: 'iPhone 14', year: '2022', network: '5G' },
    { id: 'ap-13', brandId: 'apple', name: 'iPhone 13', year: '2021', network: '5G' },
    { id: 'ap-12', brandId: 'apple', name: 'iPhone 12', year: '2020', network: '5G' },
  ],
  samsung: [
    { id: 'sam-s23', brandId: 'samsung', name: 'Galaxy S23', year: '2023', network: '5G' },
    { id: 'sam-s22', brandId: 'samsung', name: 'Galaxy S22', year: '2022', network: '5G' },
  ],
  oneplus: [
    { id: 'op-11', brandId: 'oneplus', name: 'OnePlus 11 5G', year: '2023', network: '5G' },
    { id: 'op-10', brandId: 'oneplus', name: 'OnePlus 10 Pro', year: '2022', network: '5G' },
  ],
};

const FALLBACK_SERVICES = [
  {
    id: 'srv-display',
    code: 'display',
    title: 'Display',
    subtitle: 'Screen replacement (OEM)',
    price: 4299,
    warranty: '6 months warranty',
    live: true,
    icon: 'smartphone',
  },
  {
    id: 'srv-battery',
    code: 'battery',
    title: 'Battery',
    subtitle: 'Battery replacement (OEM)',
    price: 2249,
    warranty: '6 months warranty',
    live: true,
    icon: 'battery-charging',
  },
  {
    id: 'srv-charging',
    code: 'charging-port',
    title: 'Charging Port',
    subtitle: 'Charging issue / port replacement',
    price: 1299,
    warranty: '6 months warranty',
    live: true,
    icon: 'zap',
  },
  {
    id: 'srv-camera',
    code: 'camera',
    title: 'Camera',
    subtitle: 'Front / Back camera replacement',
    price: 2999,
    warranty: '6 months warranty',
    live: true,
    icon: 'camera',
  },
  {
    id: 'srv-speaker',
    code: 'speaker',
    title: 'Speaker',
    subtitle: 'Sound issue / speaker replacement',
    price: 1499,
    warranty: '6 months warranty',
    live: true,
    icon: 'volume-2',
  },
  {
    id: 'srv-water',
    code: 'water-damage',
    title: 'Water Damage',
    subtitle: 'Diagnosis & repair',
    price: 1999,
    warranty: '6 months warranty',
    live: true,
    icon: 'droplets',
  },
];

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async getBrands() {
    if (this.prisma.isConnected) {
      try {
        const brands = await this.prisma.deviceBrand.findMany({
          orderBy: { name: 'asc' },
        });
        if (brands.length > 0) return brands;
      } catch (err) {
        // fallback
      }
    }
    return FALLBACK_BRANDS;
  }

  async getModelsByBrand(brandId: string) {
    if (this.prisma.isConnected) {
      try {
        const models = await this.prisma.deviceModel.findMany({
          where: { brandId: { equals: brandId, mode: 'insensitive' } },
        });
        if (models.length > 0) return models;
      } catch (err) {
        // fallback
      }
    }

    const key = brandId.toLowerCase();
    const fallbackList = FALLBACK_MODELS[key];
    if (fallbackList) return fallbackList;

    // Default to generic models if brand exists
    const brand = FALLBACK_BRANDS.find((b) => b.id.toLowerCase() === key);
    if (brand) {
      return [
        { id: `${key}-pro-1`, brandId: key, name: `${brand.name} Pro Edition`, year: '2023', network: '5G' },
        { id: `${key}-base-1`, brandId: key, name: `${brand.name} Standard 5G`, year: '2022', network: '5G' },
      ];
    }
    return [];
  }

  async getServices() {
    if (this.prisma.isConnected) {
      try {
        const services = await this.prisma.repairServiceCatalog.findMany({
          orderBy: { sortOrder: 'asc' },
        });
        if (services.length > 0) {
          return services.map((s) => ({
            id: s.id,
            code: s.code,
            title: s.title,
            subtitle: s.subtitle,
            price: Number(s.basePrice),
            warranty: s.warrantyText,
            live: s.isLiveStreamSupported,
            icon: s.icon,
          }));
        }
      } catch (err) {
        // fallback
      }
    }
    return FALLBACK_SERVICES;
  }

  async getEstimates(issueCategory?: string) {
    const services = await this.getServices();
    if (!issueCategory) {
      return {
        pickupFee: 79.0,
        services,
      };
    }
    const matched = services.find((s) => s.code.toLowerCase() === issueCategory.toLowerCase());
    return {
      pickupFee: 79.0,
      matchedService: matched || null,
      estimatedRange: matched ? `₹${matched.price} - ₹${matched.price + 500}` : '₹999 - ₹4,999',
    };
  }
}
