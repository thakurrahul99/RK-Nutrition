import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  homepage: {
    hero: {
      badge: { type: String, default: 'RK NUTRITION / PERFORMANCE SERIES' },
      headingLine1: { type: String, default: 'FUEL YOUR' },
      headingLine2: { type: String, default: 'POTENTIAL.' },
      headingLine3: { type: String, default: 'NOT THE NOISE.' },
      subtext: { type: String, default: 'Straightforward sports nutrition. Transparent ingredients. No unnecessary hype. Find the essentials to support your training and everyday routine.' },
      primaryCtaText: { type: String, default: 'SHOP SUPPLEMENTS' },
      primaryCtaHref: { type: String, default: '/products' },
      secondaryCtaText: { type: String, default: 'EXPLORE THE RANGE' },
      secondaryCtaHref: { type: String, default: '/categories' },
      supportingLabel: { type: String, default: 'BUILT FOR YOUR ROUTINE.' }
    },
    sectionOrder: [{ type: String }],
    sectionVisibility: { type: mongoose.Schema.Types.Mixed, default: {} },
    banner: {
      enabled: { type: Boolean, default: false },
      heading: { type: String, default: 'SPECIAL LAUNCH OFFER' },
      text: { type: String, default: 'Use code RKLAUNCH10 for 10% off orders over ₹1,999.' },
      ctaText: { type: String, default: 'SHOP SUPPLEMENTS' },
      ctaHref: { type: String, default: '/products' }
    }
  },
  pages: {
    about: { type: mongoose.Schema.Types.Mixed, default: {} },
    contact: { type: mongoose.Schema.Types.Mixed, default: {} },
    faq: [{ type: mongoose.Schema.Types.Mixed }],
    shippingPolicy: { type: mongoose.Schema.Types.Mixed, default: {} },
    returnPolicy: { type: mongoose.Schema.Types.Mixed, default: {} },
    privacyPolicy: { type: mongoose.Schema.Types.Mixed, default: {} },
    termsOfService: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  branding: {
    colors: {
      black: { type: String, default: '#0B0B0B' },
      darkGrey: { type: String, default: '#121212' },
      boldRed: { type: String, default: '#D51F32' },
      offWhite: { type: String, default: '#F2F2F2' }
    },
    headingFont: { type: String, default: 'Bebas Neue' },
    bodyFont: { type: String, default: 'Plus Jakarta Sans' }
  },
  navigation: {
    headerLinks: [{ type: mongoose.Schema.Types.Mixed }],
    footerLinks: [{ type: mongoose.Schema.Types.Mixed }],
    socialLinks: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  advanced: {
    analytics: {
      googleAnalyticsId: { type: String, default: '' },
      metaPixelId: { type: String, default: '' },
      enabled: { type: Boolean, default: false }
    },
    smtp: {
      host: { type: String, default: '' },
      port: { type: Number, default: 587 },
      user: { type: String, default: '' },
      senderEmail: { type: String, default: 'noreply@rknutrition.com' }
    },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: 'RK Nutrition is undergoing scheduled system upgrades.' },
    seo: {
      siteTitle: { type: String, default: 'RK Nutrition — Premium Sports Nutrition & Supplements' },
      metaDescription: { type: String, default: 'High-yield Whey Protein Isolate, Mass Gainers, and Pre-Workout formulations with transparent labels.' },
      canonicalUrl: { type: String, default: 'https://rknutrition.com' },
      ogTitle: { type: String, default: 'RK Nutrition — Premium Sports Nutrition' },
      ogDescription: { type: String, default: 'Clean sports nutrition designed for athletes.' },
      ogImage: { type: String, default: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=1200&q=80' }
    }
  }
}, { timestamps: true });

export const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);
export default Content;
