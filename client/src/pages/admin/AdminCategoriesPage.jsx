import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  X, 
  Upload, 
  ExternalLink, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Package,
  Dumbbell,
  Sparkles,
  Flame
} from 'lucide-react';
import { useCategories } from '../../context/CategoryContext';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { uploadFile } from '../../services/api';

export default function AdminCategoriesPage() {
  const { 
    adminCategories, 
    isLoading, 
    fetchAdminCategories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    reorderCategories, 
    toggleCategoryStatus 
  } = useCategories();

  const { showToast } = useContent();
  const { logActivity } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    image: '',
    isActive: true,
    displayOrder: 1
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef(null);

  // Fetch all admin categories on mount
  useEffect(() => {
    fetchAdminCategories();
  }, [fetchAdminCategories]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    let list = [...adminCategories];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          c.tagline?.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  }, [adminCategories, searchQuery]);

  // Overall Stats
  const stats = useMemo(() => {
    const total = adminCategories.length;
    const active = adminCategories.filter((c) => c.isActive !== false).length;
    const inactive = total - active;
    const totalProducts = adminCategories.reduce((sum, c) => sum + (c.productCount || 0), 0);
    return { total, active, inactive, totalProducts };
  }, [adminCategories]);

  // Open Form for Adding
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      tagline: '',
      description: '',
      image: '',
      isActive: true,
      displayOrder: adminCategories.length + 1
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open Form for Editing
  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      tagline: cat.tagline || '',
      description: cat.description || '',
      image: cat.image || '',
      isActive: cat.isActive !== false,
      displayOrder: cat.displayOrder || 1
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Auto-generate slug from name if user hasn't explicitly customized it
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFormData((prev) => {
      const isAutoSlug = !editingCategory || prev.slug === '' || prev.slug === generateSlug(prev.name);
      return {
        ...prev,
        name: newName,
        slug: isAutoSlug ? generateSlug(newName) : prev.slug
      };
    });
    if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: null }));
  };

  const generateSlug = (text) => {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }

    setIsUploadingImage(true);
    try {
      const res = await uploadFile(file);
      if (res.success && res.filePath) {
        setFormData((prev) => ({ ...prev, image: res.filePath }));
        showToast('Category image uploaded successfully.', 'success');
      } else {
        throw new Error(res.error || 'Upload failed');
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload category image.', 'error');
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  // Save Category Form
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Category name must be at least 2 characters.';
    }

    const cleanSlug = formData.slug ? generateSlug(formData.slug) : generateSlug(formData.name);
    if (!cleanSlug) {
      errors.slug = 'Valid slug is required.';
    }

    // Check duplicate slug on other categories
    const slugConflict = adminCategories.some(
      (c) => (!editingCategory || c.id !== editingCategory.id) && c.slug.toLowerCase() === cleanSlug.toLowerCase()
    );
    if (slugConflict) {
      errors.slug = `Slug "${cleanSlug}" is already used by another category.`;
    }

    // Check duplicate name
    const nameConflict = adminCategories.some(
      (c) => (!editingCategory || c.id !== editingCategory.id) && c.name.toLowerCase() === formData.name.trim().toLowerCase()
    );
    if (nameConflict) {
      errors.name = `Category "${formData.name.trim()}" already exists.`;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      slug: cleanSlug,
      tagline: formData.tagline.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      isActive: Boolean(formData.isActive),
      displayOrder: Number(formData.displayOrder) || 1
    };

    let result;
    if (editingCategory) {
      result = await updateCategory(editingCategory.id, payload);
      if (result.success) {
        showToast(`Category "${payload.name}" updated successfully.`, 'success');
        logActivity(`Updated product category: ${payload.name}`, 'category');
        setIsFormModalOpen(false);
      } else {
        showToast(result.error || 'Failed to update category.', 'error');
      }
    } else {
      result = await addCategory(payload);
      if (result.success) {
        showToast(`Category "${payload.name}" created successfully.`, 'success');
        logActivity(`Created new product category: ${payload.name}`, 'category');
        setIsFormModalOpen(false);
      } else {
        showToast(result.error || 'Failed to create category.', 'error');
      }
    }

    setIsSubmitting(false);
  };

  // Toggle Active/Inactive
  const handleToggleStatus = async (cat) => {
    const newStatus = !cat.isActive;
    const res = await toggleCategoryStatus(cat.id, cat.isActive);
    if (res.success) {
      showToast(`Category "${cat.name}" is now ${newStatus ? 'Active' : 'Inactive'}.`, 'success');
      logActivity(`Toggled status of category ${cat.name} to ${newStatus ? 'Active' : 'Inactive'}`, 'category');
    } else {
      showToast(res.error || 'Failed to update category status.', 'error');
    }
  };

  // Move Up / Move Down Reordering
  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredCategories.length) return;

    const reordered = [...filteredCategories];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const orderedIds = reordered.map((c) => c.id);
    const res = await reorderCategories(orderedIds);
    if (res.success) {
      showToast('Category display order updated.', 'success');
    } else {
      showToast(res.error || 'Failed to reorder categories.', 'error');
    }
  };

  // Delete Category
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsSubmitting(true);
    const res = await deleteCategory(categoryToDelete.id);
    if (res.success) {
      showToast(`Category "${categoryToDelete.name}" deleted successfully.`, 'success');
      logActivity(`Deleted category: ${categoryToDelete.name}`, 'category');
      setCategoryToDelete(null);
    } else {
      showToast(res.error || 'Failed to delete category.', 'error');
    }
    setIsSubmitting(false);
  };

  // Fallback category icon based on slug
  const renderCategoryIcon = (slug) => {
    const s = slug.toLowerCase();
    if (s.includes('protein')) return <Dumbbell className="w-5 h-5 text-[#C8202B]" />;
    if (s.includes('mass') || s.includes('gainer')) return <Sparkles className="w-5 h-5 text-[#C8202B]" />;
    if (s.includes('pre') || s.includes('workout') || s.includes('energy')) return <Flame className="w-5 h-5 text-[#C8202B]" />;
    return <Layers className="w-5 h-5 text-[#C8202B]" />;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#242424]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C8202B] uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Store Operations • Catalog Architecture</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F5F4F2] tracking-tight mt-1">
            Product Categories
          </h1>
          <p className="text-xs text-[#8C8C8C] mt-1 font-body">
            Manage your store's dynamic categories, display order, storefront filters, and product assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C8202B] hover:bg-[#AC1721] text-xs font-heading font-bold uppercase tracking-wider text-[#F5F4F2] transition-colors shadow-lg shadow-[#C8202B]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-[#242424] p-4">
          <div className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider">Total Categories</div>
          <div className="mt-1 font-heading font-bold text-2xl text-[#F5F4F2]">
            {stats.total}
          </div>
          <div className="text-[10px] font-mono text-[#666666] mt-0.5">Configured categories</div>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-4">
          <div className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider">Active On Storefront</div>
          <div className="mt-1 font-heading font-bold text-2xl text-[#4CAF50]">
            {stats.active}
          </div>
          <div className="text-[10px] font-mono text-[#666666] mt-0.5">Visible to customers</div>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-4">
          <div className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider">Inactive / Hidden</div>
          <div className="mt-1 font-heading font-bold text-2xl text-amber-500">
            {stats.inactive}
          </div>
          <div className="text-[10px] font-mono text-[#666666] mt-0.5">Draft or unlisted</div>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-4">
          <div className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider">Assigned Products</div>
          <div className="mt-1 font-heading font-bold text-2xl text-[#C8202B]">
            {stats.totalProducts}
          </div>
          <div className="text-[10px] font-mono text-[#666666] mt-0.5">Across all categories</div>
        </div>
      </div>

      {/* 3. Search and Quick Filters */}
      <div className="bg-[#141414] border border-[#242424] p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name, slug, or tagline..."
            className="w-full bg-[#181818] border border-[#2B2B2B] focus:border-[#C8202B] focus:outline-none pl-9 pr-8 py-2 text-xs text-[#F5F4F2] placeholder-[#555555]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#F5F4F2]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <span className="text-xs font-mono text-[#8C8C8C] hidden sm:block">
          Showing {filteredCategories.length} of {adminCategories.length} categories
        </span>
      </div>

      {/* 4. Categories Table */}
      <div className="bg-[#141414] border border-[#242424] overflow-hidden">
        {isLoading && adminCategories.length === 0 ? (
          <div className="py-16 text-center text-xs font-mono text-[#8C8C8C]">
            <div className="w-6 h-6 border-2 border-[#C8202B] border-t-transparent animate-spin mx-auto mb-2" />
            Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Layers className="w-10 h-10 text-[#444444] mx-auto" />
            <p className="font-heading text-lg text-[#F5F4F2] uppercase font-bold">
              No Categories Found
            </p>
            <p className="text-xs text-[#8C8C8C] font-body max-w-sm mx-auto">
              {searchQuery ? `No category matching "${searchQuery}".` : 'No categories have been created yet.'}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="mt-2 px-4 py-2 bg-[#C8202B] text-xs font-heading uppercase tracking-wider text-[#F5F4F2]"
              >
                Create First Category
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#242424] bg-[#161616] text-[10px] font-mono uppercase tracking-widest text-[#8C8C8C]">
                  <th className="py-3 px-4 w-16 text-center">Order</th>
                  <th className="py-3 px-4 w-16">Image</th>
                  <th className="py-3 px-4">Category Details</th>
                  <th className="py-3 px-4 w-32">Slug / URL</th>
                  <th className="py-3 px-4 w-32 text-center">Products</th>
                  <th className="py-3 px-4 w-28 text-center">Status</th>
                  <th className="py-3 px-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C1C] text-xs">
                {filteredCategories.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-[#181818]/60 transition-colors group">
                    
                    {/* Order Stepper */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 font-mono">
                        <span className="text-[11px] font-bold text-[#8C8C8C] w-4">
                          {cat.displayOrder || idx + 1}
                        </span>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveOrder(idx, 'up')}
                            className="p-0.5 text-[#666666] hover:text-[#F5F4F2] disabled:opacity-20 disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === filteredCategories.length - 1}
                            onClick={() => handleMoveOrder(idx, 'down')}
                            className="p-0.5 text-[#666666] hover:text-[#F5F4F2] disabled:opacity-20 disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Image Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="w-12 h-12 bg-[#1A1A1A] border border-[#2D2D2D] overflow-hidden flex items-center justify-center shrink-0">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          renderCategoryIcon(cat.slug)
                        )}
                      </div>
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-sm text-[#F5F4F2] uppercase tracking-wide">
                            {cat.name}
                          </span>
                          {cat.isActive === false && (
                            <span className="text-[9px] font-mono uppercase bg-[#242424] text-amber-400 px-1.5 py-0.2 border border-amber-800/40">
                              Inactive
                            </span>
                          )}
                        </div>

                        {cat.tagline && (
                          <p className="text-[11px] font-mono text-[#C8202B]">
                            {cat.tagline}
                          </p>
                        )}

                        {cat.description && (
                          <p className="text-xs text-[#8C8C8C] line-clamp-1 font-body max-w-md">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <a
                        href={`/categories/${cat.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#8C8C8C] hover:text-[#C8202B] transition-colors inline-flex items-center gap-1"
                        title="View public category page"
                      >
                        <span>/{cat.slug}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </td>

                    {/* Assigned Products Count */}
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        to={`/admin/products?category=${cat.slug}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2C2C2C] text-xs font-mono text-[#F5F4F2] transition-colors"
                        title={`View ${cat.productCount || 0} assigned products`}
                      >
                        <Package className="w-3.5 h-3.5 text-[#C8202B]" />
                        <span>{cat.productCount || 0}</span>
                      </Link>
                    </td>

                    {/* Active/Inactive Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors border ${
                          cat.isActive !== false
                            ? 'bg-[#182618] border-[#2A4D2A] text-[#4CAF50] hover:bg-[#203620]'
                            : 'bg-[#222222] border-[#333333] text-[#8C8C8C] hover:text-[#F5F4F2]'
                        }`}
                        title="Click to toggle active status"
                      >
                        {cat.isActive !== false ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-1.5 bg-[#1C1C1C] hover:bg-[#262626] border border-[#2D2D2D] text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
                          title="Edit Category"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(cat)}
                          className="p-1.5 bg-[#1C1C1C] hover:bg-red-950/40 border border-[#2D2D2D] hover:border-red-800 text-[#8C8C8C] hover:text-red-400 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. ADD / EDIT CATEGORY MODAL */}
      {isFormModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl bg-[#141414] border border-[#262626] shadow-2xl relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#242424] flex items-center justify-between bg-[#161616]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C8202B]" />
                <h3 className="font-heading font-bold text-base uppercase tracking-wider text-[#F5F4F2]">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 text-[#8C8C8C] hover:text-[#F5F4F2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form id="category-form" onSubmit={handleSaveCategory} className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Category Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                  Category Name <span className="text-[#C8202B]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Creatine & Cellular Hydration"
                  className={`w-full bg-[#181818] border ${formErrors.name ? 'border-[#C8202B]' : 'border-[#2E2E2E]'} focus:border-[#C8202B] text-sm text-[#F5F4F2] px-3 py-2.5 focus:outline-none`}
                />
                {formErrors.name && (
                  <p className="text-[11px] font-mono text-[#C8202B] mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                  Category Slug (URL Path) <span className="text-[#C8202B]">*</span>
                </label>
                <div className="flex items-center">
                  <span className="bg-[#181818] border border-r-0 border-[#2E2E2E] text-xs font-mono text-[#666666] px-3 py-2.5">
                    /categories/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
                      if (formErrors.slug) setFormErrors((prev) => ({ ...prev, slug: null }));
                    }}
                    placeholder="creatine"
                    className={`flex-1 bg-[#181818] border ${formErrors.slug ? 'border-[#C8202B]' : 'border-[#2E2E2E]'} focus:border-[#C8202B] text-xs font-mono text-[#F5F4F2] px-3 py-2.5 focus:outline-none`}
                  />
                </div>
                {formErrors.slug && (
                  <p className="text-[11px] font-mono text-[#C8202B] mt-1">{formErrors.slug}</p>
                )}
                <span className="text-[10px] font-mono text-[#666666] mt-1 block">
                  Used in storefront URLs and product category filters.
                </span>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                  Sub-heading / Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
                  placeholder="e.g. Intracellular Hydration & Explosive Power"
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] text-xs text-[#F5F4F2] px-3 py-2 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                  Category Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Comprehensive description of the athletic objectives this category serves..."
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] text-xs text-[#F5F4F2] px-3 py-2 focus:outline-none font-body leading-relaxed"
                />
              </div>

              {/* Category Image */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                  Category Hero Image
                </label>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#181818] border border-[#2E2E2E] shrink-0 overflow-hidden flex items-center justify-center">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      renderCategoryIcon(formData.slug || 'category')
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isUploadingImage}
                        onClick={() => imageInputRef.current?.click()}
                        className="px-3 py-1.5 bg-[#202020] hover:bg-[#282828] border border-[#333333] text-xs font-mono text-[#F5F4F2] flex items-center gap-1.5 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#C8202B]" />
                        <span>{isUploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                      </button>

                      {formData.image && (
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                          className="px-2.5 py-1.5 bg-[#1C1C1C] hover:bg-red-950/40 text-xs font-mono text-red-400 border border-[#2D2D2D] transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                      placeholder="Or enter direct image URL (/uploads/... or https://...)"
                      className="w-full bg-[#181818] border border-[#2B2B2B] text-[11px] font-mono text-[#8C8C8C] px-2.5 py-1 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Display Order & Active Toggle */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#222222]">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: e.target.value }))}
                    className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] text-xs font-mono text-[#F5F4F2] px-3 py-2 focus:outline-none"
                  />
                  <span className="text-[10px] font-mono text-[#666666] mt-1 block">
                    Lower numbers appear first.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                    Visibility Status
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 accent-[#C8202B]"
                    />
                    <span className="text-xs text-[#F5F4F2] font-mono uppercase">
                      {formData.isActive ? 'Active on Storefront' : 'Hidden / Inactive'}
                    </span>
                  </label>
                </div>
              </div>

            </form>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#242424] bg-[#161616] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="px-4 py-2 bg-[#202020] hover:bg-[#282828] text-xs font-mono uppercase text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="category-form"
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#C8202B] hover:bg-[#AC1721] text-xs font-heading font-bold uppercase tracking-wider text-[#F5F4F2] transition-colors flex items-center gap-1.5 shadow-lg shadow-[#C8202B]/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. SAFE DELETE CONFIRMATION MODAL */}
      {categoryToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-[#161616] border border-[#2E2E2E] p-6 shadow-2xl relative space-y-4">
            
            <div className="flex items-center gap-3 pb-3 border-b border-[#242424]">
              <div className="w-9 h-9 bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#F5F4F2] uppercase">
                  Delete Category
                </h3>
                <span className="text-xs font-mono text-[#8C8C8C]">{categoryToDelete.name}</span>
              </div>
            </div>

            {categoryToDelete.productCount > 0 ? (
              <div className="space-y-3">
                <div className="p-3 bg-red-950/30 border border-red-900/60 text-xs font-mono text-red-200">
                  <strong className="block uppercase text-red-300 mb-1">Cannot Delete Category</strong>
                  This category is currently assigned to <strong className="text-white">{categoryToDelete.productCount} product(s)</strong>.
                  Deleting it would orphan these products on the storefront.
                </div>
                <p className="text-xs text-[#8C8C8C] font-body">
                  Please reassign or delete the products assigned to this category before attempting deletion.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <Link
                    to={`/admin/products?category=${categoryToDelete.slug}`}
                    onClick={() => setCategoryToDelete(null)}
                    className="px-4 py-2 bg-[#1F1F1F] hover:bg-[#282828] text-xs font-mono text-[#F5F4F2] border border-[#333333] transition-colors"
                  >
                    View Products ({categoryToDelete.productCount})
                  </Link>
                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(null)}
                    className="px-4 py-2 bg-[#242424] text-xs font-mono text-[#CCCCCC] hover:text-[#F5F4F2]"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#CCCCCC] font-body leading-relaxed">
                  Are you sure you want to delete category <strong className="text-[#F5F4F2]">"{categoryToDelete.name}"</strong>?
                  This action is permanent. No products are currently assigned to this category.
                </p>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#242424]">
                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(null)}
                    className="px-4 py-2 bg-[#202020] text-xs font-mono text-[#8C8C8C] hover:text-[#F5F4F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleDeleteCategory}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 text-xs font-heading font-bold uppercase tracking-wider text-white transition-colors"
                  >
                    {isSubmitting ? 'Deleting...' : 'Confirm Deletion'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
