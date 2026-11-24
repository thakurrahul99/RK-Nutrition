import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { useConfirmation } from '../../context/ConfirmationContext';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  AlertCircle, 
  X,
  RotateCcw,
  ExternalLink,
  Copy
} from 'lucide-react';

export default function AdminProductListPage() {
  const { products, deleteProduct, duplicateProduct, resetProductsToDefault } = useProducts();
  const { adminCategories } = useCategories();
  const { showToast } = useContent();
  const { logActivity } = useAuth();
  const { confirm } = useConfirmation();
  const [searchParams] = useSearchParams();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || 'all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFeatured, setSelectedFeatured] = useState('all');

  // Update selectedCategory if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Deletion Modal state
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered products list based on actual stored data
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        p.name.toLowerCase().includes(query) || 
        p.sku?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query);

      // Category filter (case-insensitive and supports slug or id)
      const matchesCategory = selectedCategory === 'all' || 
        p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        p.categoryId === selectedCategory;

      // Status filter
      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

      // Featured filter
      const matchesFeatured = selectedFeatured === 'all' || 
        (selectedFeatured === 'featured' && p.featured) ||
        (selectedFeatured === 'standard' && !p.featured);

      return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus, selectedFeatured]);

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);

    const result = await deleteProduct(productToDelete.id);
    if (result.success) {
      showToast(`Deleted "${productToDelete.name}" from catalog.`, 'info');
      logActivity(`Deleted product: ${productToDelete.name} (${productToDelete.sku || productToDelete.id})`, 'products');
      setProductToDelete(null);
    } else {
      showToast(result.error || 'Failed to delete product.', 'error');
    }
    setIsDeleting(false);
  };

  const handleDuplicateProduct = async (productId) => {
    const res = await duplicateProduct(productId);
    if (res.success && res.product) {
      showToast(`Duplicated product: ${res.product.name}`, 'success');
      logActivity(`Duplicated product to new SKU: ${res.product.sku}`, 'products');
    } else {
      showToast(res.error || 'Failed to duplicate product.', 'error');
    }
  };

  const handleResetCatalog = async () => {
    const confirmed = await confirm({
      title: 'Reset Product Catalog?',
      message: 'Are you sure you want to reset the catalog to the three verified foundational RK Nutrition products?',
      confirmText: 'Reset Catalog',
      cancelText: 'Cancel',
      variant: 'danger',
      icon: RotateCcw
    });
    if (confirmed) {
      resetProductsToDefault();
      showToast('Catalog restored to default foundational lineup.', 'info');
      logActivity('Restored foundational product catalog', 'products');
    }
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatCategory = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'protein': return 'Protein';
      case 'mass-gainer': return 'Mass Gainer';
      case 'pre-workout': return 'Pre-Workout';
      case 'creatine': return 'Creatine';
      default: {
        const found = adminCategories.find((c) => c.slug?.toLowerCase() === cat?.toLowerCase() || c.id === cat);
        return found ? found.name : (cat || 'Unassigned');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E11D2E]">
            <Package className="w-4 h-4" />
            <span>Catalog Management</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F5F4F2] tracking-tight mt-1">
            Products
          </h1>
          <p className="text-xs text-[#8C8C8C] mt-1 font-body">
            Manage your verified formulations, prices, inventory status, descriptions, and media assets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetCatalog}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-xs font-mono text-[#8C8C8C] hover:text-[#E11D2E] transition-colors"
            title="Reset to the 3 verified foundational products"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#E11D2E] hover:bg-[#AC1721] text-xs font-heading font-bold uppercase tracking-wider text-[#F5F4F2] transition-colors shadow-lg shadow-[#E11D2E]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Real Metric Highlights (Based on actual stored data) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-[#242424] p-4">
          <div className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider">Total Products</div>
          <div className="mt-1 font-heading font-bold text-2xl text-[#F5F4F2]">
            {products.length}
          </div>
          <div className="text-[10px] font-mono text-[#666666] mt-0.5">In local storage</div>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-4">
          <div className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider">Published</div>
          <div className="mt-1 font-heading font-bold text-2xl text-[#4CAF50]">
            {products.filter((p) => p.status === 'published').length}
          </div>
          <div className="text-[10px] font-mono text-[#666666] mt-0.5">Visible to customers</div>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-4">
          <div className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider">Drafts</div>
          <div className="mt-1 font-heading font-bold text-2xl text-[#EAB308]">
            {products.filter((p) => p.status === 'draft').length}
          </div>
          <div className="text-[10px] font-mono text-[#666666] mt-0.5">Hidden from store</div>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-4">
          <div className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider">Featured</div>
          <div className="mt-1 font-heading font-bold text-2xl text-[#E11D2E]">
            {products.filter((p) => p.featured).length}
          </div>
          <div className="text-[10px] font-mono text-[#666666] mt-0.5">Homepage showcase</div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-[#141414] border border-[#242424] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, SKU, or category..."
            className="w-full bg-[#181818] border border-[#2B2B2B] focus:border-[#E11D2E] focus:outline-none pl-9 pr-3 py-2 text-xs text-[#F5F4F2] placeholder-[#555555]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#A0A0A0]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#181818] border border-[#2B2B2B] focus:border-[#E11D2E] focus:outline-none px-3 py-2 text-xs text-[#F5F4F2]"
          >
            <option value="all">All Categories</option>
            {adminCategories.map((c) => (
              <option key={c.id || c.slug} value={c.slug || c.id}>
                {c.name} {c.isActive === false ? '(Inactive)' : ''}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#181818] border border-[#2B2B2B] focus:border-[#E11D2E] focus:outline-none px-3 py-2 text-xs text-[#F5F4F2]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Featured Filter */}
          <select
            value={selectedFeatured}
            onChange={(e) => setSelectedFeatured(e.target.value)}
            className="bg-[#181818] border border-[#2B2B2B] focus:border-[#E11D2E] focus:outline-none px-3 py-2 text-xs text-[#F5F4F2]"
          >
            <option value="all">All Items</option>
            <option value="featured">Featured Only</option>
            <option value="standard">Standard Only</option>
          </select>

          {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedFeatured !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSelectedFeatured('all');
              }}
              className="text-xs font-mono text-[#E11D2E] hover:text-[#F5F4F2] underline underline-offset-4 px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Table (Desktop) / Cards (Mobile) */}
      <div className="bg-[#141414] border border-[#242424] overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-4">
            <div className="w-12 h-12 bg-[#1C1C1C] border border-[#2A2A2A] mx-auto flex items-center justify-center text-[#666666]">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold uppercase text-[#F5F4F2]">
                No Products Found
              </h3>
              <p className="text-xs text-[#8C8C8C] max-w-sm mx-auto mt-1 font-body">
                {products.length === 0
                  ? 'Your catalogue is currently empty. Add your first athletic formulation to begin.'
                  : 'No products match the selected filters or search terms.'}
              </p>
            </div>
            {products.length === 0 ? (
              <div className="flex items-center justify-center gap-3 pt-2">
                <Link
                  to="/admin/products/new"
                  className="px-4 py-2 bg-[#E11D2E] text-xs font-heading font-bold uppercase tracking-wider text-[#F5F4F2]"
                >
                  Create Product
                </Link>
                <button
                  type="button"
                  onClick={handleResetCatalog}
                  className="px-4 py-2 bg-[#1C1C1C] border border-[#2D2D2D] text-xs font-heading font-semibold uppercase tracking-wider text-[#A0A0A0]"
                >
                  Restore 3 Foundational Products
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                  setSelectedFeatured('all');
                }}
                className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#242424] border border-[#2E2E2E] text-xs font-heading font-semibold uppercase tracking-wider text-[#F5F4F2]"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#242424] bg-[#111111] text-[11px] font-mono uppercase tracking-wider text-[#8C8C8C]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Payment Rule</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020] text-xs font-body">
                {filteredProducts.map((product) => {
                  const hasMainImage = Array.isArray(product.images) && product.images.length > 0;
                  const mainImageSrc = hasMainImage ? product.images[0] : null;

                  return (
                    <tr 
                      key={product.id}
                      className="hover:bg-[#181818]/70 transition-colors group"
                    >
                      {/* Product Thumbnail + Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {/* Image or Athletic Monogram Placeholder */}
                          <div className="w-11 h-11 bg-[#181818] border border-[#282828] shrink-0 flex items-center justify-center overflow-hidden relative">
                            {mainImageSrc ? (
                              <img
                                src={mainImageSrc}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="font-heading font-black text-xs text-[#555555]">
                                RK
                              </span>
                            )}
                            {product.featured && (
                              <div className="absolute top-0 right-0 w-2 h-2 bg-[#E11D2E]" title="Featured Product" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <Link
                              to={`/admin/products/${product.id}/edit`}
                              className="font-heading font-bold text-sm text-[#F5F4F2] hover:text-[#E11D2E] uppercase tracking-wide truncate block transition-colors"
                            >
                              {product.name}
                            </Link>
                            <span className="text-[11px] font-mono text-[#777777] truncate block">
                              slug: {product.slug || product.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 bg-[#1C1C1C] border border-[#2B2B2B] text-[10px] font-mono uppercase tracking-wider text-[#A0A0A0]">
                          {formatCategory(product.category)}
                        </span>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-[#8C8C8C]">
                        {product.sku || '—'}
                      </td>

                      {/* Stock Level */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className={`font-bold ${
                            Number(product.stock) <= (product.lowStockThreshold || 10)
                              ? 'text-[#E11D2E]'
                              : 'text-[#4CAF50]'
                          }`}>
                            {product.stock ?? 40}
                          </span>
                          <span className="text-[#666666] text-[10px]">units</span>
                        </div>
                      </td>

                      {/* Payment Rule */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 border text-[10px] font-mono uppercase ${
                          product.paymentRule === 'PREPAID_ONLY' || product.paymentRule === 'COD_DISABLED'
                            ? 'bg-[#E11D2E]/10 border-[#E11D2E]/30 text-[#E11D2E]'
                            : 'bg-[#1C1C1C] border-[#2D2D2D] text-[#8C8C8C]'
                        }`}>
                          {product.paymentRule || 'ALL'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        {product.salePrice ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[#F5F4F2] font-semibold">{formatPrice(product.salePrice)}</span>
                            <span className="text-[#666666] line-through text-[11px]">{formatPrice(product.price)}</span>
                          </div>
                        ) : (
                          <span className="text-[#F5F4F2]">{formatPrice(product.price)}</span>
                        )}
                        {Array.isArray(product.variants) && product.variants.length > 0 && (
                          <span className="text-[10px] text-[#666666] block font-mono">
                            {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {product.status === 'published' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#4CAF50] text-[10px] font-mono uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#EAB308]/10 border border-[#EAB308]/20 text-[#EAB308] text-[10px] font-mono uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Featured */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {product.featured ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#E11D2E] font-bold">
                            <Star className="w-3.5 h-3.5 fill-[#E11D2E]" />
                            <span className="hidden sm:inline">Yes</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-[#555555]">No</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Duplicate Product */}
                          <button
                            type="button"
                            onClick={() => handleDuplicateProduct(product.id)}
                            className="p-1.5 text-[#8C8C8C] hover:text-[#38BDF8] hover:bg-[#202020] transition-colors"
                            title="Duplicate Product (Clone with new SKU)"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* View on Public Store (if published) */}
                          {product.status === 'published' && (
                            <Link
                              to={`/product/${product.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#202020] transition-colors"
                              title="View on public store"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}

                          {/* Edit */}
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="p-1.5 text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#202020] transition-colors"
                            title="Edit product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 text-[#8C8C8C] hover:text-[#E11D2E] hover:bg-[#202020] transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer info */}
        <div className="p-3 bg-[#111111] border-t border-[#242424] flex items-center justify-between text-[11px] font-mono text-[#777777]">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          <span>Draft items are hidden from public shop</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-[#161616] border border-[#2B2B2B] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E11D2E]">
                <AlertCircle className="w-4 h-4" />
                <span>Confirm Product Deletion</span>
              </div>
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="text-[#8C8C8C] hover:text-[#F5F4F2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 space-y-3">
              <p className="text-sm text-[#F5F4F2] font-heading uppercase font-bold">
                Delete "{productToDelete.name}"?
              </p>
              <p className="text-xs text-[#8C8C8C] leading-relaxed font-body">
                This action permanently removes the formulation record from your catalogue and disconnects it from all public category listings.
              </p>
              <div className="p-3 bg-[#111111] border border-[#242424] text-[11px] font-mono text-[#777777] space-y-0.5">
                <div>SKU: {productToDelete.sku || 'N/A'}</div>
                <div>Category: {formatCategory(productToDelete.category)}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262626]">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 bg-[#202020] hover:bg-[#282828] text-xs font-heading font-semibold uppercase tracking-wider text-[#A0A0A0] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-[#E11D2E] hover:bg-[#AC1721] text-xs font-heading font-bold uppercase tracking-wider text-[#F5F4F2] transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
