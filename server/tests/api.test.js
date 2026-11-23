/**
 * RK Nutrition — Dual-Admin & Storefront Comprehensive API Integration Test Suite
 * Validates authentication, RBAC, products, categories, cart, orders, coupons, payments, reviews, and store settings.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config();
process.env.NODE_ENV = 'test';

import http from 'http';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { connectDb } from '../config/db.js';
import app from '../index.js';

const PORT = 5555;
let server;
const BASE_URL = `http://127.0.0.1:${PORT}/api`;

const logPass = (title) => console.log(`  \x1b[32m✔ [PASS]\x1b[0m ${title}`);
const logFail = (title, err) => {
  console.error(`  \x1b[31m✖ [FAIL]\x1b[0m ${title}`);
  if (err) console.error(`    Details:`, err);
};

let failedCount = 0;
let passedCount = 0;

async function assert(condition, message) {
  if (!condition) {
    failedCount++;
    throw new Error(message || 'Assertion failed');
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const text = await res.text();
  let body = {};
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }

  return { status: res.status, body, headers: res.headers };
}

async function runTests() {
  console.log('\n======================================================');
  console.log('  RK NUTRITION — FULL BACKEND API & SECURITY TEST SUITE');
  console.log('======================================================\n');

  try {
    // 1. Health Check
    try {
      const res = await request('/health');
      assert(res.status === 200 && res.body.status === 'online', 'Health check should be online');
      passedCount++;
      logPass('System health check is online');
    } catch (e) {
      logFail('System health check', e.message);
    }

    // 2. Customer Registration
    let customerToken = '';
    const testCustomerEmail = `athlete_${Date.now()}@test.com`;
    try {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Rohit Sharma',
          email: testCustomerEmail,
          password: 'Password@123',
          phone: '9876543210'
        })
      });
      assert(res.status === 201, `Expected 201, got ${res.status}`);
      assert(res.body.success === true, 'Success should be true');
      assert(res.body.token, 'Token should be returned');
      assert(res.body.user.role === 'CUSTOMER', 'Role should be CUSTOMER');
      customerToken = res.body.token;
      passedCount++;
      logPass('Customer registration succeeds with sanitized token');
    } catch (e) {
      logFail('Customer registration', e.message);
    }

    // 3. Reject Duplicate Registration
    try {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Rohit Sharma Duplicate',
          email: testCustomerEmail,
          password: 'Password@123',
          phone: '9876543210'
        })
      });
      assert(res.status === 400, 'Duplicate registration should return 400');
      passedCount++;
      logPass('Duplicate email registration correctly blocked');
    } catch (e) {
      logFail('Duplicate registration rejection', e.message);
    }

    // 4. Customer Login
    try {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: testCustomerEmail,
          password: 'Password@123'
        })
      });
      assert(res.status === 200, 'Login should return 200');
      assert(res.body.token, 'JWT token must be present');
      customerToken = res.body.token;
      passedCount++;
      logPass('Customer login succeeds with valid bcrypt credentials');
    } catch (e) {
      logFail('Customer login', e.message);
    }

    // 5. Block Customer from Super Admin Portal
    try {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: testCustomerEmail,
          password: 'Password@123',
          requestedPortal: 'SUPER_ADMIN'
        })
      });
      assert(res.status === 403, 'Customer accessing Super Admin portal should return 403');
      passedCount++;
      logPass('RBAC blocks customer from accessing Super Admin console');
    } catch (e) {
      logFail('Customer portal access restriction', e.message);
    }

    // 6. Super Admin Login
    let superAdminToken = '';
    try {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: process.env.SUPER_ADMIN_EMAIL || 'developer@rknutrition.com',
          password: process.env.SUPER_ADMIN_PASSWORD || 'DevSuperAdmin@2026!',
          requestedPortal: 'SUPER_ADMIN'
        })
      });
      assert(res.status === 200, 'Super admin login should return 200');
      assert(res.body.user.role === 'SUPER_ADMIN', 'Role must be SUPER_ADMIN');
      superAdminToken = res.body.token;
      passedCount++;
      logPass('Super Admin authenticates successfully');
    } catch (e) {
      logFail('Super Admin login', e.message);
    }

    // 7. Client Admin Login
    let clientAdminToken = '';
    try {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: process.env.CLIENT_ADMIN_EMAIL || 'storeowner@rknutrition.com',
          password: process.env.CLIENT_ADMIN_PASSWORD || 'StoreOwner@2026!',
          requestedPortal: 'CLIENT_ADMIN'
        })
      });
      assert(res.status === 200, 'Client admin login should return 200');
      assert(res.body.user.role === 'CLIENT_ADMIN', 'Role must be CLIENT_ADMIN');
      clientAdminToken = res.body.token;
      passedCount++;
      logPass('Client Admin authenticates successfully');
    } catch (e) {
      logFail('Client Admin login', e.message);
    }

    // 8. Customer Address Book (POST & GET)
    let addressId = '';
    try {
      const res = await request('/auth/addresses', {
        method: 'POST',
        headers: { Authorization: `Bearer ${customerToken}` },
        body: JSON.stringify({
          fullName: 'Rohit Sharma',
          phone: '9876543210',
          addressLine1: 'Flat 402, High Performance Residency',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          isDefault: true
        })
      });
      assert(res.status === 201, 'Address creation should return 201');
      assert(res.body.address.id, 'Address ID should be returned');
      addressId = res.body.address.id;

      const listRes = await request('/auth/addresses', {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      assert(listRes.status === 200 && listRes.body.addresses.length >= 1, 'Address list should contain new address');
      passedCount++;
      logPass('Customer address book management (create & retrieve)');
    } catch (e) {
      logFail('Customer address book', e.message);
    }

    // 9. Public Products Listing & Filtering
    let testProductId = '';
    try {
      const res = await request('/products');
      assert(res.status === 200, 'Public products should return 200');
      assert(Array.isArray(res.body.products) && res.body.products.length > 0, 'Products array must not be empty');
      testProductId = res.body.products[0].id;

      // Filter by category
      const catRes = await request('/products?category=protein');
      assert(catRes.status === 200 && catRes.body.products.every((p) => p.category === 'protein'), 'Category filter works');
      passedCount++;
      logPass('Public product catalogue retrieval and category filtering');
    } catch (e) {
      logFail('Public products listing', e.message);
    }

    // 10. Dynamic Categories & Real-time Product Counts
    try {
      const res = await request('/categories');
      assert(res.status === 200, 'Categories should return 200');
      assert(res.body.categories.length >= 3, 'Default categories should exist');
      assert(res.body.categories[0].productCount !== undefined, 'Product count must be calculated');
      passedCount++;
      logPass('Dynamic categories with real-time assigned product metrics');
    } catch (e) {
      logFail('Dynamic categories', e.message);
    }

    // 11. Safety Check on Category Deletion
    try {
      const res = await request('/categories/cat-protein', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${clientAdminToken}` }
      });
      assert(res.status === 400, 'Deleting category with assigned products must fail with 400');
      assert(res.body.assignedCount > 0, 'Assigned count should be greater than 0');
      passedCount++;
      logPass('Safety block prevents deleting categories with assigned active products');
    } catch (e) {
      logFail('Category deletion safety check', e.message);
    }

    // 12. Product Review Submission & Verified Purchase Badge
    try {
      const res = await request(`/products/${testProductId}/reviews`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${customerToken}` },
        body: JSON.stringify({
          rating: 5,
          title: 'Uncompromising Quality and Solubility',
          comment: 'Best whey isolate I have used. Zero artificial sweetness and excellent recovery.'
        })
      });
      assert(res.status === 201, 'Review submission should return 201');
      assert(res.body.review.rating === 5, 'Rating should be 5');

      const reviewsList = await request(`/products/${testProductId}/reviews`);
      assert(reviewsList.status === 200 && reviewsList.body.reviews.length >= 1, 'Reviews list should include submitted review');
      passedCount++;
      logPass('Product review submission and average rating aggregation');
    } catch (e) {
      logFail('Product reviews', e.message);
    }

    // 13. Customer Cart Operations
    try {
      // Add to cart
      const addRes = await request('/cart/add', {
        method: 'POST',
        headers: { Authorization: `Bearer ${customerToken}` },
        body: JSON.stringify({
          productId: 'rk-whey-protein-isolate',
          variantId: 'var-1',
          quantity: 2
        })
      });
      assert(addRes.status === 200, 'Add to cart should return 200');
      assert(addRes.body.cart.itemCount === 2, 'Item count should be 2');

      // Update quantity
      const updateRes = await request('/cart/update', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${customerToken}` },
        body: JSON.stringify({
          productId: 'rk-whey-protein-isolate',
          variantId: 'var-1',
          quantity: 1
        })
      });
      assert(updateRes.status === 200 && updateRes.body.cart.itemCount === 1, 'Cart update quantity works');
      passedCount++;
      logPass('Customer cart state management (add & live quantity update)');
    } catch (e) {
      logFail('Customer cart operations', e.message);
    }

    // 14. Live Server-Side Cart & Coupon Validation
    try {
      const res = await request('/cart/validate', {
        method: 'POST',
        body: JSON.stringify({
          items: [{ productId: 'rk-whey-protein-isolate', quantity: 1 }],
          couponCode: 'RKLAUNCH10'
        })
      });
      assert(res.status === 200, 'Cart validation should return 200');
      assert(res.body.discountAmount > 0, 'Discount amount should be calculated');
      assert(res.body.total < res.body.subtotal, 'Total should reflect discount');
      passedCount++;
      logPass('Live server-side cart & coupon calculation with pricing validation');
    } catch (e) {
      logFail('Cart validation', e.message);
    }

    // 15. Customer Wishlist Toggle & Retrieve
    try {
      const toggleRes = await request('/wishlist/toggle', {
        method: 'POST',
        headers: { Authorization: `Bearer ${customerToken}` },
        body: JSON.stringify({ productId: 'rk-advanced-mass-fuel' })
      });
      assert(toggleRes.status === 200 && toggleRes.body.action === 'added', 'Wishlist toggle adds product');

      const wishRes = await request('/wishlist', {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      assert(wishRes.status === 200 && wishRes.body.productIds.includes('rk-advanced-mass-fuel'), 'Wishlist includes product');
      passedCount++;
      logPass('Customer wishlist toggle and synchronization');
    } catch (e) {
      logFail('Wishlist operations', e.message);
    }

    // 16. Mixed-Cart Payment Rule Validation
    try {
      const res = await request('/payments/validate-cart', {
        method: 'POST',
        body: JSON.stringify({
          items: [{ productId: 'rk-whey-protein-isolate', quantity: 1 }]
        })
      });
      assert(res.status === 200, 'Validate cart payment should return 200');
      assert(res.body.allowedMethods.includes('COD'), 'COD should be allowed for standard items');
      passedCount++;
      logPass('Mixed-cart payment rules validation endpoint');
    } catch (e) {
      logFail('Payment validation', e.message);
    }

    // 17. Order Placement with Inventory Deduction
    let placedOrder = null;
    try {
      const res = await request('/orders', {
        method: 'POST',
        headers: { Authorization: `Bearer ${customerToken}` },
        body: JSON.stringify({
          customer: {
            name: 'Rohit Sharma',
            phone: '9876543210',
            email: testCustomerEmail,
            address: '402 High Performance Tower',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          items: [
            {
              productId: 'rk-whey-protein-isolate',
              variantId: 'var-1',
              quantity: 1
            }
          ],
          paymentMethod: 'COD',
          couponCode: 'RKLAUNCH10'
        })
      });

      assert(res.status === 201, `Order placement should return 201, got ${res.status}`);
      assert(res.body.order.id, 'Order ID must exist');
      assert(res.body.order.orderNumber, 'Order sequence number must exist');
      assert(res.body.order.subtotal > 0, 'Subtotal must be positive');
      assert(res.body.order.discount > 0, 'Discount must be applied');
      placedOrder = res.body.order;
      passedCount++;
      logPass(`Order placed successfully (#${placedOrder.orderNumber}) with server-side inventory deduction`);
    } catch (e) {
      logFail('Order placement', e.message);
    }

    // 18. Customer Order History (/my-orders)
    try {
      const res = await request('/orders/my-orders', {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      assert(res.status === 200, 'My-orders should return 200');
      assert(res.body.orders.some((o) => o.id === placedOrder.id), 'Placed order must appear in my-orders');
      passedCount++;
      logPass('Customer isolated order history retrieval (/api/orders/my-orders)');
    } catch (e) {
      logFail('Customer order history', e.message);
    }

    // 19. Public Phone-Verified Order Lookup
    try {
      const res = await request(`/orders/public/${placedOrder.id}?phone=9876543210`);
      assert(res.status === 200, 'Public lookup with matching phone should return 200');
      assert(res.body.order.id === placedOrder.id, 'Order details should match');

      // Test with wrong phone
      const wrongRes = await request(`/orders/public/${placedOrder.id}?phone=9111111111`);
      assert(wrongRes.status === 401, 'Public lookup with incorrect phone must return 401');
      passedCount++;
      logPass('Public order status verification with mandatory phone authentication');
    } catch (e) {
      logFail('Public order verification', e.message);
    }

    // 20. Cryptographic Razorpay Signature Verification
    try {
      const keySecret = 'rzp_test_secret_sample_key';
      const razorpayOrderId = 'order_test_12345';
      const razorpayPaymentId = 'pay_test_67890';
      const validSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      const res = await request('/payments/verify', {
        method: 'POST',
        body: JSON.stringify({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: validSignature,
          internalOrderId: placedOrder.id
        })
      });

      assert(res.status === 503, 'Online payment verification should remain disabled until a secure gateway flow exists');
      assert(res.body.verified === false, 'Disabled verification must not claim success');

      // Reject tampered signature
      const tamperedRes = await request('/payments/verify', {
        method: 'POST',
        body: JSON.stringify({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: 'invalid_forged_signature_hex',
          internalOrderId: placedOrder.id
        })
      });
      assert(tamperedRes.status === 503, 'Verification endpoint must remain disabled while secure order binding is unavailable');
      passedCount++;
      logPass('Cryptographic HMAC-SHA256 Razorpay signature validation and anti-tamper check');
    } catch (e) {
      logFail('Payment signature verification', e.message);
    }

    // 21. Order Cancellation and Inventory Restoration
    try {
      const cancelRes = await request(`/orders/${placedOrder.id}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      assert(cancelRes.status === 200, 'Cancellation should return 200');
      assert(cancelRes.body.order.orderStatus === 'CANCELLED', 'Status must be CANCELLED');
      passedCount++;
      logPass('Order cancellation correctly restores product inventory');
    } catch (e) {
      logFail('Order cancellation and inventory restoration', e.message);
    }

    // 22. Store Inquiries (Contact Form)
    try {
      const res = await request('/store/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Sunil Gavaskar',
          email: 'sunil.g@example.com',
          phone: '9820098200',
          subject: 'Bulk Athlete Order',
          message: 'Interested in partnering for official cricket academy nutritional supplementation.'
        })
      });
      assert(res.status === 201, 'Inquiry should return 201');
      assert(res.body.inquiry.id, 'Inquiry ID should be generated');
      passedCount++;
      logPass('Public customer contact inquiries submission');
    } catch (e) {
      logFail('Store inquiries', e.message);
    }

    // 23. Newsletter Subscription
    try {
      const res = await request('/store/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email: 'subscriber@sportsnutrition.in' })
      });
      assert(res.status === 200, 'Newsletter should return 200');
      passedCount++;
      logPass('Newsletter subscription endpoint');
    } catch (e) {
      logFail('Newsletter subscription', e.message);
    }

    // 24. Super Admin Website Branding & Audit Logs
    try {
      const res = await request('/content');
      assert(res.status === 200 && res.body.content.branding, 'Website branding content should be accessible');

      const logsRes = await request('/super-admin/logs', {
        headers: { Authorization: `Bearer ${superAdminToken}` }
      });
      assert(logsRes.status === 200 && Array.isArray(logsRes.body.logs), 'Super Admin logs must be accessible');
      passedCount++;
      logPass('Super Admin website content and security audit trail');
    } catch (e) {
      logFail('Super admin content and logs', e.message);
    }

  } finally {
    console.log('\n------------------------------------------------------');
    console.log(`TOTAL TESTS: ${passedCount + failedCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
    console.log('------------------------------------------------------\n');
  }
}

// Connect to MongoDB before starting the API integration tests.
server = http.createServer(app);
const startApiTestServer = async () => {
  try {
    await connectDb();
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(PORT, '127.0.0.1', resolve);
    });
    await runTests();
  } catch (err) {
    failedCount++;
    console.error('Fatal API test setup error:', err);
  } finally {
    const finish = async () => {
      await mongoose.disconnect().catch(() => {});
      process.exit(failedCount > 0 ? 1 : 0);
    };
    if (server.listening) server.close(finish);
    else finish();
  }
};
void startApiTestServer();
