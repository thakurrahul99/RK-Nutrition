export const brandConfig = {
  name: "RK NUTRITION",
  shortName: "RK",
  logo: "/images/RK%20Nutrition%20Logo.png",
  tagline: "PREMIUM SPORTS NUTRITION • PURE FORMULATIONS • PROVEN RESULTS",
  contact: {
    brandName: "RK Nutrition",
    address: {
      line1: "A12–16, Main Patpad Ganj Industrial Area",
      city: "Delhi",
      postalCode: "110092",
      country: "India",
      full: "A12–16, Main Patpad Ganj Industrial Area, Delhi – 110092, India",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Patparganj+Industrial+Area+Delhi+110092",
    },
    phones: [
      { number: "8630663134", display: "+91 86306 63134", tel: "+918630663134", label: "Customer Care / Orders", primary: true },
      { number: "7452013333", display: "+91 74520 13333", tel: "+917452013333", label: "Direct Support / WhatsApp", secondary: true },
    ],
    primaryPhone: "+91 86306 63134",
    primaryPhoneRaw: "8630663134",
    primaryPhoneTel: "+918630663134",
    secondaryPhone: "+91 74520 13333",
    secondaryPhoneRaw: "7452013333",
    secondaryPhoneTel: "+917452013333",
    whatsapp: {
      number: "7452013333",
      display: "+91 74520 13333",
      chatUrl: "https://wa.me/917452013333",
      getChatUrl: (message) => message ? `https://wa.me/917452013333?text=${encodeURIComponent(message)}` : 'https://wa.me/917452013333',
    },
    email: "Kuldeeprajput5262@gmail.com",
    mailto: "mailto:Kuldeeprajput5262@gmail.com",
    website: "https://www.rknutrition.com",
    workingHours: "Monday – Saturday: 9:00 AM – 7:00 PM IST",
    responseTime: "2-4 business hours",
  },
  colors: {
    black: "#111111",
    offWhite: "#F5F4F2",
    boldRed: "#C8202B",
    darkGrey: "#1A1A1A",
  },
  announcement: {
    enabled: true,
    text: "OFFICIAL LAUNCH • 10% OFF ORDERS ABOVE ₹1,999 WITH CODE RKLAUNCH10 • FREE NATIONWIDE SHIPPING",
    linkText: "SHOP NOW",
    linkHref: "/products",
  },
  navigation: {
    links: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  hero: {
    badge: "RK NUTRITION / PERFORMANCE SERIES",
    headingLine1: "FUEL YOUR",
    headingLine2: "POTENTIAL.",
    headingLine3: "NOT THE NOISE.",
    subtext: "Straightforward sports nutrition. Transparent ingredients. No unnecessary hype. Find the essentials to support your training and everyday routine.",
    primaryCta: {
      text: "SHOP SUPPLEMENTS",
      href: "/products",
    },
    secondaryCta: {
      text: "EXPLORE THE RANGE",
      href: "/categories",
    },
    supportingLabel: "BUILT FOR YOUR ROUTINE."
  },
  intro: {
    label: "NUTRITION SCIENCE",
    headingLine1: "FORMULATED FOR PURITY.",
    headingLine2: "BUILT FOR RESULTS.",
    bodyP1: "At RK Nutrition, we believe peak physical performance starts with foundational nutrition. Whether your goal is lean muscle recovery, meeting daily protein targets, or sustained athletic energy, our supplements are engineered with high-grade ingredients and zero fillers.",
    bodyP2: "We hold our formulations to rigorous standards: 100% transparent labeling, micro-filtered raw protein, and balanced macronutrient profiles without proprietary blends or amino spiking. Real nutrition that complements your daily diet.",
    taglineEmphasis: "PURITY • TRANSPARENCY • RIGOROUS FORMULATION",
  },
  categories: [
    {
      id: "protein",
      code: "01",
      title: "Protein",
      tagline: "Foundational Muscle Recovery",
      description: "Micro-filtered whey protein delivering 24g-27g pure protein per scoop to support muscle tissue repair, protein synthesis, and convenient daily protein intake.",
      accent: "Essential Recovery",
      features: [
        "27g pure protein per serving",
        "Micro-filtered whey isolate & concentrate",
        "Zero amino spiking & ultra-low lactose"
      ],
    },
    {
      id: "mass-gainer",
      code: "02",
      title: "Mass Gainer",
      tagline: "High-Density Energy & Mass",
      description: "High-density complex carbohydrates and multi-source protein matrix engineered to help athletes and hardgainers meet elevated caloric requirements.",
      accent: "Caloric Support",
      features: [
        "Complex carbohydrate matrix (milled oats & sweet potato)",
        "32g multi-stage protein per serving",
        "Zero added sugars or cheap maltodextrin bloating"
      ],
    },
    {
      id: "pre-workout",
      code: "03",
      title: "Pre-Workout",
      tagline: "Focus & Muscular Endurance",
      description: "Targeted performance preparation formulated with research-backed active compounds for mental alertness, muscular endurance, and training readiness.",
      accent: "Performance Catalyst",
      features: [
        "6,000mg L-Citrulline Malate for nitric oxide support",
        "Caffeine & Beta-Alanine for sustained alertness",
        "100% disclosed label with zero secret blends"
      ],
    },
  ],
  visualFeature: {
    badge: "PURITY & QUALITY",
    line1: "ZERO FILLERS.",
    line2: "100% TRANSPARENT.",
    subtext: "Every batch is formulated with premium raw ingredients. No hidden blends, no artificial fillers, no compromised standards.",
  },
  values: [
    {
      number: "01",
      title: "Label Transparency",
      subheading: "100% Disclosed Formula",
      description: "Every single active ingredient and dosage is explicitly disclosed. No proprietary formulas, no secret blends, and absolutely zero amino spiking.",
    },
    {
      number: "02",
      title: "Micro-Filtered Purity",
      subheading: "Superior Bioavailability",
      description: "We source ultra-filtered whey and micronized amino compounds designed for rapid solubility, clean digestion, and maximum absorption without digestive discomfort.",
    },
    {
      number: "03",
      title: "Nutritional Integrity",
      subheading: "Science-Backed Dosing",
      description: "Formulations grounded in nutritional science. Calibrated macro ratios that reliably support your dietary goals and daily protein requirements.",
    },
  ],
  footer: {
    description: "RK Nutrition delivers pure, high-grade sports supplements engineered for athletes and fitness enthusiasts. Formulated for clean digestion, label transparency, and reliable nutrition.",
    copyrightYear: new Date().getFullYear(),
  },
};
