function initSocketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    let currentRoom = null;

    socket.on('subscribe:telemetry', (machineId) => {
      if (currentRoom) {
         socket.leave(currentRoom);
      }
      currentRoom = machineId || 'ALL';
      socket.join(currentRoom);
      console.log(`[Socket.IO] Client ${socket.id} subscribed to telemetry stream for ${currentRoom}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSocketHandler;
