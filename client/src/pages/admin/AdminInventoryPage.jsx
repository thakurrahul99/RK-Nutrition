import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Boxes, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Save, 
  Plus, 
  Minus, 
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

export default function AdminInventoryPage() {
  const { products, updateProduct, refreshProducts, isLoading } = useProducts();
  const { showToast } = useContent();
  const { logActivity } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, low, out, healthy
  const [localStockEdits, setLocalStockEdits] = useState({});
  const [isSavingId, setIsSavingId] = useState(null);

  // Compute metrics
  const totalUnits = useMemo(() => {
    return products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  }, [products]);

  const lowStockItems = useMemo(() => {
    return products.filter((p) => {
      const stock = Number(p.stock) || 0;
      const threshold = Number(p.lowStockThreshold) || 10;
      return stock > 0 && stock <= threshold;
    });
  }, [products]);

  const outOfStockItems = useMemo(() => {
    return products.filter((p) => (Number(p.stock) || 0) <= 0);
  }, [products]);

  // Filtered rows
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        p.name.toLowerCase().includes(q) || 
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);

      const stock = Number(p.stock) || 0;
      const threshold = Number(p.lowStockThreshold) || 10;

      let matchesStatus = true;
      if (filterStatus === 'low') matchesStatus = stock > 0 && stock <= threshold;
      else if (filterStatus === 'out') matchesStatus = stock <= 0;
      else if (filterStatus === 'healthy') matchesStatus = stock > threshold;

      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, filterStatus]);

  // Handle local adjustment
  const handleStockChange = (productId, newStock) => {
    const valid = Math.max(0, parseInt(newStock, 10) || 0);
    setLocalStockEdits((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        stock: valid
      }
    }));
  };

  const handleThresholdChange = (productId, newThreshold) => {
    const valid = Math.max(1, parseInt(newThreshold, 10) || 1);
    setLocalStockEdits((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        threshold: valid
      }
    }));
  };

  const handleQuickStep = (productId, currentStock, delta) => {
    const currentVal = localStockEdits[productId]?.stock ?? currentStock ?? 0;
    const newVal = Math.max(0, currentVal + delta);
    handleStockChange(productId, newVal);
  };

  const handleSaveStock = async (product) => {
    const edit = localStockEdits[product.id];
    if (!edit) return;

    setIsSavingId(product.id);
    const updates = {};
    if (edit.stock !== undefined) updates.stock = edit.stock;
    if (edit.threshold !== undefined) updates.lowStockThreshold = edit.threshold;

    const res = await updateProduct(product.id, updates);
    if (res.success) {
      showToast(`Stock for "${product.name}" updated successfully.`, 'success');
      logActivity(`Updated stock for ${product.name} to ${edit.stock ?? product.stock} units`, 'inventory');
      setLocalStockEdits((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    } else {
      showToast(res.error || 'Failed to update stock.', 'error');
    }
    setIsSavingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C8202B]">
            <Boxes className="w-4 h-4" />
            <span>Warehouse Operations</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F5F4F2] tracking-tight mt-1">
            Inventory & Stock Matrix
          </h1>
          <p className="text-xs text-[#8C8C8C] mt-1 font-body">
            Real-time stock monitoring, automated threshold notifications, and rapid restock adjustment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refreshProducts()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-xs font-mono text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-[#242424] p-4">
          <span className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider block">Total Units</span>
          <span className="font-heading font-black text-2xl text-[#F5F4F2] block mt-1">{totalUnits}</span>
          <span className="text-[10px] font-mono text-[#666666]">In active warehouse</span>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-4">
          <span className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider block">Healthy Stock</span>
          <span className="font-heading font-black text-2xl text-[#4CAF50] block mt-1">
            {products.length - lowStockItems.length - outOfStockItems.length}
          </span>
          <span className="text-[10px] font-mono text-[#666666]">Above alert threshold</span>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-4">
          <span className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider block">Low Stock Alerts</span>
          <span className="font-heading font-black text-2xl text-[#EAB308] block mt-1">
            {lowStockItems.length}
          </span>
          <span className="text-[10px] font-mono text-[#666666]">Needs restock order</span>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-4">
          <span className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider block">Out of Stock</span>
          <span className="font-heading font-black text-2xl text-[#C8202B] block mt-1">
            {outOfStockItems.length}
          </span>
          <span className="text-[10px] font-mono text-[#666666]">0 inventory units</span>
        </div>
      </div>

      {/* Low Stock Urgent Notice */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-[#C8202B]/10 border border-[#C8202B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#C8202B] shrink-0" />
            <div>
              <span className="font-bold text-[#F5F4F2] uppercase font-heading block">
                Restock Alert Triggered ({lowStockItems.length} items)
              </span>
              <span className="text-[#A0A0A0] font-body">
                The following formulations are nearing depletion: {lowStockItems.map((p) => `${p.name} (${p.stock} left)`).join(', ')}.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFilterStatus('low')}
            className="px-3 py-1.5 bg-[#C8202B] hover:bg-[#AC1721] text-[#F5F4F2] font-mono uppercase text-[11px] shrink-0"
          >
            Show Low Stock Only
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, SKU, or category..."
            className="w-full bg-[#141414] border border-[#242424] focus:border-[#C8202B] focus:outline-none pl-9 pr-4 py-2 text-xs text-[#F5F4F2] placeholder-[#555555]"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Products' },
            { id: 'low', label: `Low Stock (${lowStockItems.length})` },
            { id: 'out', label: `Out of Stock (${outOfStockItems.length})` },
            { id: 'healthy', label: 'Healthy' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors whitespace-nowrap border ${
                filterStatus === tab.id
                  ? 'bg-[#C8202B] border-[#C8202B] text-[#F5F4F2] font-bold'
                  : 'bg-[#141414] border-[#242424] text-[#8C8C8C] hover:text-[#F5F4F2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#141414] border border-[#242424] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#242424] bg-[#111111] text-[#8C8C8C] font-mono uppercase text-[11px] tracking-wider">
              <th className="py-3 px-4">Product & SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Low Stock Alert Level</th>
              <th className="py-3 px-4 text-center">Current Stock</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202020]">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-[#666666] font-mono">
                  No inventory items matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const currentStock = Number(p.stock) || 0;
                const currentThreshold = Number(p.lowStockThreshold) || 10;
                const editedStock = localStockEdits[p.id]?.stock;
                const editedThreshold = localStockEdits[p.id]?.threshold;
                const activeStock = editedStock !== undefined ? editedStock : currentStock;
                const activeThreshold = editedThreshold !== undefined ? editedThreshold : currentThreshold;
                const hasUnsavedChanges = editedStock !== undefined || editedThreshold !== undefined;

                let statusBadge;
                if (activeStock <= 0) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#C8202B]/10 border border-[#C8202B]/30 text-[#C8202B] font-mono text-[10px] uppercase font-bold">
                      <XCircle className="w-3 h-3" />
                      <span>Out of Stock</span>
                    </span>
                  );
                } else if (activeStock <= activeThreshold) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EAB308]/10 border border-[#EAB308]/30 text-[#EAB308] font-mono text-[10px] uppercase font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Low Stock</span>
                    </span>
                  );
                } else {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#4CAF50]/10 border border-[#4CAF50]/30 text-[#4CAF50] font-mono text-[10px] uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>In Stock</span>
                    </span>
                  );
                }

                return (
                  <tr key={p.id} className="hover:bg-[#181818] transition-colors">
                    {/* Product Name & SKU */}
                    <td className="py-3 px-4">
                      <div className="font-heading font-bold uppercase text-[#F5F4F2] text-sm flex items-center gap-2">
                        <span>{p.name}</span>
                        <Link 
                          to={`/admin/products/${p.id}/edit`}
                          className="text-[#666666] hover:text-[#C8202B]" 
                          title="Edit Full Product Profile"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                      <div className="font-mono text-[#8C8C8C] text-[10px] tracking-wider mt-0.5">
                        SKU: {p.sku || 'N/A'} • Slug: {p.slug || p.id}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 font-mono text-[#A0A0A0] uppercase text-[11px]">
                      {p.category}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {statusBadge}
                    </td>

                    {/* Threshold Input */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="999"
                          value={activeThreshold}
                          onChange={(e) => handleThresholdChange(p.id, e.target.value)}
                          className="w-16 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-2 py-1 text-center font-mono text-xs text-[#F5F4F2] focus:outline-none"
                        />
                        <span className="font-mono text-[#666666] text-[10px]">units</span>
                      </div>
                    </td>

                    {/* Stock modifier controls */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickStep(p.id, currentStock, -5)}
                          className="w-7 h-7 bg-[#1C1C1C] hover:bg-[#282828] border border-[#2D2D2D] text-[#8C8C8C] hover:text-[#F5F4F2] text-xs font-mono font-bold flex items-center justify-center"
                          title="-5 units"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStep(p.id, currentStock, -1)}
                          className="w-7 h-7 bg-[#1C1C1C] hover:bg-[#282828] border border-[#2D2D2D] text-[#8C8C8C] hover:text-[#F5F4F2] text-xs font-mono flex items-center justify-center"
                          title="-1 unit"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={activeStock}
                          onChange={(e) => handleStockChange(p.id, e.target.value)}
                          className={`w-20 bg-[#181818] border ${hasUnsavedChanges ? 'border-[#C8202B] text-[#C8202B] font-bold' : 'border-[#2C2C2C] text-[#F5F4F2]'} px-2 py-1 text-center font-mono text-sm focus:border-[#C8202B] focus:outline-none`}
                        />

                        <button
                          type="button"
                          onClick={() => handleQuickStep(p.id, currentStock, 1)}
                          className="w-7 h-7 bg-[#1C1C1C] hover:bg-[#282828] border border-[#2D2D2D] text-[#8C8C8C] hover:text-[#F5F4F2] text-xs font-mono flex items-center justify-center"
                          title="+1 unit"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStep(p.id, currentStock, 5)}
                          className="w-7 h-7 bg-[#1C1C1C] hover:bg-[#282828] border border-[#2D2D2D] text-[#8C8C8C] hover:text-[#F5F4F2] text-xs font-mono font-bold flex items-center justify-center"
                          title="+5 units"
                        >
                          +5
                        </button>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      {hasUnsavedChanges ? (
                        <button
                          type="button"
                          disabled={isSavingId === p.id}
                          onClick={() => handleSaveStock(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C8202B] hover:bg-[#AC1721] text-xs font-heading uppercase tracking-wider text-[#F5F4F2] font-bold transition-colors"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{isSavingId === p.id ? 'Saving...' : 'Save'}</span>
                        </button>
                      ) : (
                        <span className="font-mono text-[#555555] text-[11px]">Synced</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
