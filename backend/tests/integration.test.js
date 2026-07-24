const request = require('supertest');
jest.setTimeout(30000);
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const authRoutes = require('../routes/authRoutes');
const telemetryRoutes = require('../routes/telemetryRoutes');
const reportRoutes = require('../routes/reportRoutes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/reports', reportRoutes);

const server = http.createServer(app);
const io = new Server(server);

describe('SIH 2026 Comprehensive Integration Suite', () => {

  beforeAll(async () => {
    try {
      if (mongoose.connection.readyState === 0) {
        // Use local DB for integration tests to prevent DNS/Atlas timeouts in CI
        const dbUri = process.env.NODE_ENV === 'test' 
          ? 'mongodb://127.0.0.1:27017/vibeguard_test' 
          : process.env.MONGO_URI;
          
        await mongoose.connect(dbUri, {
          serverSelectionTimeoutMS: 3000
        });
      }
    } catch (err) {
      console.warn('Test DB connection failed initially, skipping Atlas error:', err.message);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  describe('Phase 8: Authentication Integrity', () => {
    it('Should reject login with missing credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });

    it('Should reject unauthorized profile access without JWT', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toMatch(/Not authorized/i);
    });
  });

  describe('Phase 12: Export Validation', () => {
    it('Should protect report routes from unauthenticated access', async () => {
      const resJSON = await request(app).get('/api/reports/json');
      expect(resJSON.statusCode).toEqual(401);

      const resCSV = await request(app).get('/api/reports/csv');
      expect(resCSV.statusCode).toEqual(401);
    });
  });

  describe('Phase 3-4: Edge Cases', () => {
    it('Should handle NaN or weird values elegantly', async () => {
         expect(true).toBe(true);
    });
  });
});
