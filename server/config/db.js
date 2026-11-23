import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Import all Mongoose models
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Review from '../models/Review.js';
import Inquiry from '../models/Inquiry.js';
import Newsletter from '../models/Newsletter.js';
import StoreSettings from '../models/StoreSettings.js';
import Content from '../models/Content.js';
import AuditLog from '../models/AuditLog.js';

export {
  User,
  Product,
  Category,
  Order,
  Coupon,
  Cart,
  Wishlist,
  Review,
  Inquiry,
  Newsletter,
  StoreSettings,
  Content,
  AuditLog
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'rk_database.json');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Default categories seed
export const getDefaultCategories = () => [
  {
    id: 'cat-protein',
    name: 'Protein',
    slug: 'protein',
    description: 'Formulated to support lean muscle tissue maintenance, protein synthesis, and daily recovery routines.',
    tagline: 'Foundational Muscle Recovery',
    image: '/images/category-protein.webp',
    isActive: true,
    displayOrder: 1,
    createdAt: '2026-11-20T10:00:00.000Z',
    updatedAt: '2026-11-20T10:00:00.000Z'
  },
  {
    id: 'cat-mass-gainer',
    name: 'Mass Gainer',
    slug: 'mass-gainer',
    description: 'Engineered fuel to meet intense caloric demands and assist in structured, disciplined athletic mass building.',
    tagline: 'High-Density Energy & Mass',
    image: '/images/category-mass-gainer.webp',
    isActive: true,
    displayOrder: 2,
    createdAt: '2026-11-20T10:00:00.000Z',
    updatedAt: '2026-11-20T10:00:00.000Z'
  },
  {
    id: 'cat-pre-workout',
    name: 'Pre-Workout',
    slug: 'pre-workout',
    description: 'Targeted training support designed for sharp mental focus, endurance, and uncompromising training readiness.',
    tagline: 'Focus & Training Intensity',
    image: '/images/category-pre-workout.webp',
    isActive: true,
    displayOrder: 3,
    createdAt: '2026-11-20T10:00:00.000Z',
    updatedAt: '2026-11-20T10:00:00.000Z'
  },
  {
    id: 'cat-creatine',
    name: 'Creatine',
    slug: 'creatine',
    description: 'Pure 100% micronized creatine monohydrate engineered to saturate phosphocreatine stores, increase ATP regeneration, and enhance explosive strength.',
    tagline: 'Peak Power & Muscular Endurance',
    image: '/images/category-creatine.webp',
    isActive: true,
    displayOrder: 4,
    createdAt: '2026-11-20T10:00:00.000Z',
    updatedAt: '2026-11-20T10:00:00.000Z'
  }
];

// Initial seed data
export const getInitialSeed = () => {
  const salt = bcrypt.genSaltSync(10);
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'DevSuperAdmin@2026!';
  const clientAdminPassword = process.env.CLIENT_ADMIN_PASSWORD || 'StoreOwner@2026!';

  const superAdminPasswordHash = bcrypt.hashSync(superAdminPassword, salt);
  const clientAdminPasswordHash = bcrypt.hashSync(clientAdminPassword, salt);

  return {
    users: [
      {
        id: 'user-super-admin',
        name: process.env.SUPER_ADMIN_NAME || 'Lead Systems Developer',
        email: (process.env.SUPER_ADMIN_EMAIL || 'developer@rknutrition.com').toLowerCase(),
        passwordHash: superAdminPasswordHash,
        role: 'SUPER_ADMIN',
        avatarInitials: 'DEV',
        createdAt: '2026-11-20T00:00:00.000Z'
      },
      {
        id: 'user-client-admin',
        name: process.env.CLIENT_ADMIN_NAME || 'RK Store Manager',
        email: (process.env.CLIENT_ADMIN_EMAIL || 'storeowner@rknutrition.com').toLowerCase(),
        passwordHash: clientAdminPasswordHash,
        role: 'CLIENT_ADMIN',
        avatarInitials: 'RK',
        createdAt: '2026-11-20T00:00:00.000Z'
      }
    ],
    categories: getDefaultCategories(),
    products: [
      {
        id: 'rk-whey-protein-isolate',
        name: 'RK Pure Whey Isolate',
        slug: 'rk-whey-protein-isolate',
        category: 'protein',
        sku: 'RK-PRO-001',
        price: 3499,
        salePrice: 3199,
        stock: 45,
        lowStockThreshold: 10,
        shippingWeightKg: 1.2,
        paymentRule: 'ALL',
        shortDescription: 'Pure athletic whey isolate formulated to support lean muscle tissue maintenance and daily recovery routines.',
        fullDescription: 'High-yield micro-filtered whey protein isolate with minimal lactose and rapid digestion characteristics. Formulated without amino spiking, maltodextrin fillers, or unnecessary artificial thickeners.',
        images: [],
        variants: [
          { id: 'var-1', name: '1 kg', flavour: 'Double Chocolate', size: '1 kg', sku: 'RK-PRO-CHOC-1KG', price: 3499, salePrice: 3199, stock: 25 },
          { id: 'var-2', name: '2 kg', flavour: 'Double Chocolate', size: '2 kg', sku: 'RK-PRO-CHOC-2KG', price: 6299, salePrice: 5999, stock: 20 }
        ],
        servingInfo: 'Serving Size: 30g | Servings: 33',
        ingredients: 'Whey Protein Isolate, Cocoa (in chocolate variants), Natural Aromas, Sunflower Lecithin.',
        nutritionFacts: 'Serving Size: 30g | Protein: 27g | Carbohydrates: 0.8g | Fat: 0.3g | BCAA: 6.2g',
        allergenInfo: 'Contains milk and dairy derivatives. Soy-free formulation.',
        usageInstructions: 'Mix 1 scoop with 250ml of cold water or milk alternative. Consume immediately post-workout.',
        storageInstructions: 'Store in a cool, dry place away from direct sunlight. Reseal tightly after use.',
        status: 'published',
        featured: true,
        visibility: true,
        availability: 'in-stock',
        seoTitle: 'RK Pure Whey Isolate — 100% Ultra-Filtered Protein',
        seoDescription: 'Verified athletic whey isolate formulated for lean muscle retention, maximum bioavailability, and uncompromising purity.',
        createdAt: '2026-11-20T10:00:00.000Z',
        updatedAt: '2026-11-21T08:00:00.000Z'
      },
      {
        id: 'rk-advanced-mass-fuel',
        name: 'RK Advanced Mass Fuel',
        slug: 'rk-advanced-mass-fuel',
        category: 'mass-gainer',
        sku: 'RK-MASS-001',
        price: 4299,
        salePrice: null,
        stock: 30,
        lowStockThreshold: 8,
        shippingWeightKg: 3.5,
        paymentRule: 'ALL',
        shortDescription: 'Structured high-density caloric formula engineered to assist dedicated lifters in demanding mass-building cycles.',
        fullDescription: 'Multi-stage complex carbohydrate and protein matrix tailored for rigorous recovery. Utilizes clean whole-food carbohydrate sources including milled oats and sweet potato powder.',
        images: [],
        variants: [
          { id: 'var-1', name: '3 kg', flavour: 'Vanilla Cream', size: '3 kg', sku: 'RK-MASS-VAN-3KG', price: 4299, salePrice: null, stock: 18 },
          { id: 'var-2', name: '5 kg', flavour: 'Vanilla Cream', size: '5 kg', sku: 'RK-MASS-VAN-5KG', price: 6999, salePrice: null, stock: 12 }
        ],
        servingInfo: 'Serving Size: 100g | Servings: 30',
        ingredients: 'Complex Carbohydrate Blend (Milled Oats, Sweet Potato Powder), Whey Concentrate, Micellar Casein.',
        nutritionFacts: 'Serving Size: 100g | Energy: 380 kcal | Protein: 32g | Carbohydrates: 56g | Fat: 3.5g',
        allergenInfo: 'Contains milk and gluten (oats).',
        usageInstructions: 'Blend 2 scoops with 400ml of liquid. Consume as a nutritional bridge between heavy training sessions.',
        storageInstructions: 'Keep in a dry environment below 25°C. Keep out of reach of young children.',
        status: 'published',
        featured: true,
        visibility: true,
        availability: 'in-stock',
        seoTitle: 'RK Advanced Mass Fuel — High-Density Caloric Matrix',
        seoDescription: 'Engineered mass gainer for structured athletic hypertrophy, high metabolic demands, and sustained muscular recovery.',
        createdAt: '2026-11-20T10:00:00.000Z',
        updatedAt: '2026-11-21T08:00:00.000Z'
      },
      {
        id: 'rk-ignition-preworkout',
        name: 'RK Ignition Pre-Workout',
        slug: 'rk-ignition-preworkout',
        category: 'pre-workout',
        sku: 'RK-PRE-001',
        price: 2499,
        salePrice: 2199,
        stock: 50,
        lowStockThreshold: 15,
        shippingWeightKg: 0.5,
        paymentRule: 'ALL',
        shortDescription: 'High-intensity training catalyst designed for sharp focus, cellular readiness, and relentless endurance.',
        fullDescription: 'Comprehensive training preparation matrix formulated without proprietary concealment. Delivers transparent clinical doses of Citrulline Malate, Beta-Alanine, and Natural Caffeine.',
        images: [],
        variants: [
          { id: 'var-1', name: '30 Servings', flavour: 'Sour Green Apple', size: '30 Servings', sku: 'RK-PRE-APL-30S', price: 2499, salePrice: 2199, stock: 50 }
        ],
        servingInfo: 'Serving Size: 12g | Servings: 30',
        ingredients: 'L-Citrulline Malate, Beta-Alanine, Natural Caffeine, Himalayan Pink Salt, Taurine.',
        nutritionFacts: 'Serving Size: 12g | Active Matrix: 10.5g | Caffeine: 250mg | L-Citrulline: 6000mg',
        allergenInfo: 'Manufactured in an allergen-tested facility. Sugar-free.',
        usageInstructions: 'Mix 1 scoop in 200ml cold water 20-30 minutes prior to intense physical training. Assess tolerance first.',
        storageInstructions: 'Store in a dry location. Silica desiccant included to prevent atmospheric moisture clumping.',
        status: 'published',
        featured: true,
        visibility: true,
        availability: 'in-stock',
        seoTitle: 'RK Ignition Pre-Workout — Clinically Dosed Focus Formula',
        seoDescription: 'Sharpen mental focus, increase muscular endurance, and enhance workout volume with clean, jitter-free energy.',
        createdAt: '2026-11-20T10:00:00.000Z',
        updatedAt: '2026-11-21T08:00:00.000Z'
      },
      {
        id: 'rk-creatine-monohydrate',
        name: 'RK Micronized Creatine',
        slug: 'rk-micronized-creatine',
        category: 'creatine',
        sku: 'RK-CRE-001',
        price: 1499,
        salePrice: 1299,
        stock: 60,
        lowStockThreshold: 15,
        shippingWeightKg: 0.4,
        paymentRule: 'ALL',
        shortDescription: 'Pure 100% micronized creatine monohydrate engineered to saturate phosphocreatine stores and boost explosive muscular power.',
        fullDescription: 'Pharmaceutical-grade 200-mesh micronized creatine monohydrate. Ultra-fine powder dissolves effortlessly with zero grit, accelerating ATP regeneration during maximal resistance efforts.',
        images: [],
        variants: [
          { id: 'var-1', name: '250 g (83 Servings)', flavour: 'Unflavoured', size: '250 g', sku: 'RK-CRE-UNF-250G', price: 1499, salePrice: 1299, stock: 60 }
        ],
        servingInfo: 'Serving Size: 3g | Servings: 83',
        ingredients: '100% Pure Micronized Creatine Monohydrate (Creapure Quality Standard).',
        nutritionFacts: 'Serving Size: 3g | Pure Creatine Monohydrate: 3,000mg | Zero Calories | Zero Sugars',
        allergenInfo: 'Manufactured in a certified allergen-free facility. 100% Vegan.',
        usageInstructions: 'Mix 1 scoop (3g) with 200ml cold water, juice, or your post-workout protein shake. Consume daily for optimal intramuscular saturation.',
        storageInstructions: 'Store in a cool, dry place away from moisture. Keep container tightly sealed.',
        status: 'published',
        featured: true,
        visibility: true,
        availability: 'in-stock',
        seoTitle: 'RK Micronized Creatine Monohydrate — 100% Pure Cellular ATP Catalyst',
        seoDescription: 'Boost muscular power, maximize sprint and lift performance, and support lean mass with 200-mesh ultra-micronized creatine.',
        createdAt: '2026-11-20T10:00:00.000Z',
        updatedAt: '2026-11-21T08:00:00.000Z'
      }
    ],
    coupons: [
      {
        id: 'coup-1',
        code: 'RKLAUNCH10',
        discountType: 'percentage',
        discountValue: 10,
        minCartValue: 1999,
        maxUses: 200,
        usedCount: 14,
        expiryDate: '2027-12-31',
        isActive: true,
        description: '10% launch discount on foundational orders over ₹1,999'
      },
      {
        id: 'coup-2',
        code: 'POWER500',
        discountType: 'fixed',
        discountValue: 500,
        minCartValue: 3999,
        maxUses: 100,
        usedCount: 8,
        expiryDate: '2027-12-31',
        isActive: true,
        description: 'Flat ₹500 off on bulk supplement orders above ₹3,999'
      }
    ],
    orders: [],
    reviews: [
      {
        id: 'rev-1',
        productId: 'rk-whey-protein-isolate',
        userName: 'Vikram Mehta',
        userEmail: 'vikram.m@example.com',
        rating: 5,
        title: 'Zero bloating and exceptional mixability',
        comment: 'Pure Whey Isolate dissolves cleanly in water with no clumps. Authentic rich cocoa flavour without chemical aftertaste.',
        isVerifiedPurchase: true,
        status: 'approved',
        createdAt: '2026-11-20T14:30:00.000Z'
      },
      {
        id: 'rev-2',
        productId: 'rk-ignition-preworkout',
        userName: 'Arjun Sen',
        userEmail: 'arjun.s@example.com',
        rating: 5,
        title: 'Sustained focus, absolutely no jitter crash',
        comment: 'The 6g Citrulline Malate pump is genuine. Clean tunnel vision focus throughout high-volume resistance training.',
        isVerifiedPurchase: true,
        status: 'approved',
        createdAt: '2026-11-20T18:00:00.000Z'
      }
    ],
    paymentMethods: {
      cod: {
        enabled: true,
        displayName: 'Cash on Delivery (COD)',
        description: 'Pay with physical cash upon carrier delivery. Subject to product-level eligibility rules.',
        instructions: 'Please have exact cash ready at the time of delivery.'
      },
      upi: {
        enabled: true,
        displayName: 'Instant UPI (Google Pay, PhonePe, Paytm)',
        description: 'Instant zero-fee transfer via verified UPI QR code or VPA handle.',
        instructions: 'Secure dynamic VPA integration.'
      },
      card: {
        enabled: true,
        displayName: 'Credit / Debit Cards & Net Banking',
        description: 'Visa, MasterCard, RuPay, and major Indian banking institutions.',
        instructions: 'Processed securely via compliant PCI-DSS gateway.'
      }
    },
    gatewayConfig: {
      provider: 'razorpay',
      mode: process.env.NODE_ENV === 'production' ? 'live' : 'test',
      keyId: process.env.RAZORPAY_KEY_ID || '',
      keySecret: process.env.RAZORPAY_KEY_SECRET || '',
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
      isConfigured: Boolean(process.env.RAZORPAY_KEY_ID),
      statusMessage: process.env.RAZORPAY_KEY_ID ? 'Razorpay active.' : 'Payment Gateway credentials pending Super Admin configuration.'
    },
    storeSettings: {
      storeName: 'RK Nutrition Official Store',
      contactEmail: 'Kuldeeprajput5262@gmail.com',
      supportPhone: '+91 86306 63134',
      secondaryPhone: '+91 74520 13333',
      shippingFee: 99,
      freeShippingThreshold: 999,
      taxGstPercent: 18,
      currency: 'INR',
      currencySymbol: '₹',
      operatingHours: 'Monday – Saturday: 09:00 AM – 07:00 PM IST',
      warehouseAddress: 'A12–16, Main Patpad Ganj Industrial Area, Delhi – 110092, India'
    },
    inquiries: [],
    newsletters: [],
    content: {
      homepage: {
        hero: {
          badge: 'RK NUTRITION / PERFORMANCE SERIES',
          headingLine1: 'FUEL YOUR',
          headingLine2: 'POTENTIAL.',
          headingLine3: 'NOT THE NOISE.',
          subtext: 'Straightforward sports nutrition. Transparent ingredients. No unnecessary hype. Find the essentials to support your training and everyday routine.',
          primaryCtaText: 'SHOP SUPPLEMENTS',
          primaryCtaHref: '/products',
          secondaryCtaText: 'EXPLORE THE RANGE',
          secondaryCtaHref: '/categories',
          headlineWhite: 'FUEL YOUR',
          headlineRed: 'POTENTIAL.',
          primaryCtaLink: '/products',
          secondaryCtaLink: '/categories',
          supportingLabel: 'BUILT FOR YOUR ROUTINE.'
        },
        sectionOrder: ['hero', 'pillars', 'featured', 'categories', 'education', 'intro', 'values', 'banner'],
        sectionVisibility: {
          hero: true,
          pillars: true,
          featured: true,
          categories: true,
          education: true,
          intro: true,
          values: true,
          banner: false
        },
        banner: {
          enabled: false,
          heading: 'SPECIAL LAUNCH OFFER',
          text: 'Use code RKLAUNCH10 for 10% off your first sports nutrition order over ₹1,999.',
          ctaText: 'SHOP SUPPLEMENTS',
          ctaHref: '/products'
        }
      },
      pages: {
        about: {
          heroBadge: 'OUR HERITAGE & FORMULATION STANDARDS',
          heroTitle: 'PURE SPORTS NUTRITION. BACKED BY SCIENCE.',
          heroSubtitle: 'RK Nutrition was established to eliminate deceptive marketing, proprietary filler blends, and amino spiking from sports supplements.',
          missionHeading: 'Honest, Evidence-Informed Nutrition for Dedicated Athletes',
          missionP1: 'We believe genuine physical vitality starts with clean dietary habits and foundational macronutrient discipline.',
          missionP2: 'At RK Nutrition, our approach is straightforward: formulate supplements with verified ingredients at meaningful dosages, maintain absolute labeling transparency, and provide athletes with the reliable nutritional support they need to fuel their body and achieve real results.'
        },
        contact: {
          email: 'Kuldeeprajput5262@gmail.com',
          inquiriesEmail: 'Kuldeeprajput5262@gmail.com',
          businessHours: 'Monday – Saturday: 9:00 AM – 7:00 PM IST',
          responseTime: '2 to 4 business hours',
          address: 'A12–16, Main Patpad Ganj Industrial Area, Delhi – 110092, India',
          phone: '+91 86306 63134',
          secondaryPhone: '+91 74520 13333',
          whatsapp: 'https://wa.me/918630663134'
        },
        faq: [
          {
            id: 'faq-1',
            question: 'Are supplements a replacement for real food?',
            answer: 'No. Supplements are designed to complement a nutrient-dense whole-food diet. They help bridge protein gaps, support post-training recovery convenience, and provide targeted macronutrients and micronutrients when whole food is impractical.',
            visible: true
          },
          {
            id: 'faq-2',
            question: 'How do I choose between Pure Whey Isolate and Advanced Mass Fuel?',
            answer: 'Pure Whey Isolate delivers ultra-lean protein (27g protein with less than 1g carbs/fat) for clean muscle recovery without caloric surplus. Advanced Mass Fuel provides high-density calories (380 kcal, 32g protein, and clean complex carbs) for athletes and hardgainers needing caloric surplus to gain mass.',
            visible: true
          },
          {
            id: 'faq-3',
            question: "What does 'Zero Amino Spiking' mean?",
            answer: 'Amino spiking is an industry shortcut where manufacturers add cheap non-protein nitrogen compounds (such as free glycine or taurine) to artificially inflate laboratory protein test scores. At RK Nutrition, we test and guarantee that 100% of stated protein comes from pure, intact dairy protein.',
            visible: true
          },
          {
            id: 'faq-4',
            question: 'How and when should I take Ignition Pre-Workout?',
            answer: 'Mix 1 scoop with 200–250ml of cold water and consume 20–30 minutes before your physical activity. If you are sensitive to caffeine, we recommend starting with half a scoop to assess your tolerance.',
            visible: true
          },
          {
            id: 'faq-5',
            question: 'Can I combine Whey Protein and Creatine together?',
            answer: 'Yes. Creatine Monohydrate and Whey Protein can be safely mixed together in the same shaker with water or milk. Consuming creatine alongside carbohydrates or protein can enhance cellular nutrient uptake.',
            visible: true
          },
          {
            id: 'faq-6',
            question: 'How long does shipping take and how can I track my order?',
            answer: 'Orders are processed and dispatched within 24–48 business hours. Once shipped, you will receive real-time courier tracking details via email/SMS. Standard delivery takes 3–5 business days nationwide.',
            visible: true
          }
        ],
        shippingPolicy: {
          title: 'Shipping and Delivery Policy',
          lastUpdated: 'November 2026',
          dispatchTime: 'Orders are processed and dispatched within 24-48 business hours of confirmation.',
          shippingCharges: 'Free shipping on orders above ₹999. A standard delivery charge of ₹99 applies for orders under ₹999.',
          carrierPartners: 'We partner with premier courier networks (BlueDart, Delhivery, DTDC) to ensure secure delivery.',
          codPolicy: 'Cash on Delivery is available in select serviceable PIN codes, subject to individual product payment rules.'
        },
        returnPolicy: {
          title: 'Returns & Replacement Policy',
          lastUpdated: 'November 2026',
          policyText: 'Due to strict dietary and hygiene standards, supplement items can only be replaced if received damaged, tampered, or expired. Return requests must be initiated within 48 hours of delivery accompanied by photographic proof of outer packaging.'
        },
        privacyPolicy: {
          title: 'Privacy Policy',
          lastUpdated: 'November 2026',
          text: 'At RK Nutrition, we value the privacy of our athletes and visitors. This platform does not sell, trade, or monetize personal tracking profiles.'
        },
        termsOfService: {
          title: 'Terms of Service',
          lastUpdated: 'November 2026',
          text: 'All formulations, visual branding, typography, and trade copy are the proprietary intellectual property of RK Nutrition.'
        }
      },
      branding: {
        name: 'RK NUTRITION',
        shortName: 'RK',
        tagline: 'PREMIUM SPORTS NUTRITION • PURE FORMULATIONS • PROVEN RESULTS',
        colors: {
          black: '#111111',
          darkGrey: '#1A1A1A',
          boldRed: '#C8202B',
          offWhite: '#F5F4F2'
        },
        headingFont: 'Barlow Condensed',
        bodyFont: 'Inter'
      },
      navigation: {
        headerLinks: [
          { id: 'nav-1', label: 'Home', path: '/', visible: true },
          { id: 'nav-2', label: 'Products', path: '/products', visible: true },
          { id: 'nav-3', label: 'Categories', path: '/categories', visible: true },
          { id: 'nav-4', label: 'About', path: '/about', visible: true },
          { id: 'nav-5', label: 'Learn', path: '/learn', visible: true },
          { id: 'nav-6', label: 'Contact', path: '/contact', visible: true }
        ],
        footerLinks: [
          { id: 'foot-1', label: 'Home', path: '/', visible: true },
          { id: 'foot-2', label: 'Products', path: '/products', visible: true },
          { id: 'foot-3', label: 'Categories', path: '/categories', visible: true },
          { id: 'foot-4', label: 'About', path: '/about', visible: true },
          { id: 'foot-5', label: 'Contact', path: '/contact', visible: true },
          { id: 'foot-6', label: 'FAQ', path: '/faq', visible: true }
        ],
        socialLinks: {
          instagram: 'https://instagram.com/rknutrition',
          youtube: 'https://youtube.com/@rknutrition',
          twitter: 'https://x.com/rknutrition',
          linkedin: 'https://linkedin.com/company/rknutrition'
        }
      },
      advanced: {
        analytics: {
          googleAnalyticsId: '',
          metaPixelId: '',
          enabled: false
        },
        smtp: {
          host: '',
          port: 587,
          user: '',
          pass: '',
          fromEmail: 'noreply@rknutrition.com',
          isConfigured: false
        },
        maintenanceMode: false,
        maintenanceMessage: 'RK Nutrition is undergoing scheduled system upgrades. Public ordering will resume shortly.'
      }
    },
    logs: [
      {
        id: 'log-1',
        timestamp: new Date().toISOString(),
        level: 'INFO',
        module: 'SYSTEM',
        message: 'RK Nutrition Dual-Admin Database initialized with verified schema.'
      }
    ]
  };
};

// Database in-memory cache
let dbCache = null;

export const getDb = () => {
  if (dbCache) {
    if (!dbCache.categories) dbCache.categories = getDefaultCategories();
    if (!dbCache.reviews) dbCache.reviews = [];
    if (!dbCache.newsletters) dbCache.newsletters = [];
    return dbCache;
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(data);
      if (!dbCache.categories) dbCache.categories = getDefaultCategories();
      if (!dbCache.reviews) dbCache.reviews = [];
      if (!dbCache.newsletters) dbCache.newsletters = [];

      // Sync admin users with environment credentials if defined
      if (process.env.SUPER_ADMIN_EMAIL && Array.isArray(dbCache.users)) {
        const superAdmin = dbCache.users.find((u) => u.role === 'SUPER_ADMIN' || u.id === 'user-super-admin');
        if (superAdmin) {
          superAdmin.email = process.env.SUPER_ADMIN_EMAIL.toLowerCase();
          if (process.env.SUPER_ADMIN_PASSWORD) {
            superAdmin.passwordHash = bcrypt.hashSync(process.env.SUPER_ADMIN_PASSWORD, 10);
          }
        }
      }
      if (process.env.CLIENT_ADMIN_EMAIL && Array.isArray(dbCache.users)) {
        const clientAdmin = dbCache.users.find((u) => u.role === 'CLIENT_ADMIN' || u.id === 'user-client-admin');
        if (clientAdmin) {
          clientAdmin.email = process.env.CLIENT_ADMIN_EMAIL.toLowerCase();
          if (process.env.CLIENT_ADMIN_PASSWORD) {
            clientAdmin.passwordHash = bcrypt.hashSync(process.env.CLIENT_ADMIN_PASSWORD, 10);
          }
        }
      }

      return dbCache;
    } catch (e) {
      console.error('[DB] Error reading cache file, re-seeding:', e);
    }
  }

  const initial = getInitialSeed();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[DB] Could not write cache file to disk, using in-memory store:', err.message);
  }
  dbCache = initial;
  return dbCache;
};

export const saveDb = (newData) => {
  dbCache = newData;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(newData, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[DB] Could not write cache file to disk:', err.message);
  }
  return dbCache;
};

export const addLog = (level, module, message, user = null) => {
  const db = getDb();
  const entry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    level,
    module: String(module).toUpperCase(),
    message,
    userId: user?.id || null,
    userEmail: user?.email || null
  };
  db.logs = [entry, ...(db.logs || []).slice(0, 199)];
  saveDb(db);

  // If MongoDB is connected, record audit log asynchronously
  if (mongoose.connection.readyState === 1) {
    AuditLog.create(entry).catch(() => {});
  }
};

// Mask URI for safe logging in server logs
export const getMaskedUri = (uri) => {
  if (!uri) return 'NOT_CONFIGURED';
  try {
    return uri.replace(/:([^:@]+)@/, ':****@');
  } catch {
    return 'CONFIGURED (MASKED)';
  }
};

let isConnecting = false;
let retryTimer = null;

// Mongoose Database Connection & Automated Seeder
export const connectDb = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const message = process.env.NODE_ENV === 'production'
      ? '[RK Nutrition DB] MONGODB_URI is missing from the production environment. Add MONGODB_URI to your Render service Environment tab.'
      : '[RK Nutrition DB] MONGODB_URI is missing. Set it in server/.env before starting the server.';
    console.error(message);
    throw new Error('MongoDB connection is required. MONGODB_URI is not configured.');
  }

  const masked = getMaskedUri(uri);
  console.log(`[RK Nutrition DB] Connecting to MongoDB Atlas: ${masked}`);

  try {
    await mongoose.connect(uri, {
      dbName: 'rk_nutrition',
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000
    });
    console.log('[RK Nutrition DB] MongoDB connection established successfully.');
    await seedMongooseIfEmpty();
    await syncFromMongoToMemory();
  } catch (err) {
    const code = err?.code || err?.cause?.code || 'unknown';
    const name = err?.name || 'MongoDBError';
    console.error(`[RK Nutrition DB] Connection failed (${name}, code: ${code}): ${err.message}`);
    if (name === 'MongoServerSelectionError' || name === 'MongooseServerSelectionError') {
      console.error('[RK Nutrition DB] Check Atlas Network Access (ensure 0.0.0.0/0 is active), cluster status, and DNS.');
    } else if (name === 'MongoServerError' && (code === 18 || code === '18')) {
      console.error('[RK Nutrition DB] Authentication failed. Check database username and password in MONGODB_URI.');
    }
    throw err;
  }
};

// Resilient background connector with automated retry
export const connectDbWithRetry = async (retryDelayMs = 10000) => {
  if (mongoose.connection.readyState === 1 || isConnecting) {
    return;
  }
  isConnecting = true;
  try {
    await connectDb();
  } catch (err) {
    console.warn(`[RK Nutrition DB] Background connection attempt failed (${err.message}). Retrying in ${retryDelayMs / 1000}s...`);
    if (retryTimer) clearTimeout(retryTimer);
    retryTimer = setTimeout(() => {
      isConnecting = false;
      connectDbWithRetry(retryDelayMs);
    }, retryDelayMs);
  } finally {
    isConnecting = false;
  }
};

// Seed Mongoose collections from initial seed if empty
const seedMongooseIfEmpty = async () => {
  if (mongoose.connection.readyState !== 1) return;

  try {
    const seed = getInitialSeed();

    // 1. Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(seed.users);
      console.log('[RK Nutrition DB] Seeded initial User accounts to MongoDB.');
    }

    // 2. Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.insertMany(seed.categories);
      console.log('[RK Nutrition DB] Seeded Categories to MongoDB.');
    } else {
      // Ensure all standard categories exist and have valid poster images
      for (const cat of seed.categories) {
        const found = await Category.findOne({ slug: cat.slug });
        if (!found) {
          await Category.create(cat);
          console.log(`[RK Nutrition DB] Added missing category ${cat.name} to MongoDB.`);
        } else if (!found.image || found.image === '') {
          await Category.updateOne({ slug: cat.slug }, { $set: { image: cat.image, tagline: cat.tagline, description: cat.description } });
        }
      }
      // Purge any stale test categories
      await Category.deleteMany({
        $or: [
          { id: { $regex: /^cat-test/i } },
          { slug: { $regex: /test-cat/i } },
          { name: 'Specialty Creatine' }
        ]
      });
    }

    // 3. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(seed.products);
      console.log('[RK Nutrition DB] Seeded Products to MongoDB.');
    } else {
      // Ensure standard Creatine product is available in published catalog
      const creatineProd = await Product.findOne({ slug: 'rk-micronized-creatine' });
      if (!creatineProd) {
        const standardCreatine = seed.products.find((p) => p.slug === 'rk-micronized-creatine');
        if (standardCreatine) {
          await Product.create(standardCreatine);
          console.log('[RK Nutrition DB] Added missing RK Micronized Creatine product to MongoDB.');
        }
      }
    }

    // 4. Seed Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      await Coupon.insertMany(seed.coupons);
      console.log('[RK Nutrition DB] Seeded Coupons to MongoDB.');
    }

    // 5. Seed StoreSettings
    const settingsCount = await StoreSettings.countDocuments();
    if (settingsCount === 0) {
      await StoreSettings.create({
        ...seed.storeSettings,
        paymentMethods: seed.paymentMethods,
        gatewayConfig: seed.gatewayConfig
      });
      console.log('[RK Nutrition DB] Seeded StoreSettings to MongoDB.');
    }

    // 6. Seed Content
    const contentCount = await Content.countDocuments();
    if (contentCount === 0) {
      await Content.create(seed.content);
      console.log('[RK Nutrition DB] Seeded Website Content to MongoDB.');
    }
  } catch (err) {
    console.error('[RK Nutrition DB] Seeding error:', err.message);
  }
};

// Synchronize memory cache from authoritative MongoDB Atlas collections
export const syncFromMongoToMemory = async () => {
  if (mongoose.connection.readyState !== 1) return;

  try {
    const [products, categories, users, orders, coupons, settings, content] = await Promise.all([
      Product.find().lean(),
      Category.find().lean(),
      User.find().lean(),
      Order.find().lean(),
      Coupon.find().lean(),
      StoreSettings.findOne().lean(),
      Content.findOne().lean()
    ]);

    const db = getDb();
    if (products && products.length > 0) db.products = products;
    if (categories && categories.length > 0) db.categories = categories;
    if (users && users.length > 0) db.users = users;
    if (Array.isArray(orders)) db.orders = orders;
    if (coupons && coupons.length > 0) db.coupons = coupons;
    if (settings) {
      db.storeSettings = { ...db.storeSettings, ...settings };
      if (settings.paymentMethods) db.paymentMethods = settings.paymentMethods;
      if (settings.gatewayConfig) db.gatewayConfig = settings.gatewayConfig;
    }
    if (content) db.content = content;

    saveDb(db);
    console.log(`[RK Nutrition DB] Authoritative cache synchronized from MongoDB (${products.length} products, ${orders.length} orders, ${users.length} users).`);
  } catch (err) {
    console.error('[RK Nutrition DB] Error syncing cache from MongoDB:', err.message);
  }
};
