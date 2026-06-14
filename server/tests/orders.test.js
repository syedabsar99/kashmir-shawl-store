/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Automated order & shipping API tests using Jest + Supertest.
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

// ─── SHIPPING RATE ─────────────────────────────────────────────────────────────
describe('Shipping Rate', () => {
  test('POST /api/orders/shipping-rate — known Kashmir pincode gets free shipping', async () => {
    const res = await request(app)
      .post('/api/orders/shipping-rate')
      .send({ pincode: '190001' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('rate');
    expect(res.body.rate).toBe(0); // Kashmir Valley is free
  });

  test('POST /api/orders/shipping-rate — unknown pincode gets default rate', async () => {
    const res = await request(app)
      .post('/api/orders/shipping-rate')
      .send({ pincode: '999999' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('rate');
    expect(res.body.rate).toBeGreaterThan(0); // default paid shipping
  });
});

// ─── ORDERS ───────────────────────────────────────────────────────────────────
describe('Order Routes', () => {
  test('POST /api/orders/create — fails without auth', async () => {
    const res = await request(app)
      .post('/api/orders/create')
      .send({ items: [], paymentMethod: 'cod' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/orders/create — COD order created successfully with auth', async () => {
    const token = await getMockToken();
    const res = await request(app)
      .post('/api/orders/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{
          product: 'mock_prod_1',
          name: 'Premium Walnut Shawl',
          image: 'https://example.com/img.jpg',
          price: 12500,
          quantity: 1,
          variant: { color: 'Walnut Brown', size: 'Full Size' }
        }],
        shippingAddress: {
          name: 'Test User',
          phone: '9876543210',
          street: '123 Test Lane',
          city: 'Srinagar',
          state: 'J&K',
          pincode: '190001',
          country: 'India'
        },
        paymentMethod: 'cod',
        shippingCost: 0,
        itemsTotal: 12500
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('order');
    expect(res.body.order).toHaveProperty('orderNumber');
    expect(res.body.order.status).toBe('pending');
  });

  test('GET /api/orders/mine — fails without auth', async () => {
    const res = await request(app).get('/api/orders/mine');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/orders/mine — returns orders list when authenticated', async () => {
    const token = await getMockToken();
    const res = await request(app)
      .get('/api/orders/mine')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('orders');
    expect(Array.isArray(res.body.orders)).toBe(true);
  });
});

// ─── ADMIN STATS ───────────────────────────────────────────────────────────────
describe('Admin Routes', () => {
  test('GET /api/admin/stats — fails without auth', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/admin/stats — returns stats for admin user', async () => {
    const token = await getMockToken();
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalOrders');
    expect(res.body).toHaveProperty('totalProducts');
    expect(res.body).toHaveProperty('revenue');
  });

  test('GET /api/admin/orders — returns paginated orders for admin', async () => {
    const token = await getMockToken();
    const res = await request(app)
      .get('/api/admin/orders?page=1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('orders');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('pages');
  });
});
