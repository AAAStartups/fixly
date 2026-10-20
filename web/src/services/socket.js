// FIXLY Realtime WebSocket Service (Socket.IO)
// Connects to NestJS OrdersGateway

let socket = null;

export function initSocket(onConnect, onDisconnect) {
  if (socket) return socket;

  try {
    const io = window.io;
    if (typeof io === 'function') {
      socket = io('http://localhost:3000', {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
      });

      socket.on('connect', () => {
        console.log('⚡ Connected to FIXLY WebSocket Gateway');
        if (onConnect) onConnect(socket.id);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Disconnected from FIXLY WebSocket Gateway');
        if (onDisconnect) onDisconnect();
      });
    }
  } catch (err) {
    console.warn('Socket.IO initialization deferred:', err);
  }

  return socket;
}

export function subscribeToOrder(orderId, onStatusUpdate) {
  if (!socket) return () => {};

  socket.emit('order:subscribe', { orderId });

  const listener = (data) => {
    if (data.orderId === orderId || !data.orderId) {
      console.log('🔔 Received live order status update:', data);
      if (onStatusUpdate) onStatusUpdate(data);
    }
  };

  socket.on('order:status_updated', listener);

  return () => {
    socket.off('order:status_updated', listener);
  };
}
