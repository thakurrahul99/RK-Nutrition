import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Edit3,
  X,
  RefreshCw, 
  AlertCircle,
  Copy
} from 'lucide-react';

export default function AdminDiscountsPage() {
  const { showToast } = useContent();
  const { logActivity } = useAuth();

  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage', // percentage or fixed
    discountValue: '',
    minCartValue: '',
    maxUses: 100,
    expiryDate: '2027-12-31',
    description: '',
    isActive: true
  });

  const fetchCoupons = async () => {
    setIsLoading(true);
    const res = await apiRequest('/discounts');
    if (res.success && Array.isArray(res.coupons)) {
      setCoupons(res.coupons);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggleActive = async (coupon) => {
    const updatedStatus = !coupon.isActive;
    const res = await apiRequest(`/discounts/${coupon.id}`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: updatedStatus })
    });

    if (res.success && res.coupon) {
      setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? res.coupon : c)));
      showToast(`Coupon ${coupon.code} marked ${updatedStatus ? 'Active' : 'Inactive'}.`, 'info');
      logActivity(`Toggled coupon ${coupon.code} status to ${updatedStatus ? 'active' : 'inactive'}`, 'discounts');
    }
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Delete coupon "${coupon.code}" permanently?`)) return;

    const res = await apiRequest(`/discounts/${coupon.id}`, {
      method: 'DELETE'
    });

    if (res.success) {
      setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
      showToast(`Coupon ${coupon.code} removed.`, 'info');
      logActivity(`Deleted coupon code ${coupon.code}`, 'discounts');
    } else {
      showToast(res.error || 'Failed to delete coupon.', 'error');
    }
  };

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setNewCoupon({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minCartValue: '',
      maxUses: 100,
      expiryDate: '2027-12-31',
      description: '',
      isActive: true
    });
    setFormError('');
    setShowCreateModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCoupon(c);
    setNewCoupon({
      code: c.code,
      discountType: c.discountType || 'percentage',
      discountValue: c.discountValue,
      minCartValue: c.minCartValue || '',
      maxUses: c.maxUses || 100,
      expiryDate: c.expiryDate || '2027-12-31',
      description: c.description || '',
      isActive: c.isActive !== false
    });
    setFormError('');
    setShowCreateModal(true);
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!newCoupon.code.trim()) {
      setFormError('Coupon code is required.');
      return;
    }

    const val = Number(newCoupon.discountValue);
    if (isNaN(val) || val <= 0) {
      setFormError('Discount value must be a valid positive number.');
      return;
    }

    if (newCoupon.discountType === 'percentage' && (val < 1 || val > 90)) {
      setFormError('Percentage discount must be between 1% and 90%.');
      return;
    }

    setIsSubmitting(true);
    let res;
    if (editingCoupon) {
      res = await apiRequest(`/discounts/${editingCoupon.id}`, {
        method: 'PUT',
        body: JSON.stringify(newCoupon)
      });
      if (res.success && res.coupon) {
        setCoupons(coupons.map((c) => (c.id === editingCoupon.id ? res.coupon : c)));
        showToast(`Coupon "${res.coupon.code}" updated successfully.`, 'success');
        logActivity(`Updated promotional coupon: ${res.coupon.code}`, 'discounts');
        setShowCreateModal(false);
        setEditingCoupon(null);
      } else {
        setFormError(res.error || 'Failed to update coupon code.');
      }
    } else {
      res = await apiRequest('/discounts', {
        method: 'POST',
        body: JSON.stringify(newCoupon)
      });
      if (res.success && res.coupon) {
        setCoupons([res.coupon, ...coupons]);
        showToast(`Coupon "${res.coupon.code}" created successfully.`, 'success');
        logActivity(`Created new promotional coupon: ${res.coupon.code}`, 'discounts');
        setShowCreateModal(false);
        setNewCoupon({
          code: '',
          discountType: 'percentage',
          discountValue: '',
          minCartValue: '',
          maxUses: 100,
          expiryDate: '2027-12-31',
          description: '',
          isActive: true
        });
      } else {
        setFormError(res.error || 'Failed to create coupon code.');
      }
    }
    setIsSubmitting(false);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Coupon "${code}" copied to clipboard!`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C8202B]">
            <Tag className="w-4 h-4" />
            <span>Store Marketing</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F5F4F2] tracking-tight mt-1">
            Offers & Coupon Codes
          </h1>
          <p className="text-xs text-[#8C8C8C] mt-1 font-body">
            Create promotional discounts, set minimum cart eligibility thresholds, and limit redemptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchCoupons}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-xs font-mono text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8202B] hover:bg-[#AC1721] text-xs font-heading font-bold uppercase tracking-wider text-[#F5F4F2] transition-colors shadow-lg shadow-[#C8202B]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Coupons List Table */}
      <div className="bg-[#141414] border border-[#242424] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#242424] bg-[#111111] text-[#8C8C8C] font-mono uppercase text-[11px] tracking-wider">
              <th className="py-3 px-4">Coupon Code</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Min. Cart Value</th>
              <th className="py-3 px-4">Usage Limit</th>
              <th className="py-3 px-4">Expires On</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202020]">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[#666666] font-mono">
                  No discount coupons configured. Click "Create Coupon" to add promotional codes.
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#181818] transition-colors">
                  {/* Code */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#F5F4F2] tracking-wider bg-[#1B1B1B] border border-[#2B2B2B] px-2 py-0.5">
                        {c.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(c.code)}
                        className="text-[#666666] hover:text-[#C8202B] p-1"
                        title="Copy code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {c.description && (
                      <p className="text-[10px] text-[#8C8C8C] mt-1 font-body">{c.description}</p>
                    )}
                  </td>

                  {/* Discount */}
                  <td className="py-3 px-4 font-mono font-bold text-xs text-[#4CAF50]">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                  </td>

                  {/* Min Cart */}
                  <td className="py-3 px-4 font-mono text-xs text-[#F5F4F2]">
                    {c.minCartValue > 0 ? `₹${c.minCartValue}` : 'None'}
                  </td>

                  {/* Usage */}
                  <td className="py-3 px-4 font-mono text-xs text-[#A0A0A0]">
                    {c.usedCount || 0} / {c.maxUses || 'Unlimited'}
                  </td>

                  {/* Expiry */}
                  <td className="py-3 px-4 font-mono text-xs text-[#8C8C8C]">
                    {c.expiryDate}
                  </td>

                  {/* Active Toggle */}
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(c)}
                      className={`px-2 py-0.5 border text-[10px] font-mono uppercase font-bold transition-colors ${
                        c.isActive
                          ? 'bg-[#4CAF50]/10 border-[#4CAF50]/30 text-[#4CAF50]'
                          : 'bg-[#666666]/10 border-[#666666]/30 text-[#888888]'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-[#666666] hover:text-[#38BDF8] hover:bg-[#1E1E1E] transition-colors"
                        title="Edit Coupon"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className="p-1.5 text-[#666666] hover:text-[#C8202B] hover:bg-[#1E1E1E] transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-[#141414] border border-[#2E2E2E] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C8202B]">
                <Tag className="w-4 h-4" />
                <span>{editingCoupon ? 'Update Promotion' : 'New Promotion'}</span>
              </div>
              <button
                type="button"
                onClick={() => { setShowCreateModal(false); setEditingCoupon(null); }}
                className="p-1 text-[#8C8C8C] hover:text-[#F5F4F2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-[#C8202B]/10 border border-[#C8202B]/30 text-xs text-[#F5F4F2] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#C8202B] shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCoupon} className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#A0A0A0] mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. RKPOWER15"
                  className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] font-mono uppercase focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#A0A0A0] mb-1">
                    Discount Type
                  </label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed INR (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#A0A0A0] mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                    placeholder={newCoupon.discountType === 'percentage' ? 'e.g. 15' : 'e.g. 200'}
                    className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#A0A0A0] mb-1">
                    Min Cart Order (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCoupon.minCartValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minCartValue: e.target.value })}
                    placeholder="e.g. 1500"
                    className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#A0A0A0] mb-1">
                    Max Redemptions
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCoupon.maxUses}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#A0A0A0] mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={newCoupon.expiryDate}
                  onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#A0A0A0] mb-1">
                  Internal Description / Campaign Notes
                </label>
                <input
                  type="text"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  placeholder="e.g. Athlete launch promotion"
                  className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setEditingCoupon(null); }}
                  className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#252525] text-xs font-mono text-[#8C8C8C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#C8202B] hover:bg-[#AC1721] text-xs font-heading font-bold uppercase tracking-wider text-[#F5F4F2]"
                >
                  {isSubmitting ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
