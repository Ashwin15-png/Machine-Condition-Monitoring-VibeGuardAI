import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

socket.on('connect', () => {
  console.log('[Socket.IO Frontend] Connected to IoT server:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.warn('[Socket.IO Frontend] Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('[Socket.IO Frontend] Connection error:', error.message);
});

export default socket;
