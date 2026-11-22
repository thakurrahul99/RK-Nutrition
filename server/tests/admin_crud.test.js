process.env.NODE_ENV = 'test';
import http from 'http';
import assert from 'assert';
import app from '../index.js';

let server;
let clientAdminToken = '';
let superAdminToken = '';

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path,
        method,
        headers
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runAdminCrudTests() {
  console.log('\n======================================================');
  console.log('  RK NUTRITION — ADMIN & SUPER ADMIN FULL CRUD SUITE');
  console.log('======================================================\n');

  // 1. Authenticate Client Admin
  const adminLogin = await request('POST', '/api/auth/login', {
    email: process.env.CLIENT_ADMIN_EMAIL || 'storeowner@rknutrition.com',
    password: process.env.CLIENT_ADMIN_PASSWORD || 'StoreOwner@2026!',
    requestedPortal: 'CLIENT_ADMIN'
  });
  assert.strictEqual(adminLogin.status, 200, 'Client Admin login should succeed');
  clientAdminToken = adminLogin.body.token;
  console.log('  ✔ [PASS] Client Admin authenticated');

  // 2. Authenticate Super Admin
  const superLogin = await request('POST', '/api/auth/login', {
    email: process.env.SUPER_ADMIN_EMAIL || 'developer@rknutrition.com',
    password: process.env.SUPER_ADMIN_PASSWORD || 'DevSuperAdmin@2026!',
    requestedPortal: 'SUPER_ADMIN'
  });
  assert.strictEqual(superLogin.status, 200, 'Super Admin login should succeed');
  superAdminToken = superLogin.body.token;
  console.log('  ✔ [PASS] Super Admin authenticated');

  // 3. Product CRUD
  const newProductSlug = `test-protein-${Date.now()}`;
  const createProductRes = await request('POST', '/api/products', {
    name: 'Test Protein Formulation',
    slug: newProductSlug,
    sku: `RK-TEST-${Date.now()}`,
    category: 'protein',
    price: 3499,
    salePrice: 2999,
    stock: 75,
    shortDescription: 'Test product for CRUD verification',
    status: 'published'
  }, clientAdminToken);
  assert.strictEqual(createProductRes.status, 201, 'Product should be created');
  assert.strictEqual(createProductRes.body.product.name, 'Test Protein Formulation');
  console.log('  ✔ [PASS] Product CREATE succeeded');

  const updateProductRes = await request('PUT', `/api/products/${newProductSlug}`, {
    price: 3299,
    stock: 90
  }, clientAdminToken);
  assert.strictEqual(updateProductRes.status, 200, 'Product should be updated');
  assert.strictEqual(updateProductRes.body.product.stock, 90);
  console.log('  ✔ [PASS] Product UPDATE succeeded');

  const duplicateRes = await request('POST', `/api/products/${newProductSlug}/duplicate`, {}, clientAdminToken);
  assert.strictEqual(duplicateRes.status, 201, 'Product duplication should succeed');
  const duplicateId = duplicateRes.body.product.id;
  console.log('  ✔ [PASS] Product DUPLICATE succeeded');

  const deleteDuplicateRes = await request('DELETE', `/api/products/${duplicateId}`, null, clientAdminToken);
  assert.strictEqual(deleteDuplicateRes.status, 200, 'Duplicated product deletion should succeed');
  const deleteOriginalRes = await request('DELETE', `/api/products/${newProductSlug}`, null, clientAdminToken);
  assert.strictEqual(deleteOriginalRes.status, 200, 'Original test product deletion should succeed');
  console.log('  ✔ [PASS] Product DELETE succeeded');

  // 4. Category CRUD & Reorder
  const newCatSlug = `test-cat-${Date.now()}`;
  const createCatRes = await request('POST', '/api/categories', {
    name: 'Specialty Creatine',
    slug: newCatSlug,
    tagline: 'Pure micronized performance',
    description: 'Strength support'
  }, clientAdminToken);
  assert.strictEqual(createCatRes.status, 201, 'Category should be created');
  const catId = createCatRes.body.category.id;
  console.log('  ✔ [PASS] Category CREATE succeeded');

  const updateCatRes = await request('PUT', `/api/categories/${catId}`, {
    tagline: 'Updated micronized strength'
  }, clientAdminToken);
  assert.strictEqual(updateCatRes.status, 200, 'Category should be updated');
  console.log('  ✔ [PASS] Category UPDATE succeeded');

  const reorderCatRes = await request('PUT', '/api/categories/reorder', {
    orderedIds: [catId, 'cat-whey-isolate', 'cat-creatine']
  }, clientAdminToken);
  assert.strictEqual(reorderCatRes.status, 200, 'Category reorder should succeed');
  console.log('  ✔ [PASS] Category REORDER succeeded');

  const deleteCatRes = await request('DELETE', `/api/categories/${catId}`, null, clientAdminToken);
  assert.strictEqual(deleteCatRes.status, 200, 'Category delete should succeed');
  console.log('  ✔ [PASS] Category DELETE succeeded');

  // 5. Coupon CRUD
  const testCouponCode = `TEST${Date.now().toString().slice(-4)}`;
  const createCouponRes = await request('POST', '/api/discounts', {
    code: testCouponCode,
    discountType: 'percentage',
    discountValue: 15,
    minCartValue: 999,
    maxUses: 50
  }, clientAdminToken);
  assert.strictEqual(createCouponRes.status, 201, 'Coupon should be created');
  const couponId = createCouponRes.body.coupon.id;
  console.log('  ✔ [PASS] Coupon CREATE succeeded');

  const updateCouponRes = await request('PUT', `/api/discounts/${couponId}`, {
    discountValue: 20
  }, clientAdminToken);
  assert.strictEqual(updateCouponRes.status, 200, 'Coupon should be updated');
  assert.strictEqual(updateCouponRes.body.coupon.discountValue, 20);
  console.log('  ✔ [PASS] Coupon UPDATE succeeded');

  const deleteCouponRes = await request('DELETE', `/api/discounts/${couponId}`, null, clientAdminToken);
  assert.strictEqual(deleteCouponRes.status, 200, 'Coupon should be deleted');
  console.log('  ✔ [PASS] Coupon DELETE succeeded');

  // 6. Inquiries CRUD
  const createInquiryRes = await request('POST', '/api/store/inquiries', {
    name: 'Athlete Vikram',
    email: 'vikram@example.com',
    subject: 'Batch certificate inquiry',
    message: 'Can I view HPLC test results for batch #402?'
  });
  assert.strictEqual(createInquiryRes.status, 201, 'Inquiry should be submitted');
  const inquiryId = createInquiryRes.body.inquiry.id;
  console.log('  ✔ [PASS] Inquiry submission succeeded');

  const resolveInquiryRes = await request('PUT', `/api/store/inquiries/${inquiryId}`, {
    status: 'resolved'
  }, clientAdminToken);
  assert.strictEqual(resolveInquiryRes.status, 200, 'Inquiry status update should succeed');
  assert.strictEqual(resolveInquiryRes.body.inquiry.status, 'RESOLVED');
  console.log('  ✔ [PASS] Inquiry UPDATE succeeded');

  const deleteInquiryRes = await request('DELETE', `/api/store/inquiries/${inquiryId}`, null, clientAdminToken);
  assert.strictEqual(deleteInquiryRes.status, 200, 'Inquiry DELETE should succeed');
  console.log('  ✔ [PASS] Inquiry DELETE succeeded');

  // 7. Orders: Status, Tracking & Delete
  const placeOrderRes = await request('POST', '/api/orders', {
    customer: {
      name: 'Order Test User',
      email: 'ordertest@example.com',
      phone: '9876500000',
      address: '123 Test Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    items: [{ productId: 'rk-whey-protein-isolate', variantId: 'var-1', quantity: 1 }],
    paymentMethod: 'COD'
  });
  assert.strictEqual(placeOrderRes.status, 201, 'Order placement should succeed');
  const testOrderId = placeOrderRes.body.order.id;
  console.log('  ✔ [PASS] Test order placed for logistics verification');

  const updateTrackingRes = await request('PUT', `/api/orders/${testOrderId}/tracking`, {
    carrier: 'BlueDart',
    trackingNumber: 'BLUEDART-882299',
    estimatedDelivery: '2026-11-28'
  }, clientAdminToken);
  assert.strictEqual(updateTrackingRes.status, 200, 'Tracking update should succeed');
  assert.strictEqual(updateTrackingRes.body.order.tracking.trackingNumber, 'BLUEDART-882299');
  console.log('  ✔ [PASS] Order tracking UPDATE succeeded');

  const updateOrderStatusRes = await request('PUT', `/api/orders/${testOrderId}/status`, {
    orderStatus: 'DELIVERED',
    paymentStatus: 'PAID'
  }, clientAdminToken);
  assert.strictEqual(updateOrderStatusRes.status, 200, 'Order status update should succeed');
  console.log('  ✔ [PASS] Order status UPDATE succeeded');

  const deleteOrderRes = await request('DELETE', `/api/orders/${testOrderId}`, null, clientAdminToken);
  assert.strictEqual(deleteOrderRes.status, 200, 'Order DELETE should succeed');
  console.log('  ✔ [PASS] Order DELETE succeeded');

  // 8. Super Admin Content & Backup/Restore
  const updateHomepageRes = await request('PUT', '/api/content/homepage', {
    hero: { headlineWhite: 'FUEL YOUR', headingLine1: 'FUEL YOUR', headingLine2: 'POTENTIAL.', headingLine3: 'NOT THE NOISE.' }
  }, superAdminToken);
  assert.strictEqual(updateHomepageRes.status, 200, 'Homepage content update should succeed');
  console.log('  ✔ [PASS] Super Admin Homepage configuration UPDATE succeeded');

  const updateNavRes = await request('PUT', '/api/content/navigation', {
    headerLinks: [
      { id: 'nav-1', label: 'Home', path: '/', visible: true },
      { id: 'nav-2', label: 'Products', path: '/products', visible: true },
      { id: 'nav-3', label: 'Categories', path: '/categories', visible: true },
      { id: 'nav-4', label: 'About', path: '/about', visible: true },
      { id: 'nav-5', label: 'Contact', path: '/contact', visible: true }
    ]
  }, superAdminToken);
  assert.strictEqual(updateNavRes.status, 200, 'Navigation update should succeed');
  console.log('  ✔ [PASS] Super Admin Navigation UPDATE succeeded');

  const gatewayConfigRes = await request('GET', '/api/payments/gateway-config', null, clientAdminToken);
  assert.strictEqual(gatewayConfigRes.status, 200, 'Gateway config alias should succeed');
  assert.ok(gatewayConfigRes.body.gatewayConfig, 'Gateway config must be returned');
  console.log('  ✔ [PASS] Gateway config GET (alias) succeeded');

  const backupRes = await request('GET', '/api/content/backup', null, superAdminToken);
  assert.strictEqual(backupRes.status, 200, 'Backup GET should succeed');
  assert.ok(backupRes.body.database, 'Backup response must contain database');
  console.log('  ✔ [PASS] Database Backup snapshot GET succeeded');

  const restoreRes = await request('POST', '/api/content/restore', {
    database: backupRes.body.database
  }, superAdminToken);
  assert.strictEqual(restoreRes.status, 200, 'Database restore should succeed');
  console.log('  ✔ [PASS] Database Snapshot RESTORE succeeded');

  console.log('\n------------------------------------------------------');
  console.log('  ALL ADMIN & SUPER ADMIN CRUD TESTS PASSED!');
  console.log('------------------------------------------------------\n');
}

server = app.listen(5001, '127.0.0.1', async () => {
  try {
    await runAdminCrudTests();
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('Test execution failed:', err);
    server.close(() => process.exit(1));
  }
});
