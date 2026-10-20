import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(OrdersGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`🔌 Client connected to Socket.IO: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`❌ Client disconnected from Socket.IO: ${client.id}`);
  }

  @SubscribeMessage('order:subscribe')
  handleOrderSubscribe(
    @MessageBody() data: { orderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (data?.orderId) {
      client.join(`order_${data.orderId}`);
      this.logger.log(`Client ${client.id} subscribed to order_${data.orderId}`);
      return { event: 'subscribed', orderId: data.orderId };
    }
  }

  broadcastOrderStatusUpdate(orderId: string, status: string, timelineEntry: any) {
    this.logger.log(`📢 Broadcasting status update for order ${orderId}: ${status}`);
    this.server.to(`order_${orderId}`).emit('order:status_updated', {
      orderId,
      status,
      timelineEntry,
      timestamp: new Date().toISOString(),
    });
    // Also emit globally for any monitor/admin listeners
    this.server.emit('order:status_updated', {
      orderId,
      status,
      timelineEntry,
      timestamp: new Date().toISOString(),
    });
  }

  broadcastRiderLocation(orderId: string, location: { latitude: number; longitude: number; heading?: number }) {
    this.server.to(`order_${orderId}`).emit('rider:location_ping', {
      orderId,
      ...location,
      timestamp: new Date().toISOString(),
    });
  }

  broadcastEstimateIssued(orderId: string, estimate: any) {
    this.server.to(`order_${orderId}`).emit('estimate:issued', {
      orderId,
      estimate,
      timestamp: new Date().toISOString(),
    });
  }
}
