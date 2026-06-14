/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Automated product API tests using Jest + Supertest.
 */

const request = require('supertest');

process.env.MOCK_DB = 'true';
process.env.JWT_SECRET = 'test_secret_key';
process.env.CLIENT_URL = 'http://localhost:5173';

const app = require('../index');

// Helper: log in and get a mock token
const getMockToken = async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@kashur.com', password: 'admin123' });
  return res.body.token;
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
describe('Product Routes', () => {
  test('GET /api/products — returns product list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  test('GET /api/products/featured — returns featured products', async () => {
    const res = await request(app).get('/api/products/featured');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  test('GET /api/products/:slug — returns product by valid slug', async () => {
    const res = await request(app).get('/api/products/walnut-shawl');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('product');
    expect(res.body.product).toHaveProperty('name');
  });

  test('GET /api/products/:slug — 404 for unknown slug', async () => {
    const res = await request(app).get('/api/products/this-does-not-exist-xyz');
    expect(res.statusCode).toBe(404);
  });

  test('POST /api/products — fails without auth token', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Unauthorized Product', price: 999 });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/products — admin can create a product', async () => {
    const token = await getMockToken();
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Shawl Jest',
        price: 5000,
        stock: 10,
        category: 'mock_cat_1',
        description: 'A test product created by Jest.'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('product');
    expect(res.body.product.name).toBe('Test Shawl Jest');
  });
});

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
describe('Category Routes', () => {
  test('GET /api/categories — returns category list', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('categories');
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(0);
  });
});
