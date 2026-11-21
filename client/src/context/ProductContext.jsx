/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { apiRequest } from '../services/api';
import { products as initialDefaultProducts } from '../data/products';

const ProductContext = createContext(null);

const STORAGE_KEY = 'rk_admin_products';

// Fallback seed
const ENRICHED_DEFAULTS = initialDefaultProducts.map((p, idx) => ({
  id: p.id,
  name: p.name,
  slug: p.id,
  category: p.category,
  sku: p.sku || `RK-${p.category.toUpperCase().slice(0, 4)}-00${idx + 1}`,
  price: p.price || 0,
  salePrice: p.salePrice || null,
  stock: p.stock || 40,
  lowStockThreshold: 10,
  shippingWeightKg: 1.0,
  paymentRule: 'ALL',
  shortDescription: p.description || '',
  fullDescription: p.additionalInfo?.productInfo || p.description || '',
  description: p.description || '',
  images: Array.isArray(p.images) ? p.images : [],
  variants: Array.isArray(p.variants)
    ? p.variants.map((v, vIdx) => ({
        id: v.id || `var-${vIdx + 1}`,
        name: v.name || '',
        flavour: v.flavour || '',
        size: v.size || v.name || '',
        sku: v.sku || `${p.id}-${v.id || vIdx + 1}`.toUpperCase(),
        price: v.price || p.price || 0,
        salePrice: v.salePrice || p.salePrice || null,
        stock: v.stock || 20
      }))
    : [],
  servingInfo: p.additionalInfo?.nutrition?.split('|')[0]?.trim() || '',
  ingredients: p.additionalInfo?.ingredients || '',
  nutritionFacts: p.additionalInfo?.nutrition || '',
  allergenInfo: p.category === 'protein' ? 'Contains milk/dairy.' : 'Manufactured in an allergen-tested facility.',
  usageInstructions: p.additionalInfo?.usage || '',
  storageInstructions: p.additionalInfo?.storage || '',
  status: 'published',
  featured: true,
  visibility: true,
  availability: p.availability || 'in-stock',
  seoTitle: `${p.name} — RK Nutrition`,
  seoDescription: p.description || '',
  createdAt: '2026-11-20T10:00:00.000Z',
  updatedAt: '2026-11-21T08:00:00.000Z'
}));

export function ProductProvider({ children }) {
  const [productsList, setProductsList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return ENRICHED_DEFAULTS;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync with backend API
  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    const res = await apiRequest('/products');
    if (res.success && Array.isArray(res.products)) {
      setProductsList(res.products);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(res.products));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const saveLocalBackup = (updated) => {
    setProductsList(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Add Product
  const addProduct = async (productData) => {
    const res = await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });

    if (res.success && res.product) {
      const updated = [res.product, ...productsList];
      saveLocalBackup(updated);
      return { success: true, product: res.product };
    }

    return { success: false, error: res.error || 'Failed to create product on server.' };
  };

  // Update Product
  const updateProduct = async (productId, updatedFields) => {
    const res = await apiRequest(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields)
    });

    if (res.success && res.product) {
      const updated = productsList.map((p) =>
        p.id === productId || p.slug === productId ? res.product : p
      );
      saveLocalBackup(updated);
      return { success: true, product: res.product };
    }

    return { success: false, error: res.error || 'Failed to update product on server.' };
  };

  // Duplicate Product
  const duplicateProduct = async (productId) => {
    const res = await apiRequest(`/products/${productId}/duplicate`, {
      method: 'POST'
    });

    if (res.success && res.product) {
      const updated = [res.product, ...productsList];
      saveLocalBackup(updated);
      return { success: true, product: res.product };
    }

    return { success: false, error: res.error || 'Failed to duplicate product.' };
  };

  // Delete Product
  const deleteProduct = async (productId) => {
    const res = await apiRequest(`/products/${productId}`, {
      method: 'DELETE'
    });

    if (res.success) {
      const target = productsList.find((p) => p.id === productId || p.slug === productId);
      const updated = productsList.filter((p) => p.id !== productId && p.slug !== productId);
      saveLocalBackup(updated);
      return { success: true, deletedName: target?.name || 'Product' };
    }

    return { success: false, error: res.error || 'Failed to delete product.' };
  };

  // Reset to default catalogue
  const resetProductsToDefault = () => {
    saveLocalBackup(ENRICHED_DEFAULTS);
    return { success: true };
  };

  // Get product by id or slug
  const getProductById = (idOrSlug) => {
    if (!idOrSlug) return null;
    return productsList.find(
      (p) => p.id === idOrSlug || p.slug === idOrSlug
    ) || null;
  };

  // Check SKU uniqueness
  const isSkuUnique = (sku, currentProductId = null) => {
    if (!sku) return true;
    const normalized = sku.trim().toLowerCase();
    return !productsList.some(
      (p) => p.sku?.trim().toLowerCase() === normalized && p.id !== currentProductId
    );
  };

  // Check Slug uniqueness
  const isSlugUnique = (slug, currentProductId = null) => {
    if (!slug) return true;
    const normalized = slug.trim().toLowerCase();
    return !productsList.some(
      (p) => (p.slug?.trim().toLowerCase() === normalized || p.id === normalized) && p.id !== currentProductId
    );
  };

  // Customer-facing published products & featured products
  const { publicProducts, featuredProducts } = useMemo(() => {
    const pub = productsList.filter(
      (p) => p.status === 'published' && p.visibility !== false
    );
    const explicit = pub.filter((p) => p.featured === true);
    const feat = explicit.length > 0 ? explicit.slice(0, 3) : pub.slice(0, 3);
    return {
      publicProducts: pub,
      featuredProducts: feat
    };
  }, [productsList]);

  return (
    <ProductContext.Provider
      value={{
        products: productsList,
        publicProducts,
        featuredProducts,
        isLoading,
        refreshProducts,
        addProduct,
        updateProduct,
        duplicateProduct,
        deleteProduct,
        getProductById,
        resetProductsToDefault,
        isSkuUnique,
        isSlugUnique
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    return {
      products: ENRICHED_DEFAULTS,
      publicProducts: ENRICHED_DEFAULTS,
      featuredProducts: ENRICHED_DEFAULTS.slice(0, 3),
      isLoading: false,
      refreshProducts: () => {},
      addProduct: async () => ({ success: false }),
      updateProduct: async () => ({ success: false }),
      duplicateProduct: async () => ({ success: false }),
      deleteProduct: async () => ({ success: false }),
      getProductById: (id) => ENRICHED_DEFAULTS.find((p) => p.id === id) || null,
      resetProductsToDefault: () => ({ success: false }),
      isSkuUnique: () => true,
      isSlugUnique: () => true
    };
  }
  return context;
}
