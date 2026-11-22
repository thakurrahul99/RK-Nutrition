/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../services/api';
import { brandConfig } from '../config/brandConfig';

const ContentContext = createContext(null);

const DEFAULT_FAQ_ITEMS = [
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
];

const DEFAULT_CONTENT = {
  homepage: {
    hero: {
      badge: brandConfig.hero.badge,
      headingLine1: brandConfig.hero.headingLine1,
      headingLine2: brandConfig.hero.headingLine2,
      subtext: brandConfig.hero.subtext,
      primaryCtaText: brandConfig.hero.primaryCta.text,
      primaryCtaHref: '/products',
      secondaryCtaText: brandConfig.hero.secondaryCta.text,
      secondaryCtaHref: '/categories'
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
      whatsapp: 'https://wa.me/917452013333'
    },
    faq: DEFAULT_FAQ_ITEMS,
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
    name: brandConfig.name,
    shortName: brandConfig.shortName,
    tagline: brandConfig.tagline,
    colors: { ...brandConfig.colors },
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
      whatsapp: 'https://wa.me/917452013333',
      linkedin: 'https://linkedin.com/company/rknutrition'
    }
  },
  advanced: {
    seo: {
      siteTitle: 'RK Nutrition — Premium Sports Nutrition & Supplements',
      metaDescription: 'Shop pure sports nutrition formulations: micro-filtered Whey Protein Isolate, High-Density Mass Gainer, and Clinically Dosed Pre-Workout with 100% label transparency.',
      canonicalUrl: 'https://rknutrition.com',
      ogTitle: 'RK Nutrition — Pure Formulations. Proven Results.',
      ogDescription: 'Sports nutrition engineered with transparent ingredients, pure micro-filtered whey, and zero proprietary blends.',
      ogImage: 'https://rknutrition.com/rk-nutrition-og.jpg'
    },
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
};

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem('rk_website_content');
      if (saved) {
        return { ...DEFAULT_CONTENT, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONTENT;
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  const refreshContent = useCallback(async () => {
    const res = await apiRequest('/content');
    if (res.success && res.content) {
      setContent(res.content);
      localStorage.setItem('rk_website_content', JSON.stringify(res.content));
    }
  }, []);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  // Apply Brand Design Tokens to document root CSS variables
  useEffect(() => {
    if (content?.branding?.colors) {
      const c = content.branding.colors;
      const root = document.documentElement;
      if (c.primaryBlack) root.style.setProperty('--brand-black', c.primaryBlack);
      if (c.offWhite) root.style.setProperty('--brand-offwhite', c.offWhite);
      if (c.accentRed) root.style.setProperty('--brand-red', c.accentRed);
      if (c.darkGrey) root.style.setProperty('--brand-darkgrey', c.darkGrey);
      if (c.mutedGrey) root.style.setProperty('--brand-muted', c.mutedGrey);
    }
  }, [content?.branding?.colors]);

  // Super Admin updates
  const updateHomepage = async (homepageData) => {
    const res = await apiRequest('/content/homepage', {
      method: 'PUT',
      body: JSON.stringify(homepageData)
    });
    if (res.success) {
      setContent((prev) => ({ ...prev, homepage: res.homepage }));
      showToast('Homepage configuration updated on server.', 'success');
      return { success: true };
    }
    showToast(res.error || 'Failed to update homepage.', 'error');
    return { success: false, error: res.error };
  };

  const updatePages = async (pagesData) => {
    const res = await apiRequest('/content/pages', {
      method: 'PUT',
      body: JSON.stringify(pagesData)
    });
    if (res.success) {
      setContent((prev) => ({ ...prev, pages: res.pages }));
      showToast('Informational pages updated on server.', 'success');
      return { success: true };
    }
    showToast(res.error || 'Failed to update pages.', 'error');
    return { success: false, error: res.error };
  };

  const updateBranding = async (brandingData) => {
    const res = await apiRequest('/content/branding', {
      method: 'PUT',
      body: JSON.stringify(brandingData)
    });
    if (res.success) {
      setContent((prev) => ({ ...prev, branding: res.branding }));
      showToast('Visual branding palette updated on server.', 'success');
      return { success: true };
    }
    showToast(res.error || 'Failed to update branding.', 'error');
    return { success: false, error: res.error };
  };

  const updateNavigation = async (navData) => {
    const res = await apiRequest('/content/navigation', {
      method: 'PUT',
      body: JSON.stringify(navData)
    });
    if (res.success) {
      setContent((prev) => ({ ...prev, navigation: res.navigation }));
      showToast('Navigation links updated on server.', 'success');
      return { success: true };
    }
    showToast(res.error || 'Failed to update navigation.', 'error');
    return { success: false, error: res.error };
  };

  const updateAdvanced = async (advancedData) => {
    const res = await apiRequest('/content/advanced', {
      method: 'PUT',
      body: JSON.stringify(advancedData)
    });
    if (res.success) {
      setContent((prev) => ({ ...prev, advanced: res.advanced }));
      showToast('Advanced configuration updated on server.', 'success');
      return { success: true };
    }
    showToast(res.error || 'Failed to update configuration.', 'error');
    return { success: false, error: res.error };
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        // Backward-compatible properties for public pages
        hero: content.homepage?.hero || DEFAULT_CONTENT.homepage.hero,
        announcement: content.homepage?.banner || DEFAULT_CONTENT.homepage.banner,
        visibility: content.homepage?.sectionVisibility || DEFAULT_CONTENT.homepage.sectionVisibility,
        branding: content.branding || DEFAULT_CONTENT.branding,
        pages: content.pages || DEFAULT_CONTENT.pages,
        navigation: content.navigation || DEFAULT_CONTENT.navigation,
        advanced: content.advanced || DEFAULT_CONTENT.advanced,
        toast,
        showToast,
        refreshContent,
        updateHomepage,
        updatePages,
        updateBranding,
        updateNavigation,
        updateAdvanced
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    return {
      content: DEFAULT_CONTENT,
      hero: DEFAULT_CONTENT.homepage.hero,
      announcement: DEFAULT_CONTENT.homepage.banner,
      visibility: DEFAULT_CONTENT.homepage.sectionVisibility,
      branding: DEFAULT_CONTENT.branding,
      pages: DEFAULT_CONTENT.pages,
      navigation: DEFAULT_CONTENT.navigation,
      advanced: DEFAULT_CONTENT.advanced,
      toast: null,
      showToast: () => {},
      refreshContent: () => {},
      updateHomepage: async () => ({ success: false }),
      updatePages: async () => ({ success: false }),
      updateBranding: async () => ({ success: false }),
      updateNavigation: async () => ({ success: false }),
      updateAdvanced: async () => ({ success: false })
    };
  }
  return context;
}
