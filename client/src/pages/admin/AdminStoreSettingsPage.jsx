import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Sliders, 
  Truck, 
  ShieldCheck, 
  Mail, 
  Save, 
  RefreshCw 
} from 'lucide-react';

export default function AdminStoreSettingsPage() {
  const { showToast } = useContent();
  const { logActivity } = useAuth();

  const [settings, setSettings] = useState({
    shippingFee: 99,
    freeShippingThreshold: 1999,
    dispatchHours: '24-48 Hours',
    deliveryDays: '3-5 Business Days',
    taxPercent: 18,
    gstin: '07AABCR1234F1Z5',
    fssaiLicense: '10020011000123',
    supportEmail: 'support@rknutrition.com',
    supportPhone: '+91 98765 43210',
    warehouseAddress: 'Plot 42, Industrial Zone, New Delhi, 110020, India',
    businessHours: 'Mon - Sat: 9:00 AM - 7:00 PM IST'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      const res = await apiRequest('/store/settings');
      if (res.success && res.settings) {
        setSettings((prev) => ({ ...prev, ...res.settings }));
      }
      setIsLoading(false);
    }
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await apiRequest('/store/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });

    if (res.success && res.settings) {
      setSettings(res.settings);
      showToast('Store settings saved successfully.', 'success');
      logActivity('Updated store shipping thresholds, tax rates, and logistics settings', 'settings');
    } else {
      showToast(res.error || 'Failed to update store settings.', 'error');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center font-mono text-xs text-[#8C8C8C] flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-[#C8202B]" />
        <span>Loading Store Configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C8202B]">
            <Sliders className="w-4 h-4" />
            <span>Store Operations</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F5F4F2] tracking-tight mt-1">
            Store Logistics & Fulfillment Settings
          </h1>
          <p className="text-xs text-[#8C8C8C] mt-1 font-body">
            Manage shipping delivery fees, free-shipping threshold rules, GST compliance, and public business contact information.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8202B] hover:bg-[#AC1721] text-xs font-heading font-bold uppercase tracking-wider text-[#F5F4F2] transition-colors shadow-lg shadow-[#C8202B]/20"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Shipping & Delivery Rules */}
        <div className="p-6 bg-[#141414] border border-[#242424] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C8202B] font-bold pb-3 border-b border-[#202020]">
            <Truck className="w-4 h-4" />
            <span>Shipping & Order Delivery Logistics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.shippingFee}
                onChange={(e) => handleChange('shippingFee', Number(e.target.value))}
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] font-mono focus:outline-none"
              />
              <span className="text-[10px] text-[#666666] font-mono mt-0.5 block">Applied when order total is below free shipping threshold</span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1">
                Free Shipping Order Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] font-mono focus:outline-none"
              />
              <span className="text-[10px] text-[#666666] font-mono mt-0.5 block">Orders at or above this cart value ship with 0 shipping charge</span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1">
                Estimated Dispatch Time
              </label>
              <input
                type="text"
                value={settings.dispatchHours || ''}
                onChange={(e) => handleChange('dispatchHours', e.target.value)}
                placeholder="e.g. 24-48 Hours"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1">
                Estimated Delivery Window
              </label>
              <input
                type="text"
                value={settings.deliveryDays || ''}
                onChange={(e) => handleChange('deliveryDays', e.target.value)}
                placeholder="e.g. 3-5 Business Days"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Legal & Taxation Compliance */}
        <div className="p-6 bg-[#141414] border border-[#242424] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C8202B] font-bold pb-3 border-b border-[#202020]">
            <ShieldCheck className="w-4 h-4" />
            <span>Taxation & Regulatory Verification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1">
                Standard GST Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="28"
                value={settings.taxPercent}
                onChange={(e) => handleChange('taxPercent', Number(e.target.value))}
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1">
                GSTIN Registration Number
              </label>
              <input
                type="text"
                value={settings.gstin || ''}
                onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
                placeholder="07AABCR1234F1Z5"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] font-mono focus:outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1">
                FSSAI License Number
              </label>
              <input
                type="text"
                value={settings.fssaiLicense || ''}
                onChange={(e) => handleChange('fssaiLicense', e.target.value)}
                placeholder="10020011000123"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Business Contact & Support Desk */}
        <div className="p-6 bg-[#141414] border border-[#242424] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C8202B] font-bold pb-3 border-b border-[#202020]">
            <Mail className="w-4 h-4" />
            <span>Store Contact & Warehouse Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail || ''}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                placeholder="support@rknutrition.com"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1">
                Support Phone Number
              </label>
              <input
                type="text"
                value={settings.supportPhone || ''}
                onChange={(e) => handleChange('supportPhone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1">
                Warehouse Dispatch Address
              </label>
              <input
                type="text"
                value={settings.warehouseAddress || ''}
                onChange={(e) => handleChange('warehouseAddress', e.target.value)}
                placeholder="Physical warehouse location"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={settings.businessHours || ''}
                onChange={(e) => handleChange('businessHours', e.target.value)}
                placeholder="e.g. Mon - Sat: 9:00 AM - 7:00 PM IST"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#C8202B] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
