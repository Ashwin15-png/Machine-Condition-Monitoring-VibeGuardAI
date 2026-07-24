const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const connectDB = require('./config/db');
const initSocketHandler = require('./socket/socketHandler');
const { startTelemetrySimulator } = require('./services/simulatorService');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const machineRoutes = require('./routes/machineRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const telemetryRoutes = require('./routes/telemetryRoutes');
const historyRoutes = require('./routes/historyRoutes');
const alertRoutes = require('./routes/alertRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const userRoutes = require('./routes/userRoutes');
const readingRoutes = require('./routes/readingRoutes');
const oeeRoutes = require('./routes/oeeRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

app.set('io', io);

// Middleware Configuration
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

// Database connection and simulator initialization moved to server startup

// API Endpoint Routes
app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/oee', oeeRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/reports', reportRoutes);

// Root Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Operational',
    system: 'VibeGuard Industrial IoT Engine',
    timestamp: new Date().toISOString(),
    socketClients: io.engine.clientsCount,
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({ success: false, message: 'Internal Industrial Server Error' });
});

const PORT = process.env.PORT || 5000;

connectDB().then((connected) => {
  if (connected) {
    server.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` ⚡ VibeGuard AI IoT Server listening on port ${PORT}`);
      console.log(` 📡 Socket.IO Realtime Telemetry Broadcast Active`);
      console.log(`=======================================================`);
      
      // Initialize Socket Event Handlers
      initSocketHandler(io);
      
      // Start IoT Telemetry Simulator Engine (2s interval broadcast)
      startTelemetrySimulator(io);
    });
  } else {
    console.error(`[Server] Failed to connect to MongoDB. Exit process.`);
    process.exit(1); 
  }
});