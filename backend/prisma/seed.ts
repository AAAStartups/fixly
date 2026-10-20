import { PrismaClient, UserRole, OrderStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FIXLY Database Seed...');

  // 1. Seed Brands
  const brandsData = [
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

  for (const b of brandsData) {
    await prisma.deviceBrand.upsert({
      where: { id: b.id },
      update: b,
      create: b,
    });
  }
  console.log(`✅ Seeded ${brandsData.length} Device Brands.`);

  // 2. Seed Device Models
  const modelsData = [
    {
      id: 'xm-11i',
      brandId: 'xiaomi',
      name: 'Xiaomi 11i 5G',
      year: '2022',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'xm-11i-hc',
      brandId: 'xiaomi',
      name: 'Xiaomi 11i HyperCharge',
      year: '2022',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'xm-11-lite',
      brandId: 'xiaomi',
      name: 'Xiaomi 11 Lite NE 5G',
      year: '2021',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'xm-11t-pro',
      brandId: 'xiaomi',
      name: 'Xiaomi 11T Pro 5G',
      year: '2021',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'xm-12-pro',
      brandId: 'xiaomi',
      name: 'Xiaomi 12 Series 12 Pro 5G',
      year: '2022',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'xm-7a',
      brandId: 'xiaomi',
      name: 'Xiaomi 7A',
      year: '2019',
      network: '4G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'xm-8',
      brandId: 'xiaomi',
      name: 'Xiaomi 8',
      year: '2018',
      network: '4G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'ap-14',
      brandId: 'apple',
      name: 'iPhone 14',
      year: '2022',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'ap-13',
      brandId: 'apple',
      name: 'iPhone 13',
      year: '2021',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'sam-s23',
      brandId: 'samsung',
      name: 'Galaxy S23',
      year: '2023',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'op-11',
      brandId: 'oneplus',
      name: 'OnePlus 11 5G',
      year: '2023',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80',
    },
  ];

  for (const m of modelsData) {
    await prisma.deviceModel.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }
  console.log(`✅ Seeded ${modelsData.length} Device Models.`);

  // 3. Seed Repair Services Catalog
  const servicesCatalog = [
    {
      id: 'srv-display',
      code: 'display',
      title: 'Display',
      subtitle: 'Screen replacement (OEM)',
      basePrice: 4299.00,
      warrantyText: '6 months warranty',
      isLiveStreamSupported: true,
      icon: 'smartphone',
      sortOrder: 1,
    },
    {
      id: 'srv-battery',
      code: 'battery',
      title: 'Battery',
      subtitle: 'Battery replacement (OEM)',
      basePrice: 2249.00,
      warrantyText: '6 months warranty',
      isLiveStreamSupported: true,
      icon: 'battery-charging',
      sortOrder: 2,
    },
    {
      id: 'srv-charging',
      code: 'charging-port',
      title: 'Charging Port',
      subtitle: 'Charging issue / port replacement',
      basePrice: 1299.00,
      warrantyText: '6 months warranty',
      isLiveStreamSupported: true,
      icon: 'zap',
      sortOrder: 3,
    },
    {
      id: 'srv-camera',
      code: 'camera',
      title: 'Camera',
      subtitle: 'Front / Back camera replacement',
      basePrice: 2999.00,
      warrantyText: '6 months warranty',
      isLiveStreamSupported: true,
      icon: 'camera',
      sortOrder: 4,
    },
    {
      id: 'srv-speaker',
      code: 'speaker',
      title: 'Speaker',
      subtitle: 'Sound issue / speaker replacement',
      basePrice: 1499.00,
      warrantyText: '6 months warranty',
      isLiveStreamSupported: true,
      icon: 'volume-2',
      sortOrder: 5,
    },
    {
      id: 'srv-water',
      code: 'water-damage',
      title: 'Water Damage',
      subtitle: 'Diagnosis & repair',
      basePrice: 1999.00,
      warrantyText: '6 months warranty',
      isLiveStreamSupported: true,
      icon: 'droplets',
      sortOrder: 6,
    },
  ];

  for (const s of servicesCatalog) {
    await prisma.repairServiceCatalog.upsert({
      where: { code: s.code },
      update: s,
      create: s,
    });
  }
  console.log(`✅ Seeded ${servicesCatalog.length} Repair Services.`);

  // 4. Seed Spare Parts Inventory
  const partsData = [
    {
      modelId: 'xm-11t-pro',
      partName: 'Xiaomi 11T Pro AMOLED 120Hz Display Assembly',
      partCode: 'PART-XM11TP-DISP',
      costPrice: 2800.00,
      sellingPrice: 4299.00,
      stockQuantity: 14,
      minThreshold: 4,
    },
    {
      modelId: 'xm-11t-pro',
      partName: 'Xiaomi 11T Pro High-Density Battery 5000mAh',
      partCode: 'PART-XM11TP-BAT',
      costPrice: 1200.00,
      sellingPrice: 2249.00,
      stockQuantity: 25,
      minThreshold: 5,
    },
    {
      modelId: 'xm-11t-pro',
      partName: 'Xiaomi 11T Pro 120W USB-C Charging Sub-board',
      partCode: 'PART-XM11TP-PORT',
      costPrice: 550.00,
      sellingPrice: 1299.00,
      stockQuantity: 18,
      minThreshold: 3,
    },
    {
      modelId: 'ap-14',
      partName: 'iPhone 14 Super Retina XDR OLED Display',
      partCode: 'PART-AP14-DISP',
      costPrice: 5200.00,
      sellingPrice: 7999.00,
      stockQuantity: 8,
      minThreshold: 2,
    },
  ];

  for (const p of partsData) {
    await prisma.sparePart.upsert({
      where: { partCode: p.partCode },
      update: p,
      create: p,
    });
  }
  console.log(`✅ Seeded ${partsData.length} Spare Parts.`);

  // 5. Seed Users (Customer, Admin, Technician, Rider)
  const customerUser = await prisma.user.upsert({
    where: { phoneNumber: '+919876543210' },
    update: { name: 'Rajesh Kumar', email: 'rajesh@example.com', role: UserRole.CUSTOMER },
    create: {
      phoneNumber: '+919876543210',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      role: UserRole.CUSTOMER,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { phoneNumber: '+919999999999' },
    update: { name: 'Admin Lead', email: 'admin@fixly.in', role: UserRole.ADMIN },
    create: {
      phoneNumber: '+919999999999',
      name: 'Admin Lead',
      email: 'admin@fixly.in',
      role: UserRole.ADMIN,
    },
  });

  const techUser = await prisma.user.upsert({
    where: { phoneNumber: '+919888888888' },
    update: { name: 'Vikram Sharma (Level 3 Tech)', email: 'vikram@fixly.in', role: UserRole.TECHNICIAN },
    create: {
      phoneNumber: '+919888888888',
      name: 'Vikram Sharma (Level 3 Tech)',
      email: 'vikram@fixly.in',
      role: UserRole.TECHNICIAN,
    },
  });

  const riderUser = await prisma.user.upsert({
    where: { phoneNumber: '+919777777777' },
    update: { name: 'Amit Verma (Express Logistics)', email: 'amit@fixly.in', role: UserRole.RIDER },
    create: {
      phoneNumber: '+919777777777',
      name: 'Amit Verma (Express Logistics)',
      email: 'amit@fixly.in',
      role: UserRole.RIDER,
    },
  });

  console.log('✅ Seeded System Users (Customer, Admin, Technician, Rider).');

  // 6. Seed Address for Customer
  const address = await prisma.address.create({
    data: {
      userId: customerUser.id,
      label: 'Home',
      addressLine: 'Flat 402, Sunshine Heights, Powai',
      landmark: 'Near Hiranandani Hospital',
      city: 'Mumbai',
      pincode: '400076',
      latitude: 19.1176,
      longitude: 72.9060,
    },
  });
  console.log('✅ Seeded Customer Address.');

  // 7. Seed Sample Active Repair Order
  const existingOrder = await prisma.repairOrder.findFirst({
    where: { orderNumber: 'QF-2026-00101' },
  });

  if (!existingOrder) {
    const order = await prisma.repairOrder.create({
      data: {
        orderNumber: 'QF-2026-00101',
        customerId: customerUser.id,
        modelId: 'xm-11t-pro',
        addressId: address.id,
        riderId: riderUser.id,
        technicianId: techUser.id,
        status: OrderStatus.REPAIR_IN_PROGRESS,
        pickupSlot: new Date(),
        issueDescription: 'Display touch unresponsive and cracked front glass after minor drop.',
        customerMedia: [
          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
        ],
        diagnosisNotes: 'Touch IC intact. Requires Grade-A Original AMOLED display assembly replacement.',
        pickupFee: 79.00,
        timeline: {
          create: [
            {
              status: OrderStatus.PICKUP_SCHEDULED,
              title: 'Pickup Scheduled',
              description: 'Rider Amit Verma assigned. Contact: +91 97777 77777.',
              timestamp: new Date(Date.now() - 3600000 * 5),
            },
            {
              status: OrderStatus.DEVICE_RECEIVED,
              title: 'Device Received at Lab',
              description: 'Device arrived at FIXLY Central Workshop. Diagnostic intake checklist completed.',
              timestamp: new Date(Date.now() - 3600000 * 3),
            },
            {
              status: OrderStatus.DIAGNOSIS_PENDING,
              title: 'Diagnosis Completed',
              description: 'Technician Vikram Sharma completed multi-point diagnostic inspection.',
              timestamp: new Date(Date.now() - 3600000 * 2),
            },
            {
              status: OrderStatus.REPAIR_IN_PROGRESS,
              title: 'Repair In Progress',
              description: 'Original OEM Display screen installation and curing underway.',
              timestamp: new Date(Date.now() - 1800000),
            },
          ],
        },
        estimate: {
          create: {
            pickupFee: 79.00,
            laborFee: 399.00,
            discount: 0.00,
            totalAmount: 4777.00,
            isApproved: true,
            items: {
              create: [
                {
                  title: 'Xiaomi 11T Pro AMOLED Screen (OEM)',
                  amount: 4299.00,
                },
                {
                  title: 'Precision Micro-soldering & Assembly Labor',
                  amount: 399.00,
                },
                {
                  title: 'Express Doorstep Pickup & Drop Logistics',
                  amount: 79.00,
                },
              ],
            },
          },
        },
        payments: {
          create: {
            razorpayOrderId: 'order_FIXLY_MOCK_00101',
            razorpayPaymentId: 'pay_FIXLY_MOCK_SUCCESS_001',
            amount: 4777.00,
            status: PaymentStatus.COMPLETED,
          },
        },
        warranty: {
          create: {
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 3600000),
            isActive: true,
            claimNotes: '30-Day FIXLY Assured Quality Guarantee against touch and display defects.',
          },
        },
      },
    });
    console.log(`✅ Seeded Active Repair Order: ${order.orderNumber}`);
  }

  console.log('🎉 FIXLY Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
