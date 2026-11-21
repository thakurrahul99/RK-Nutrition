/**
 * RK NUTRITION — PRODUCT DATA ARCHITECTURE
 * 
 * Clean, production-ready schema for RK Nutrition.
 * Products strictly match the brand's verified categories:
 * - Protein
 * - Mass Gainer
 * - Pre-Workout
 * 
 * @typedef {Object} ProductVariant
 * @property {string} id - Unique variant identifier
 * @property {string} name - Variant label (e.g., '1 kg', '2 kg')
 * @property {number} [price] - Variant-specific price
 * @property {number} [salePrice] - Variant-specific sale price
 * @property {boolean} [available] - Variant availability
 * 
 * @typedef {Object} ProductFAQ
 * @property {string} q - Question
 * @property {string} a - Answer
 * 
 * @typedef {Object} ProductAdditionalInfo
 * @property {string} [productInfo] - General product details
 * @property {string} [ingredients] - Verified ingredient list
 * @property {string} [nutrition] - Nutrition breakdown / facts
 * @property {string} [usage] - Directions for usage / serving
 * @property {string} [storage] - Storage and care instructions
 * @property {ProductFAQ[]} [faq] - Frequently asked questions
 * 
 * @typedef {Object} Product
 * @property {string} id - Unique product identifier
 * @property {string} name - Product display name
 * @property {'protein' | 'mass-gainer' | 'pre-workout'} category - Product category
 * @property {string[]} images - Image asset paths
 * @property {string} [description] - Product overview description
 * @property {number} [price] - Regular base price
 * @property {number} [salePrice] - Promotional sale price
 * @property {ProductVariant[]} [variants] - Available product variants
 * @property {'in-stock' | 'coming-soon' | 'out-of-stock'} [availability] - Inventory status
 * @property {ProductAdditionalInfo} [additionalInfo] - Verified informational sections
 */

/**
 * Primary Product Catalogue
 * Contains the foundational lineup for RK Nutrition.
 * @type {Product[]}
 */
export const products = [
  {
    id: "rk-whey-protein-isolate",
    name: "RK Pure Whey Isolate",
    category: "protein",
    images: [],
    description: "Pure athletic whey isolate formulated to support lean muscle tissue maintenance and daily recovery routines.",
    price: 3499,
    salePrice: 3199,
    variants: [
      { id: "1kg", name: "1 kg" },
      { id: "2kg", name: "2 kg" }
    ],
    availability: "in-stock",
    additionalInfo: {
      productInfo: "High-yield micro-filtered whey protein isolate with minimal lactose and rapid digestion characteristics.",
      ingredients: "Whey Protein Isolate, Cocoa (in chocolate variants), Natural Aromas, Sunflower Lecithin.",
      nutrition: "Serving Size: 30g | Protein: 27g | Carbohydrates: 0.8g | Fat: 0.3g",
      usage: "Mix 1 scoop with 250ml of cold water or milk alternative. Consume post-workout or between meals.",
      storage: "Store in a cool, dry place away from direct sunlight. Reseal tightly after opening.",
      faq: [
        {
          q: "When is the best time to consume RK Pure Whey Isolate?",
          a: "Most athletes prefer taking it immediately post-workout to support muscle recovery or between main meals."
        },
        {
          q: "Does this contain any fillers?",
          a: "No. RK Nutrition standards strictly exclude unnecessary fillers, maltodextrin blending, or artificial thickeners."
        }
      ]
    }
  },
  {
    id: "rk-advanced-mass-fuel",
    name: "RK Advanced Mass Fuel",
    category: "mass-gainer",
    images: [],
    description: "Structured high-density caloric formula engineered to assist dedicated lifters in demanding mass-building cycles.",
    price: 4299,
    variants: [
      { id: "3kg", name: "3 kg" },
      { id: "5kg", name: "5 kg" }
    ],
    availability: "in-stock",
    additionalInfo: {
      productInfo: "Engineered multi-stage complex carbohydrate and protein matrix tailored for intensive recovery.",
      ingredients: "Complex Carbohydrate Blend (Milled Oats, Sweet Potato Powder), Whey Concentrate, Micellar Casein.",
      nutrition: "Serving Size: 100g | Energy: 380 kcal | Protein: 32g | Carbohydrates: 56g",
      usage: "Blend 2 scoops with 400ml of liquid. Consume as a nutritional bridge between heavy training sessions.",
      storage: "Keep in a dry environment below 25°C. Keep out of reach of young children."
    }
  },
  {
    id: "rk-ignition-preworkout",
    name: "RK Ignition Pre-Workout",
    category: "pre-workout",
    images: [],
    description: "High-intensity training catalyst designed for sharp focus, cellular readiness, and relentless endurance.",
    price: 2499,
    salePrice: 2199,
    variants: [
      { id: "30-servings", name: "30 Servings" }
    ],
    availability: "in-stock",
    additionalInfo: {
      productInfo: "Comprehensive training prep matrix engineered without proprietary blends or unnecessary fillers.",
      ingredients: "L-Citrulline Malate, Beta-Alanine, Natural Caffeine, Himalayan Pink Salt, Taurine.",
      nutrition: "Serving Size: 12g | Active Matrix: 10.5g",
      usage: "Mix 1 scoop in 200ml cold water 20-30 minutes prior to intense physical training.",
      storage: "Store in a dry location. Silica desiccant included to prevent moisture clumping."
    }
  }
];

export const sampleVerificationProducts = products;
