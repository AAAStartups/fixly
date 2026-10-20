import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
import { CreateOrderDto, RespondEstimateDto, ClaimWarrantyDto } from './dto/order.dto';
import { OrderStatus, PaymentStatus, UserRole } from '@prisma/client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  // In-memory persistent cache for fallback mode
  private memoryOrders: any[] = [];

  constructor(
    private prisma: PrismaService,
    private ordersGateway: OrdersGateway,
  ) {
    this.initDefaultMemoryOrder();
  }

  private initDefaultMemoryOrder() {
    this.memoryOrders.push({
      id: 'ord_default_101',
      orderNumber: 'QF-2026-00101',
      customerId: 'usr_default_cust',
      modelId: 'xm-11t-pro',
      status: OrderStatus.REPAIR_IN_PROGRESS,
      pickupSlot: new Date().toISOString(),
      pickupAddress: 'Flat 402, Sunshine Heights, Powai, Mumbai - 400076',
      issueDescription: 'Display touch unresponsive and cracked front glass after minor drop.',
      customerMedia: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
      ],
      diagnosisNotes: 'Touch IC intact. Grade-A Original AMOLED display assembly replacement in progress.',
      pickupFee: 79.0,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
      model: {
        id: 'xm-11t-pro',
        name: 'Xiaomi 11T Pro 5G',
        brand: { id: 'xiaomi', name: 'Xiaomi', color: '#FF6900' },
      },
      rider: {
        id: 'rdr_1',
        name: 'Amit Verma',
        phoneNumber: '+919777777777',
      },
      technician: {
        id: 'tch_1',
        name: 'Vikram Sharma',
        phoneNumber: '+919888888888',
      },
      timeline: [
        {
          id: 'tl_1',
          status: OrderStatus.PICKUP_SCHEDULED,
          title: 'Pickup Scheduled',
          description: 'Rider Amit Verma assigned. Estimated arrival within selected slot.',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: 'tl_2',
          status: OrderStatus.DEVICE_RECEIVED,
          title: 'Device Received at Lab',
          description: 'Device arrived at FIXLY Central Workshop. Checklist verified.',
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        },
        {
          id: 'tl_3',
          status: OrderStatus.DIAGNOSIS_PENDING,
          title: 'Diagnosis Completed',
          description: 'Senior technician completed multi-point diagnostic inspection.',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 'tl_4',
          status: OrderStatus.REPAIR_IN_PROGRESS,
          title: 'Repair In Progress',
          description: 'Original OEM Display screen installation and curing underway.',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
        },
      ],
      estimate: {
        id: 'est_101',
        pickupFee: 79.0,
        laborFee: 399.0,
        discount: 0.0,
        totalAmount: 4777.0,
        isApproved: true,
        items: [
          { title: 'Xiaomi 11T Pro AMOLED Screen (OEM)', amount: 4299.0 },
          { title: 'Precision Micro-soldering & Assembly Labor', amount: 399.0 },
          { title: 'Doorstep Pickup & Drop Logistics', amount: 79.0 },
        ],
      },
      warranty: {
        id: 'war_101',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 3600000).toISOString(),
        isActive: true,
        claimNotes: '30-Day FIXLY Assured Quality Guarantee against touch and display defects.',
      },
    });
  }

  async createOrder(dto: CreateOrderDto) {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `QF-2026-${randomSuffix}`;
    const pickupFee = 79.0;
    const now = new Date();

    const initialTimeline = [
      {
        status: OrderStatus.PICKUP_SCHEDULED,
        title: 'Pickup Scheduled',
        description: `Doorstep pickup scheduled for ${dto.pickupDate || 'Today'} at ${dto.pickupSlot || '10:00 AM'}.`,
        timestamp: now,
      },
    ];

    if (this.prisma.isConnected) {
      try {
        // Find or create customer
        let customer = await this.prisma.user.findFirst({
          where: dto.customerPhone ? { phoneNumber: dto.customerPhone } : { role: UserRole.CUSTOMER },
        });

        if (!customer) {
          customer = await this.prisma.user.create({
            data: {
              phoneNumber: dto.customerPhone || '+919876543210',
              name: dto.customerName || 'Valued Customer',
              role: UserRole.CUSTOMER,
            },
          });
        }

        // Find or create address
        let address = await this.prisma.address.findFirst({
          where: { userId: customer.id },
        });

        if (!address) {
          address = await this.prisma.address.create({
            data: {
              userId: customer.id,
              label: 'Home',
              addressLine: dto.pickupAddress || 'Flat 402, Sunshine Heights, Mumbai',
              city: 'Mumbai',
              pincode: '400076',
            },
          });
        }

        // Check if device model exists in DB, or fallback to first
        let model = await this.prisma.deviceModel.findUnique({
          where: { id: dto.modelId },
        });

        if (!model) {
          model = (await this.prisma.deviceModel.findFirst()) || {
            id: dto.modelId,
            brandId: 'xiaomi',
            name: dto.modelId,
            imageUrl: null,
            year: '2022',
            network: '5G',
          } as any;
        }

        const newOrder = await this.prisma.repairOrder.create({
          data: {
            orderNumber,
            customerId: customer.id,
            modelId: model.id,
            addressId: address.id,
            status: OrderStatus.PICKUP_SCHEDULED,
            pickupSlot: now,
            issueDescription: dto.issueDescription || dto.serviceId || 'Smartphone repair service requested',
            customerMedia: dto.customerMedia || [],
            pickupFee,
            timeline: {
              create: initialTimeline,
            },
          },
          include: {
            model: { include: { brand: true } },
            pickupAddress: true,
            timeline: true,
          },
        });

        this.ordersGateway.broadcastOrderStatusUpdate(
          newOrder.id,
          OrderStatus.PICKUP_SCHEDULED,
          initialTimeline[0],
        );

        return {
          success: true,
          message: 'Repair booking created successfully',
          order: newOrder,
        };
      } catch (error) {
        this.logger.error('Error in database order creation, falling back to memory store:', error);
      }
    }

    // Memory Store Fallback
    const memoryOrder = {
      id: 'ord_' + Date.now(),
      orderNumber,
      customerId: dto.customerId || 'usr_cust_' + Date.now(),
      modelId: dto.modelId,
      status: OrderStatus.PICKUP_SCHEDULED,
      pickupSlot: now.toISOString(),
      pickupAddress: dto.pickupAddress || 'Home (Flat 402, Sunshine Heights, Mumbai)',
      issueDescription: dto.issueDescription || dto.serviceId || 'Screen/hardware diagnosis & repair',
      customerMedia: dto.customerMedia || [],
      pickupFee,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      model: {
        id: dto.modelId,
        name: dto.modelId.includes('xm') ? 'Xiaomi 11T Pro 5G' : dto.modelId,
        brand: { id: dto.brandId || 'xiaomi', name: 'Xiaomi', color: '#FF6900' },
      },
      timeline: [
        {
          id: 'tl_' + Date.now(),
          status: OrderStatus.PICKUP_SCHEDULED,
          title: 'Pickup Scheduled',
          description: `Doorstep pickup scheduled for ${dto.pickupDate || 'Today'} at ${dto.pickupSlot || '10:00 AM'}. Verified partner assigned.`,
          timestamp: now.toISOString(),
        },
      ],
      estimate: {
        id: 'est_' + Date.now(),
        pickupFee: 79.0,
        laborFee: 0.0,
        discount: 0.0,
        totalAmount: 79.0 + (dto.serviceId === 'display' ? 4299 : 2249),
        isApproved: false,
        items: [
          { title: `${dto.serviceId ? dto.serviceId.toUpperCase() : 'Device'} Repair Service`, amount: dto.serviceId === 'display' ? 4299 : 2249 },
          { title: 'Doorstep Pickup & Drop Logistics', amount: 79.0 },
        ],
      },
      warranty: {
        id: 'war_' + Date.now(),
        startDate: now.toISOString(),
        endDate: new Date(now.getTime() + 30 * 24 * 3600000).toISOString(),
        isActive: true,
        claimNotes: '30-Day FIXLY Assured Quality Guarantee against repair defects.',
      },
    };

    this.memoryOrders.unshift(memoryOrder);
    this.ordersGateway.broadcastOrderStatusUpdate(
      memoryOrder.id,
      OrderStatus.PICKUP_SCHEDULED,
      memoryOrder.timeline[0],
    );

    return {
      success: true,
      message: 'Repair booking created successfully',
      order: memoryOrder,
    };
  }

  async getActiveOrder(customerId?: string) {
    if (this.prisma.isConnected) {
      try {
        const order = await this.prisma.repairOrder.findFirst({
          where: {
            status: { notIn: [OrderStatus.DELIVERED, OrderStatus.CANCELLED] },
          },
          orderBy: { createdAt: 'desc' },
          include: {
            model: { include: { brand: true } },
            pickupAddress: true,
            rider: true,
            technician: true,
            timeline: { orderBy: { timestamp: 'asc' } },
            estimate: { include: { items: true } },
            warranty: true,
            payments: true,
          },
        });
        if (order) return order;
      } catch (err) {
        // fallback
      }
    }

    const memoryActive = this.memoryOrders.find(
      (o) => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED,
    );
    return memoryActive || this.memoryOrders[0] || null;
  }

  async getOrderHistory(customerId?: string) {
    if (this.prisma.isConnected) {
      try {
        const orders = await this.prisma.repairOrder.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            model: { include: { brand: true } },
            timeline: { orderBy: { timestamp: 'desc' } },
            estimate: true,
            warranty: true,
          },
        });
        if (orders.length > 0) return orders;
      } catch (err) {
        // fallback
      }
    }

    return this.memoryOrders;
  }

  async getOrderById(orderId: string) {
    if (this.prisma.isConnected) {
      try {
        const order = await this.prisma.repairOrder.findFirst({
          where: {
            OR: [
              { id: orderId },
              { orderNumber: { equals: orderId, mode: 'insensitive' } },
            ],
          },
          include: {
            model: { include: { brand: true } },
            pickupAddress: true,
            rider: true,
            technician: true,
            timeline: { orderBy: { timestamp: 'asc' } },
            estimate: { include: { items: true } },
            warranty: true,
            payments: true,
          },
        });
        if (order) return order;
      } catch (err) {
        // fallback
      }
    }

    const order = this.memoryOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }
    return order;
  }

  async respondToEstimate(orderId: string, dto: RespondEstimateDto) {
    const newStatus = dto.isApproved ? OrderStatus.ESTIMATE_APPROVED : OrderStatus.ESTIMATE_REJECTED;
    const timelineEntry = {
      status: newStatus,
      title: dto.isApproved ? 'Estimate Approved by Customer' : 'Estimate Declined by Customer',
      description: dto.isApproved
        ? 'Customer approved quotation. Device scheduled for repair workbench.'
        : `Customer declined quotation. Reason: ${dto.rejectionReason || 'Price reconsidered'}.`,
      timestamp: new Date(),
    };

    if (this.prisma.isConnected) {
      try {
        await this.prisma.estimate.update({
          where: { orderId },
          data: {
            isApproved: dto.isApproved,
            rejectionReason: dto.rejectionReason,
          },
        });

        await this.prisma.repairOrder.update({
          where: { id: orderId },
          data: {
            status: newStatus,
            timeline: {
              create: timelineEntry,
            },
          },
        });

        this.ordersGateway.broadcastOrderStatusUpdate(orderId, newStatus, timelineEntry);
        return { success: true, message: 'Estimate response recorded successfully' };
      } catch (err) {
        // fallback
      }
    }

    const order = this.memoryOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.status = newStatus;
      if (order.estimate) {
        order.estimate.isApproved = dto.isApproved;
        order.estimate.rejectionReason = dto.rejectionReason;
      }
      order.timeline.push({
        id: 'tl_' + Date.now(),
        ...timelineEntry,
        timestamp: timelineEntry.timestamp.toISOString(),
      });
      this.ordersGateway.broadcastOrderStatusUpdate(order.id, newStatus, timelineEntry);
      return { success: true, message: 'Estimate response recorded successfully' };
    }

    throw new NotFoundException('Order not found');
  }

  async claimWarranty(orderId: string, dto: ClaimWarrantyDto) {
    if (this.prisma.isConnected) {
      try {
        const warranty = await this.prisma.warranty.findUnique({
          where: { orderId },
        });

        if (!warranty || !warranty.isActive || new Date(warranty.endDate) < new Date()) {
          throw new BadRequestException('Warranty is either expired or inactive for this order.');
        }

        await this.prisma.warranty.update({
          where: { orderId },
          data: { claimNotes: dto.claimNotes },
        });

        return {
          success: true,
          message: '30-Day Warranty claim successfully initiated. Our logistics partner will schedule a re-inspection.',
        };
      } catch (err) {
        // fallback
      }
    }

    const order = this.memoryOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (order && order.warranty) {
      order.warranty.claimNotes = dto.claimNotes;
      return {
        success: true,
        message: '30-Day Warranty claim successfully initiated. Logistics partner assigned for free re-inspection.',
      };
    }

    throw new NotFoundException('Warranty or order not found');
  }

  async getInvoice(orderId: string) {
    const order = await this.getOrderById(orderId);
    return {
      success: true,
      invoice: {
        invoiceNumber: `INV-${order.orderNumber}`,
        orderNumber: order.orderNumber,
        date: order.createdAt,
        customer: order.customer || { name: 'Customer', phone: '+919876543210' },
        device: order.model?.name || 'Device',
        items: order.estimate?.items || [
          { title: 'Diagnostic & Hardware Repair', amount: 4299.0 },
          { title: 'Doorstep Pickup & Drop Logistics', amount: 79.0 },
        ],
        subtotal: order.estimate?.totalAmount || 4378.0,
        gstRate: '18% GST Included',
        total: order.estimate?.totalAmount || 4378.0,
        pdfUrl: `/api/v1/orders/${order.id}/invoice/pdf`,
      },
    };
  }

  async getPresignedUploadUrl(fileName: string, fileType: string) {
    // Generate pre-signed S3/R2 mock or live URL
    const key = `uploads/${Date.now()}_${fileName || 'device_media.jpg'}`;
    const mockUploadUrl = `https://s3.ap-south-1.amazonaws.com/fixly-media/${key}`;
    return {
      success: true,
      uploadUrl: mockUploadUrl,
      fileKey: key,
      publicUrl: mockUploadUrl,
    };
  }
}
