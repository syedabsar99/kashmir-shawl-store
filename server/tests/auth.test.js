/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Automated API tests using Jest + Supertest.
 * Notes: Run with: npm test
 *        Requires MOCK_DB=true so no real MongoDB connection is needed.
 */

const request = require('supertest');

// Point tests at mock mode so no real DB is needed
process.env.MOCK_DB = 'true';
process.env.JWT_SECRET = 'test_secret_key';
process.env.CLIENT_URL = 'http://localhost:5173';

const app = require('../index');

// ─── AUTH TESTS ───────────────────────────────────────────────────────────────
describe('Auth Routes', () => {
  test('POST /api/auth/login — success with correct mock credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@kashur.com', password: 'admin123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('isAdmin', true);
  });

  test('POST /api/auth/login — fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@kashur.com', password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /api/auth/login — fail with unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@example.com', password: 'password' });

    expect(res.statusCode).toBe(401);
  });
});

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
describe('Health Check', () => {
  test('GET /api/health — returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
