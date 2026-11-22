import { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { uploadFile } from '../../services/api';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Trash2, 
  Plus, 
  AlertCircle, 
  Check, 
  Star
} from 'lucide-react';

const AVAILABILITY_OPTIONS = [
  { id: 'in-stock', label: 'In Stock' },
  { id: 'coming-soon', label: 'Coming Soon (Brand Foundation)' },
  { id: 'out-of-stock', label: 'Out of Stock' }
];

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, addProduct, updateProduct, isSkuUnique, isSlugUnique } = useProducts();
  const { adminCategories, categories } = useCategories();
  const { showToast } = useContent();
  const { logActivity } = useAuth();

  const isEditMode = Boolean(id);
  const existingProduct = isEditMode ? getProductById(id) : null;

  // Form State initialized lazily
  const [formData, setFormData] = useState(() => {
    if (existingProduct) {
      return {
        name: existingProduct.name || '',
        slug: existingProduct.slug || existingProduct.id || '',
        category: existingProduct.category || 'protein',
        sku: existingProduct.sku || '',
        price: existingProduct.price ?? '',
        salePrice: existingProduct.salePrice ?? '',
        shortDescription: existingProduct.shortDescription || existingProduct.description || '',
        fullDescription: existingProduct.fullDescription || existingProduct.additionalInfo?.productInfo || existingProduct.description || '',
        images: Array.isArray(existingProduct.images) ? [...existingProduct.images] : [],
        variants: Array.isArray(existingProduct.variants) ? JSON.parse(JSON.stringify(existingProduct.variants)) : [],
        servingInfo: existingProduct.servingInfo || existingProduct.additionalInfo?.nutrition?.split('|')[0]?.trim() || '',
        ingredients: existingProduct.ingredients || existingProduct.additionalInfo?.ingredients || '',
        nutritionFacts: existingProduct.nutritionFacts || existingProduct.additionalInfo?.nutrition || '',
        allergenInfo: existingProduct.allergenInfo || '',
        usageInstructions: existingProduct.usageInstructions || existingProduct.additionalInfo?.usage || '',
        storageInstructions: existingProduct.storageInstructions || existingProduct.additionalInfo?.storage || '',
        stock: existingProduct.stock ?? 40,
        lowStockThreshold: existingProduct.lowStockThreshold ?? 10,
        shippingWeightKg: existingProduct.shippingWeightKg ?? 1.0,
        paymentRule: existingProduct.paymentRule || 'ALL',
        badge: existingProduct.badge || '',
        status: existingProduct.status || 'published',
        featured: Boolean(existingProduct.featured),
        visibility: existingProduct.visibility !== false,
        availability: existingProduct.availability || 'coming-soon',
        seoTitle: existingProduct.seoTitle || `${existingProduct.name} — RK Nutrition`,
        seoDescription: existingProduct.seoDescription || existingProduct.description || ''
      };
    }
    return {
      name: '',
      slug: '',
      category: 'protein',
      sku: '',
      price: '',
      salePrice: '',
      shortDescription: '',
      fullDescription: '',
      images: [],
      variants: [],
      servingInfo: '',
      ingredients: '',
      nutritionFacts: '',
      allergenInfo: '',
      usageInstructions: '',
      storageInstructions: '',
      stock: 40,
      lowStockThreshold: 10,
      shippingWeightKg: 1.0,
      paymentRule: 'ALL',
      badge: '',
      status: 'published',
      featured: false,
      visibility: true,
      availability: 'coming-soon',
      seoTitle: '',
      seoDescription: ''
    };
  });

  // Dynamic Category Options from backend
  const categoryOptions = useMemo(() => {
    const list = adminCategories.length > 0 ? adminCategories : categories;
    const active = list.filter((c) => c.isActive !== false);

    // Ensure the product's current category is preserved if it's inactive or legacy
    const currentCat = formData.category;
    if (currentCat) {
      const isAlreadyInActive = active.some(
        (c) => c.slug?.toLowerCase() === currentCat.toLowerCase() || c.id === currentCat
      );
      if (!isAlreadyInActive) {
        const foundInAll = list.find(
          (c) => c.slug?.toLowerCase() === currentCat.toLowerCase() || c.id === currentCat
        );
        if (foundInAll) {
          return [...active, { ...foundInAll, isInactiveOrLegacy: true }];
        }
        return [
          ...active,
          {
            id: currentCat,
            slug: currentCat,
            name: currentCat.charAt(0).toUpperCase() + currentCat.slice(1),
            isInactiveOrLegacy: true
          }
        ];
      }
    }

    return active;
  }, [adminCategories, categories, formData.category]);

  const [validationErrors, setValidationErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [manualSlugEdited, setManualSlugEdited] = useState(isEditMode);

  const mainImageInputRef = useRef(null);
  const galleryImageInputRef = useRef(null);

  // Auto-generate slug from name in create mode if user hasn't manually edited it
  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, name: val };
      if (!isEditMode && !manualSlugEdited) {
        updated.slug = val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return updated;
    });
  };

  const handleSlugChange = (e) => {
    setManualSlugEdited(true);
    const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData((prev) => ({ ...prev, slug: sanitized }));
  };

  // --- Unified Image Upload Handlers (Cloudinary-backed server upload) ---
  const handleMainImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setValidationErrors(['Main image must be a valid image format (.jpg, .png, .webp).']);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setValidationErrors(['Main image must not exceed 5MB.']);
      return;
    }

    setIsUploadingImage(true);
    const uploadRes = await uploadFile(file);
    setIsUploadingImage(false);

    if (uploadRes.success && uploadRes.url) {
      setFormData((prev) => {
        const remaining = prev.images.slice(1);
        return { ...prev, images: [uploadRes.url, ...remaining] };
      });
      setValidationErrors([]);
      showToast('Main product image uploaded to Cloudinary.', 'success');
    } else {
      const errMsg = uploadRes.error || 'Failed to upload main image to Cloudinary.';
      setValidationErrors([errMsg]);
      showToast(errMsg, 'error');
    }

    if (mainImageInputRef.current) mainImageInputRef.current.value = '';
  };

  const handleGalleryImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setValidationErrors(['Gallery image must be a valid image format (.jpg, .png, .webp).']);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setValidationErrors(['Gallery image must not exceed 5MB.']);
      return;
    }

    setIsUploadingImage(true);
    const uploadRes = await uploadFile(file);
    setIsUploadingImage(false);

    if (uploadRes.success && uploadRes.url) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, uploadRes.url]
      }));
      setValidationErrors([]);
      showToast('Gallery image uploaded to Cloudinary.', 'success');
    } else {
      const errMsg = uploadRes.error || 'Failed to upload gallery image to Cloudinary.';
      setValidationErrors([errMsg]);
      showToast(errMsg, 'error');
    }

    if (galleryImageInputRef.current) galleryImageInputRef.current.value = '';
  };

  const removeImageAt = (index) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: updated };
    });
  };

  // --- Variant Handlers ---
  const addVariant = () => {
    const newVar = {
      id: `var-${Date.now()}`,
      name: '',
      flavour: '',
      size: '',
      sku: '',
      price: formData.price ? Number(formData.price) : 0,
      salePrice: formData.salePrice ? Number(formData.salePrice) : null
    };
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVar]
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  // --- Form Validation & Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors([]);
    const errors = [];

    // 1. Name
    if (!formData.name.trim()) {
      errors.push('Product name is required.');
    } else if (formData.name.trim().length < 3) {
      errors.push('Product name must be at least 3 characters.');
    }

    // 2. Slug
    const cleanSlug = formData.slug.trim().toLowerCase();
    if (!cleanSlug) {
      errors.push('Product slug is required.');
    } else if (!isSlugUnique(cleanSlug, isEditMode ? existingProduct?.id : null)) {
      errors.push(`The slug "${cleanSlug}" is already in use by another product.`);
    }

    // 3. Category
    if (!formData.category) {
      errors.push('Please select a product category.');
    }

    // 4. SKU
    const cleanSku = formData.sku.trim();
    if (!cleanSku) {
      errors.push('SKU / Product Code is required.');
    } else if (!isSkuUnique(cleanSku, isEditMode ? existingProduct?.id : null)) {
      errors.push(`The SKU "${cleanSku}" is already assigned to another product.`);
    }

    // 5. Price
    const numericPrice = Number(formData.price);
    if (formData.price === '' || isNaN(numericPrice) || numericPrice < 0) {
      errors.push('Valid regular price is required.');
    }

    if (formData.salePrice !== '') {
      const numericSale = Number(formData.salePrice);
      if (isNaN(numericSale) || numericSale < 0) {
        errors.push('Promotional sale price must be a valid number.');
      } else if (numericSale >= numericPrice) {
        errors.push('Sale price must be lower than the regular price.');
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Prepare payload
    const payload = {
      ...formData,
      name: formData.name.trim(),
      slug: cleanSlug,
      sku: cleanSku,
      price: numericPrice,
      salePrice: formData.salePrice !== '' ? Number(formData.salePrice) : null,
      shortDescription: formData.shortDescription.trim(),
      fullDescription: formData.fullDescription.trim(),
      description: formData.shortDescription.trim() || formData.fullDescription.trim(),
      // Additional Info block for backwards-compatibility with shop detail views
      additionalInfo: {
        productInfo: formData.fullDescription.trim() || formData.shortDescription.trim(),
        ingredients: formData.ingredients.trim(),
        nutrition: formData.nutritionFacts.trim(),
        usage: formData.usageInstructions.trim(),
        storage: formData.storageInstructions.trim(),
        faq: existingProduct?.additionalInfo?.faq || []
      }
    };

    let result;
    if (isEditMode) {
      result = await updateProduct(existingProduct.id, payload);
      if (result.success) {
        showToast(`Updated "${payload.name}" successfully.`, 'success');
        logActivity(`Updated product specifications for ${payload.name} (${payload.sku})`, 'products');
        navigate('/admin/products');
      } else {
        setValidationErrors([result.error || 'Failed to update product.']);
        setIsSubmitting(false);
      }
    } else {
      result = await addProduct(payload);
      if (result.success) {
        showToast(`Added "${payload.name}" to catalog.`, 'success');
        logActivity(`Created new product: ${payload.name} (${payload.sku})`, 'products');
        navigate('/admin/products');
      } else {
        setValidationErrors([result.error || 'Failed to create product.']);
        setIsSubmitting(false);
      }
    }
  };

  if (isEditMode && !existingProduct) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="font-heading text-2xl uppercase font-bold text-[#F5F4F2]">
          Product Not Found
        </h2>
        <p className="text-xs text-[#8C8C8C]">
          The product record ID "{id}" could not be retrieved from local storage.
        </p>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8202B] text-xs font-heading font-bold uppercase tracking-wider text-[#F5F4F2]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 bg-[#181818] hover:bg-[#202020] border border-[#2A2A2A] text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
            title="Back to Products"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C8202B]">
              <span>{isEditMode ? 'Edit Mode' : 'New Creation'}</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F5F4F2] tracking-tight mt-0.5">
              {isEditMode ? `Edit: ${existingProduct?.name}` : 'Add New Product'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#242424] border border-[#2E2E2E] text-xs font-heading font-semibold uppercase tracking-wider text-[#A0A0A0] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#C8202B] hover:bg-[#AC1721] text-xs font-heading font-bold uppercase tracking-wider text-[#F5F4F2] transition-colors shadow-lg shadow-[#C8202B]/20 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-[#C8202B]/10 border border-[#C8202B]/50 text-xs text-[#F5F4F2] space-y-1">
          <div className="flex items-center gap-2 font-mono font-bold text-[#C8202B] uppercase">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Please resolve the following before saving:</span>
          </div>
          <ul className="list-disc pl-5 space-y-0.5 font-mono text-[11px] text-[#F5F4F2]/90">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main 2-Column Form Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Primary Details & Formulation Data */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Basic Information */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-5">
            <h2 className="font-heading text-sm uppercase font-bold text-[#F5F4F2] tracking-wider pb-3 border-b border-[#242424]">
              1. Basic Information
            </h2>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                Product Name <span className="text-[#C8202B]">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. RK Pure Whey Isolate"
                required
                className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] focus:outline-none px-3.5 py-2.5 text-sm text-[#F5F4F2]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Product Slug / URL Key <span className="text-[#C8202B]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="e.g. rk-pure-whey-isolate"
                  required
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] focus:outline-none px-3.5 py-2 text-xs font-mono text-[#F5F4F2]"
                />
                <span className="text-[10px] font-mono text-[#666666] mt-1 block">
                  Route destination: /product/{formData.slug || 'slug'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                  SKU / Master Code <span className="text-[#C8202B]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                  placeholder="e.g. RK-PRO-001"
                  required
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] focus:outline-none px-3.5 py-2 text-xs font-mono text-[#F5F4F2]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Category Assignment <span className="text-[#C8202B]">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] focus:outline-none px-3.5 py-2 text-sm text-[#F5F4F2]"
                >
                  {categoryOptions.map((c) => (
                    <option key={c.id || c.slug} value={c.slug || c.id}>
                      {c.name} {c.isInactiveOrLegacy ? (c.isActive === false ? '(Inactive)' : '(Legacy)') : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                    Original Price (₹) <span className="text-[#C8202B]">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="3499"
                    required
                    className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] focus:outline-none px-3.5 py-2 text-sm font-mono text-[#F5F4F2]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
                      Sale Price (₹)
                    </label>
                    {formData.price && formData.salePrice && Number(formData.price) > Number(formData.salePrice) && (
                      <span className="text-[10px] font-mono text-[#4CAF50] font-bold">
                        {Math.round(((Number(formData.price) - Number(formData.salePrice)) / Number(formData.price)) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="3199"
                    className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] focus:outline-none px-3.5 py-2 text-sm font-mono text-[#F5F4F2]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                Short Overview Description
              </label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief summary displayed on catalog cards and previews..."
                className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] focus:outline-none p-3 text-sm text-[#F5F4F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                Full Formulation Description
              </label>
              <textarea
                rows={4}
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                placeholder="Comprehensive technical breakdown of formulation, athletic targets, and recovery characteristics..."
                className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] focus:outline-none p-3 text-sm text-[#F5F4F2]"
              />
            </div>
          </div>

          {/* Section 2: Product Media */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <h2 className="font-heading text-sm uppercase font-bold text-[#F5F4F2] tracking-wider">
                2. Product Media & Assets
              </h2>
              <span className="text-[10px] font-mono text-[#8C8C8C]">
                {formData.images.length} Image{formData.images.length === 1 ? '' : 's'} Configured
              </span>
            </div>

            {/* Main Primary Image */}
            <div className="p-4 bg-[#181818] border border-[#282828] space-y-3">
              <span className="text-xs font-heading uppercase font-bold text-[#F5F4F2] block">
                Primary Product Packaging / Visual
              </span>

              {formData.images.length > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-[#0E0E0E] border border-[#333333] flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={formData.images[0]}
                      alt="Primary Product"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-[#4CAF50] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Primary image attached</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => mainImageInputRef.current?.click()}
                        className="px-3 py-1.5 bg-[#222222] hover:bg-[#2A2A2A] text-xs font-heading uppercase text-[#F5F4F2]"
                      >
                        Replace Image
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImageAt(0)}
                        className="px-3 py-1.5 bg-[#222222] hover:bg-[#C8202B]/20 text-xs font-heading uppercase text-[#C8202B]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => !isUploadingImage && mainImageInputRef.current?.click()}
                  className={`p-6 border-2 border-dashed transition-colors flex flex-col items-center justify-center cursor-pointer text-center bg-[#141414] ${
                    isUploadingImage ? 'border-[#C8202B] opacity-75' : 'border-[#333333] hover:border-[#C8202B]'
                  }`}
                >
                  <Upload className={`w-6 h-6 mb-2 ${isUploadingImage ? 'animate-bounce text-[#C8202B]' : 'text-[#777777]'}`} />
                  <span className="text-xs font-heading uppercase font-semibold text-[#F5F4F2]">
                    {isUploadingImage ? 'Uploading image to storage...' : 'Upload Primary Product Image'}
                  </span>
                  <span className="text-[10px] font-mono text-[#666666] mt-0.5">
                    JPG, PNG, or WEBP • Max 5MB
                  </span>
                </div>
              )}

              <input
                ref={mainImageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleMainImageSelect}
                className="hidden"
              />
            </div>

            {/* Additional Image Gallery */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading uppercase font-bold text-[#A0A0A0]">
                  Additional Gallery Images
                </span>
                <button
                  type="button"
                  onClick={() => galleryImageInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-xs font-mono text-[#F5F4F2]"
                >
                  <Plus className="w-3 h-3 text-[#C8202B]" />
                  <span>Add Gallery Image</span>
                </button>
                <input
                  ref={galleryImageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleGalleryImageSelect}
                  className="hidden"
                />
              </div>

              {formData.images.length > 1 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.images.slice(1).map((imgUrl, idx) => (
                    <div 
                      key={idx}
                      className="relative h-24 bg-[#0E0E0E] border border-[#2B2B2B] flex items-center justify-center p-2 group"
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery ${idx + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageAt(idx + 1)}
                        className="absolute top-1 right-1 p-1 bg-black/80 text-[#C8202B] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-[#181818] border border-[#242424] text-[11px] font-mono text-[#666666]">
                  No additional gallery images attached. Primary visual will be used across all catalogue views.
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Product Variants */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <div>
                <h2 className="font-heading text-sm uppercase font-bold text-[#F5F4F2] tracking-wider">
                  3. Product Variants & Sizes
                </h2>
                <p className="text-xs text-[#8C8C8C] font-body mt-0.5">
                  Configure specific flavours, tub sizes, or package weights.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] hover:border-[#C8202B]/60 text-xs font-heading font-semibold uppercase tracking-wider text-[#F5F4F2] transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#C8202B]" />
                <span>Add Variant</span>
              </button>
            </div>

            {formData.variants.length === 0 ? (
              <div className="p-4 bg-[#181818] border border-[#242424] text-xs font-mono text-[#777777] text-center">
                No variants configured. Product will be listed under the master price and SKU.
              </div>
            ) : (
              <div className="space-y-3">
                {formData.variants.map((v, vIdx) => (
                  <div key={v.id || vIdx} className="p-4 bg-[#181818] border border-[#2A2A2A] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#C8202B]">
                        VARIANT #{vIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVariant(vIdx)}
                        className="text-xs font-mono text-[#8C8C8C] hover:text-[#C8202B] flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-[#8C8C8C] mb-1">
                          Size / Weight / Servings
                        </label>
                        <input
                          type="text"
                          value={v.size || v.name}
                          onChange={(e) => {
                            updateVariant(vIdx, 'size', e.target.value);
                            updateVariant(vIdx, 'name', e.target.value);
                          }}
                          placeholder="e.g. 1 kg or 30 Servings"
                          className="w-full bg-[#141414] border border-[#2E2E2E] focus:border-[#C8202B] px-3 py-1.5 text-xs text-[#F5F4F2]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase text-[#8C8C8C] mb-1">
                          Flavour (Optional)
                        </label>
                        <input
                          type="text"
                          value={v.flavour || ''}
                          onChange={(e) => updateVariant(vIdx, 'flavour', e.target.value)}
                          placeholder="e.g. Double Rich Chocolate"
                          className="w-full bg-[#141414] border border-[#2E2E2E] focus:border-[#C8202B] px-3 py-1.5 text-xs text-[#F5F4F2]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase text-[#8C8C8C] mb-1">
                          Variant SKU
                        </label>
                        <input
                          type="text"
                          value={v.sku || ''}
                          onChange={(e) => updateVariant(vIdx, 'sku', e.target.value.toUpperCase())}
                          placeholder="e.g. RK-PRO-1KG"
                          className="w-full bg-[#141414] border border-[#2E2E2E] focus:border-[#C8202B] px-3 py-1.5 text-xs font-mono text-[#F5F4F2]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-[#8C8C8C] mb-1">
                          Variant Price (₹)
                        </label>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => updateVariant(vIdx, 'price', Number(e.target.value))}
                          className="w-full bg-[#141414] border border-[#2E2E2E] focus:border-[#C8202B] px-3 py-1.5 text-xs font-mono text-[#F5F4F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-[#8C8C8C] mb-1">
                          Compare Price (₹)
                        </label>
                        <input
                          type="number"
                          value={v.salePrice || ''}
                          onChange={(e) => updateVariant(vIdx, 'salePrice', e.target.value ? Number(e.target.value) : null)}
                          placeholder="Optional"
                          className="w-full bg-[#141414] border border-[#2E2E2E] focus:border-[#C8202B] px-3 py-1.5 text-xs font-mono text-[#F5F4F2]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Verified Formulation & Nutrition Details */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-4">
            <div className="pb-3 border-b border-[#242424]">
              <h2 className="font-heading text-sm uppercase font-bold text-[#F5F4F2] tracking-wider">
                4. Verified Formulation & Nutritional Data
              </h2>
              <p className="text-xs text-[#8C8C8C] font-body mt-0.5">
                Accurate, transparent details for athlete nutrition facts. (Do not invent unverified claims).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Serving Information
                </label>
                <input
                  type="text"
                  value={formData.servingInfo}
                  onChange={(e) => setFormData({ ...formData, servingInfo: e.target.value })}
                  placeholder="e.g. Serving Size: 30g | Servings: 33"
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] focus:outline-none px-3.5 py-2 text-xs text-[#F5F4F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Allergen Information
                </label>
                <input
                  type="text"
                  value={formData.allergenInfo}
                  onChange={(e) => setFormData({ ...formData, allergenInfo: e.target.value })}
                  placeholder="e.g. Contains Milk (Whey). Soy-free."
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] focus:outline-none px-3.5 py-2 text-xs text-[#F5F4F2]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                Ingredients List
              </label>
              <textarea
                rows={2}
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                placeholder="Full verified ingredient disclosure..."
                className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] focus:outline-none p-3 text-xs text-[#F5F4F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                Macro & Nutrition Facts Breakdown
              </label>
              <textarea
                rows={2}
                value={formData.nutritionFacts}
                onChange={(e) => setFormData({ ...formData, nutritionFacts: e.target.value })}
                placeholder="e.g. Protein: 27g | Carbohydrates: 0.8g | Fat: 0.3g | BCAA: 6.2g"
                className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] focus:outline-none p-3 text-xs text-[#F5F4F2]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Usage Instructions
                </label>
                <textarea
                  rows={2}
                  value={formData.usageInstructions}
                  onChange={(e) => setFormData({ ...formData, usageInstructions: e.target.value })}
                  placeholder="Directions for preparation and timing..."
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] focus:outline-none p-3 text-xs text-[#F5F4F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Storage & Handling
                </label>
                <textarea
                  rows={2}
                  value={formData.storageInstructions}
                  onChange={(e) => setFormData({ ...formData, storageInstructions: e.target.value })}
                  placeholder="Temperature and moisture instructions..."
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] focus:outline-none p-3 text-xs text-[#F5F4F2]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Settings, Status, Visibility & Actions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status & Featured Settings */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-5">
            <h2 className="font-heading text-sm uppercase font-bold text-[#F5F4F2] tracking-wider pb-3 border-b border-[#242424]">
              Publishing & Visibility
            </h2>

            {/* Publication Status (Draft vs Published) */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                Publication Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'published' })}
                  className={`py-2 px-3 text-xs font-heading font-bold uppercase tracking-wider transition-colors border ${
                    formData.status === 'published'
                      ? 'bg-[#4CAF50]/15 border-[#4CAF50] text-[#4CAF50]'
                      : 'bg-[#181818] border-[#2E2E2E] text-[#8C8C8C] hover:text-[#F5F4F2]'
                  }`}
                >
                  Published
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'draft' })}
                  className={`py-2 px-3 text-xs font-heading font-bold uppercase tracking-wider transition-colors border ${
                    formData.status === 'draft'
                      ? 'bg-[#EAB308]/15 border-[#EAB308] text-[#EAB308]'
                      : 'bg-[#181818] border-[#2E2E2E] text-[#8C8C8C] hover:text-[#F5F4F2]'
                  }`}
                >
                  Draft
                </button>
              </div>
              <p className="text-[10px] font-mono text-[#666666] mt-1.5">
                {formData.status === 'published'
                  ? 'Active in catalog and category listings.'
                  : 'Hidden from public store. Only admins can see it.'}
              </p>
            </div>

            {/* Featured Product Toggle */}
            <div 
              onClick={() => setFormData({ ...formData, featured: !formData.featured })}
              className="flex items-center justify-between p-3.5 bg-[#181818] border border-[#262626] hover:border-[#383838] transition-colors cursor-pointer select-none"
            >
              <div>
                <div className="font-heading text-xs uppercase font-bold text-[#F5F4F2] flex items-center gap-1.5">
                  <Star className={`w-3.5 h-3.5 ${formData.featured ? 'fill-[#C8202B] text-[#C8202B]' : 'text-[#666666]'}`} />
                  <span>Featured Product</span>
                </div>
                <div className="text-[10px] text-[#777777] font-mono mt-0.5">
                  Showcase on homepage
                </div>
              </div>

              <div className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-colors ${
                formData.featured ? 'bg-[#C8202B]' : 'bg-[#2E2E2E]'
              }`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.featured ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
            </div>

            {/* Inventory / Availability */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                Inventory / Production Phase
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2]"
              >
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Promotional Badge / Tag */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                Promotional Badge
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. Best Seller, New Launch, 100% Pure"
                className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2]"
              />
            </div>
          </div>

          {/* Stock, Shipping & Payment Rules */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-4">
            <h2 className="font-heading text-sm uppercase font-bold text-[#F5F4F2] tracking-wider pb-3 border-b border-[#242424]">
              Inventory & Payment Rules
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1">
                  Stock Units
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] px-3 py-1.5 text-xs font-mono text-[#F5F4F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1">
                  Low Stock Alert
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] px-3 py-1.5 text-xs font-mono text-[#F5F4F2]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1">
                Shipping Weight (Kg)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.shippingWeightKg}
                onChange={(e) => setFormData({ ...formData, shippingWeightKg: parseFloat(e.target.value) || 1.0 })}
                className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] px-3 py-1.5 text-xs font-mono text-[#F5F4F2]"
              />
              <span className="text-[10px] font-mono text-[#666666] mt-0.5 block">Used for package weight and logistics calculations</span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1">
                Checkout Payment Rule
              </label>
              <select
                value={formData.paymentRule}
                onChange={(e) => setFormData({ ...formData, paymentRule: e.target.value })}
                className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2]"
              >
                <option value="ALL">ALL — Prepaid & Cash On Delivery Allowed</option>
                <option value="PREPAID_ONLY">PREPAID ONLY — Disables COD for this & mixed cart</option>
                <option value="COD_DISABLED">COD DISABLED — Prepaid Only</option>
                <option value="COD_ONLY">COD ONLY — Cash On Delivery Only</option>
              </select>
              <span className="text-[10px] font-mono text-[#8C8C8C] mt-1 block">
                {formData.paymentRule === 'PREPAID_ONLY' || formData.paymentRule === 'COD_DISABLED'
                  ? '⚠️ When added to any customer cart, Cash on Delivery will be blocked at checkout.'
                  : 'Eligible for all enabled payment methods.'}
              </span>
            </div>
          </div>

          {/* SEO & Search Engine Preview */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-4">
            <h2 className="font-heading text-sm uppercase font-bold text-[#F5F4F2] tracking-wider pb-3 border-b border-[#242424]">
              Search Engine (SEO) Preview
            </h2>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="defaults to product name"
                className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] px-3 py-1.5 text-xs text-[#F5F4F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1">
                SEO Meta Description
              </label>
              <textarea
                rows={2}
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="defaults to short description"
                className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8202B] p-2 text-xs text-[#F5F4F2]"
              />
            </div>

            {/* Snippet Preview */}
            <div className="p-3 bg-[#0E0E0E] border border-[#262626] text-[11px] font-mono space-y-1">
              <span className="text-[#4CAF50] block truncate">
                https://rknutrition.com/product/{formData.slug || 'slug'}
              </span>
              <span className="text-[#3B82F6] font-semibold block truncate">
                {formData.seoTitle || formData.name || 'Product Title'}
              </span>
              <p className="text-[#8C8C8C] text-[10px] line-clamp-2">
                {formData.seoDescription || formData.shortDescription || 'Verified athletic supplement from RK Nutrition.'}
              </p>
            </div>
          </div>

          {/* Save Action Box */}
          <div className="p-4 bg-[#141414] border border-[#242424] space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#C8202B] hover:bg-[#AC1721] text-[#F5F4F2] font-heading uppercase text-xs font-bold tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#C8202B]/20 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Publish Product'}</span>
            </button>

            <Link
              to="/admin/products"
              className="w-full py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2E2E2E] text-xs font-heading font-semibold uppercase tracking-wider text-[#A0A0A0] text-center block transition-colors"
            >
              Discard & Return
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
