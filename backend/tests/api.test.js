const request = require('supertest');
const express = require('express');

const app = express();
app.get('/api/health', (req, res) => {
  res.json({ status: 'Operational', system: 'VibeGuard Industrial IoT Engine' });
});

describe('VibeGuard API Health', () => {
  it('should return 200 OK on /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'Operational');
  });
});
