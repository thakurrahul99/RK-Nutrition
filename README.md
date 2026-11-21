# RK Nutrition — Premium Sports Nutrition E-Commerce Platform

A production-grade, secure, database-driven sports nutrition and supplement e-commerce web platform engineered with React 19, Three.js, Node.js/Express, and MongoDB / Mongoose.

---

## 📁 Project Architecture & Clean Separation

```
rk-nutrition/
├── package.json              # Root orchestration scripts
├── .gitignore                # Global git ignore configuration
├── README.md                 # Project documentation
│
├── client/                   # FRONTEND APPLICATION (React + Vite + Tailwind + Three.js)
│   ├── package.json          # Frontend-only dependencies (React, Vite, Three.js, Lucide)
│   ├── vite.config.js        # Vite build & API reverse-proxy configuration
│   ├── tailwind.config.js    # Styling and custom theme tokens
│   ├── index.html            # Main HTML entry
│   ├── src/                  # Application source code
│   │   ├── components/       # UI Components (Hero, Navbar, Footer, Cart, Modals)
│   │   ├── context/          # React Contexts (Auth, Cart, Wishlist, Product, Category, Content)
│   │   ├── pages/            # Public Storefront & Admin Pages
│   │   │   ├── admin/        # Client Admin portal (/admin)
│   │   │   └── superAdmin/   # Super Admin developer console (/super-admin)
│   │   └── services/         # Centralized API service client (apiRequest)
│   └── public/               # Static web assets & textures
│
└── server/                   # BACKEND APPLICATION (Express + MongoDB + Security)
    ├── package.json          # Backend-only dependencies (Express, Mongoose, JWT, Nodemailer)
    ├── index.js              # Server entry point & middleware mounting
    ├── .env.example          # Environment variables template
    ├── config/               # Database connection (db.js) & automated seeding
    ├── models/               # Mongoose schemas (User, Product, Order, Cart, Coupon, etc.)
    ├── routes/               # Modular Express API endpoints
    │   ├── auth.routes.js
    │   ├── cart.routes.js
    │   ├── categories.routes.js
    │   ├── content.routes.js
    │   ├── discounts.routes.js
    │   ├── orders.routes.js
    │   ├── payments.routes.js
    │   ├── products.routes.js
    │   ├── store.routes.js
    │   ├── upload.routes.js
    │   └── wishlist.routes.js
    ├── middleware/           # RBAC authentication & sliding-window rate limiters
    ├── utils/                # Security helpers (HMAC-SHA256, sanitize) & mailer
    └── tests/                # 24-point automated test suite (api.test.js)
```

---

## 🚀 Quick Start

### 1. Backend Server Setup
```bash
cd server
npm install
cp .env.example .env     # Configure JWT_SECRET, SUPER_ADMIN_PASSWORD, etc.
npm start                # Runs on http://127.0.0.1:5000
```

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev              # Runs on http://localhost:5173 with proxy to server
```

### 3. Root Level Convenience Commands
From the project root (`rk nutrition`):
```bash
# Run client development server
npm run client:dev

# Run backend development server
npm run server:dev

# Run automated backend test suite (24 tests)
npm test

# Build client production bundle
npm run build

# Lint client codebase
npm run client:lint
```

---

## 🔒 Security & Verification
- **Role-Based Access Control**: `CUSTOMER`, `CLIENT_ADMIN`, and `SUPER_ADMIN`.
- **Payment Security**: Cryptographic HMAC-SHA256 Razorpay signature validation with `crypto.timingSafeEqual`.
- **Rate Limiting**: Sliding-window IP rate limiters on authentication and public order lookup.
- **Data Protection**: Strict inventory checks and server-side pricing recalculation for all orders and carts.
