function initSocketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('subscribe:telemetry', (machineId) => {
      console.log(`[Socket.IO] Client ${socket.id} subscribed to telemetry stream for ${machineId || 'all'}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSocketHandler;
