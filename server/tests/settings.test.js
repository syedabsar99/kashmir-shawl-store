/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Store settings & contact messages API tests using Jest + Supertest.
 */

const request = require('supertest');

process.env.MOCK_DB = 'true';
process.env.JWT_SECRET = 'test_secret_key';
process.env.CLIENT_URL = 'http://localhost:5173';

const app = require('../index');

const getMockToken = async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@kashur.com', password: 'admin123' });
  return res.body.token;
};

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
describe('Store Settings', () => {
  test('GET /api/settings — returns public store settings', async () => {
    const res = await request(app).get('/api/settings');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('logoMain');
  });
});

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
describe('Contact Messages', () => {
  test('POST /api/messages — customer can submit a contact message', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({
        name: 'Jest Tester',
        email: 'jest@test.com',
        message: 'This is an automated test message from Jest.'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /api/messages — admin can read all messages', async () => {
    const token = await getMockToken();
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('messages');
    expect(Array.isArray(res.body.messages)).toBe(true);
    expect(res.body.messages.length).toBeGreaterThan(0);
  });

  test('GET /api/messages — fails without auth', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.statusCode).toBe(401);
  });
});

// ─── 404 FALLBACK ─────────────────────────────────────────────────────────────
describe('404 Handler', () => {
  test('Unknown route returns 404', async () => {
    const res = await request(app).get('/api/nonexistent-route-xyz');
    expect(res.statusCode).toBe(404);
  });
});
