/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { apiRequest } from '../services/api';

const CategoryContext = createContext(null);

const STORAGE_KEY_CATEGORIES = 'rk_public_categories';

// Foundational fallback categories in case of offline or initial render
const FALLBACK_CATEGORIES = [
  {
    id: 'cat-protein',
    name: 'Protein',
    slug: 'protein',
    tagline: 'Foundational Muscle Recovery',
    description: 'Formulated to support lean muscle tissue maintenance, protein synthesis, and daily recovery routines.',
    image: '/images/products/RK Nutrition Whey Protein Poster.png',
    isActive: true,
    displayOrder: 1,
    productCount: 1
  },
  {
    id: 'cat-mass-gainer',
    name: 'Mass Gainer',
    slug: 'mass-gainer',
    tagline: 'High-Density Energy & Mass',
    description: 'Engineered fuel to meet intense caloric demands and assist in structured, disciplined athletic mass building.',
    image: '/images/products/RK Nutrition Mass Gainer Showcase.png',
    isActive: true,
    displayOrder: 2,
    productCount: 1
  },
  {
    id: 'cat-pre-workout',
    name: 'Pre-Workout',
    slug: 'pre-workout',
    tagline: 'Focus & Training Intensity',
    description: 'Targeted training support designed for sharp mental focus, endurance, and uncompromising training readiness.',
    image: '/images/products/RK Nutrition Pre-Workout Energy Poster.png',
    isActive: true,
    displayOrder: 3,
    productCount: 1
  },
  {
    id: 'cat-creatine',
    name: 'Creatine',
    slug: 'creatine',
    tagline: 'Peak Power & Muscular Endurance',
    description: 'Pure 100% micronized creatine monohydrate engineered to saturate phosphocreatine stores, increase ATP regeneration, and enhance explosive strength.',
    image: '/images/products/Electric Blue Creatine Power Ad.png',
    isActive: true,
    displayOrder: 4,
    productCount: 1
  }
];

// Helper to sanitize and guarantee canonical categories & images
const sanitizeCategories = (list) => {
  if (!Array.isArray(list) || list.length === 0) return FALLBACK_CATEGORIES;
  const filtered = list.filter((c) => {
    const id = String(c.id || '').toLowerCase();
    const slug = String(c.slug || '').toLowerCase();
    const name = String(c.name || '').toLowerCase();
    return !id.startsWith('cat-test-') && !slug.startsWith('test-cat') && !slug.includes('test-cat') && name !== 'specialty creatine';
  });

  const enriched = filtered.map((c) => {
    let image = c.image;
    if (!image || String(image).trim() === '') {
      if (c.slug === 'protein') image = '/images/products/RK Nutrition Whey Protein Poster.png';
      else if (c.slug === 'mass-gainer') image = '/images/products/RK Nutrition Mass Gainer Showcase.png';
      else if (c.slug === 'pre-workout') image = '/images/products/RK Nutrition Pre-Workout Energy Poster.png';
      else if (c.slug === 'creatine') image = '/images/products/Electric Blue Creatine Power Ad.png';
    }
    return { ...c, image };
  });

  if (!enriched.some((c) => c.slug === 'creatine')) {
    const fallbackCreatine = FALLBACK_CATEGORIES.find((c) => c.slug === 'creatine');
    if (fallbackCreatine) enriched.push(fallbackCreatine);
  }

  enriched.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  return enriched;
};

export function CategoryProvider({ children }) {
  // Public active categories for storefront
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = sanitizeCategories(parsed);
          try {
            localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(sanitized));
          } catch {
            // ignore
          }
          return sanitized;
        }
      }
    } catch {
      // fallback
    }
    return FALLBACK_CATEGORIES;
  });

  // Client Admin categories (both active and inactive with full metrics)
  const [adminCategories, setAdminCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch active public categories
  const fetchPublicCategories = useCallback(async () => {
    try {
      const res = await apiRequest('/categories');
      if (res.success && Array.isArray(res.categories)) {
        const sanitized = sanitizeCategories(res.categories);
        setCategories(sanitized);
        try {
          localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(sanitized));
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.warn('Failed to fetch public categories, using local cache:', err);
    }
  }, []);

  // Fetch all categories for Client Admin
  const fetchAdminCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiRequest('/categories/admin');
      if (res.success && Array.isArray(res.categories)) {
        setAdminCategories(res.categories);
      } else {
        // Fallback to public if admin endpoint not accessible
        const publicRes = await apiRequest('/categories');
        if (publicRes.success && Array.isArray(publicRes.categories)) {
          setAdminCategories(publicRes.categories);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPublicCategories();
  }, [fetchPublicCategories]);

  // Add new category
  const addCategory = useCallback(async (categoryData) => {
    try {
      const res = await apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });

      if (!res.success) {
        return { success: false, error: res.error || 'Failed to create category' };
      }

      // Refresh lists
      await Promise.all([fetchPublicCategories(), fetchAdminCategories()]);
      return { success: true, category: res.category };
    } catch (err) {
      return { success: false, error: err.message || 'Network error creating category' };
    }
  }, [fetchPublicCategories, fetchAdminCategories]);

  // Update existing category
  const updateCategory = useCallback(async (id, categoryData) => {
    try {
      const res = await apiRequest(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
      });

      if (!res.success) {
        return { success: false, error: res.error || 'Failed to update category' };
      }

      await Promise.all([fetchPublicCategories(), fetchAdminCategories()]);
      return { success: true, category: res.category };
    } catch (err) {
      return { success: false, error: err.message || 'Network error updating category' };
    }
  }, [fetchPublicCategories, fetchAdminCategories]);

  // Reorder categories
  const reorderCategories = useCallback(async (orderedIds) => {
    try {
      const res = await apiRequest('/categories/reorder', {
        method: 'PUT',
        body: JSON.stringify({ orderedIds })
      });

      if (!res.success) {
        return { success: false, error: res.error || 'Failed to reorder categories' };
      }

      await Promise.all([fetchPublicCategories(), fetchAdminCategories()]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Network error reordering categories' };
    }
  }, [fetchPublicCategories, fetchAdminCategories]);

  // Toggle active status
  const toggleCategoryStatus = useCallback(async (id, currentStatus) => {
    return updateCategory(id, { isActive: !currentStatus });
  }, [updateCategory]);

  // Delete category with validation check
  const deleteCategory = useCallback(async (id) => {
    try {
      const res = await apiRequest(`/categories/${id}`, {
        method: 'DELETE'
      });

      if (!res.success) {
        return { 
          success: false, 
          error: res.error || 'Failed to delete category',
          assignedCount: res.assignedCount || 0
        };
      }

      await Promise.all([fetchPublicCategories(), fetchAdminCategories()]);
      return { success: true, message: res.message };
    } catch (err) {
      return { success: false, error: err.message || 'Network error deleting category' };
    }
  }, [fetchPublicCategories, fetchAdminCategories]);

  // Helper lookups
  const getCategoryBySlug = useCallback((slug) => {
    if (!slug) return null;
    const clean = slug.trim().toLowerCase();
    return (
      categories.find((c) => c.slug?.toLowerCase() === clean || c.id?.toLowerCase() === clean) ||
      adminCategories.find((c) => c.slug?.toLowerCase() === clean || c.id?.toLowerCase() === clean) ||
      FALLBACK_CATEGORIES.find((c) => c.slug?.toLowerCase() === clean || c.id?.toLowerCase() === clean) ||
      null
    );
  }, [categories, adminCategories]);

  const getCategoryById = useCallback((id) => {
    if (!id) return null;
    return (
      categories.find((c) => c.id === id) ||
      adminCategories.find((c) => c.id === id) ||
      FALLBACK_CATEGORIES.find((c) => c.id === id) ||
      null
    );
  }, [categories, adminCategories]);

  const value = useMemo(() => ({
    categories,
    adminCategories,
    isLoading,
    error,
    fetchPublicCategories,
    fetchAdminCategories,
    addCategory,
    updateCategory,
    reorderCategories,
    toggleCategoryStatus,
    deleteCategory,
    getCategoryBySlug,
    getCategoryById
  }), [
    categories,
    adminCategories,
    isLoading,
    error,
    fetchPublicCategories,
    fetchAdminCategories,
    addCategory,
    updateCategory,
    reorderCategories,
    toggleCategoryStatus,
    deleteCategory,
    getCategoryBySlug,
    getCategoryById
  ]);

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}
