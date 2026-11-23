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
  RefreshCw,
  Megaphone,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AdminStoreSettingsPage() {
  const { showToast, refreshContent } = useContent();
  const { logActivity } = useAuth();

  const [settings, setSettings] = useState({
    shippingFee: 99,
    freeShippingThreshold: 1999,
    dispatchHours: '24-48 Hours',
    deliveryDays: '3-5 Business Days',
    taxPercent: 18,
    gstin: '07AABCR1234F1Z5',
    fssaiLicense: '10020011000123',
    supportEmail: 'Kuldeeprajput5262@gmail.com',
    supportPhone: '+91 86306 63134',
    secondaryPhone: '+91 74520 13333',
    warehouseAddress: 'A12–16, Main Patpad Ganj Industrial Area, Delhi – 110092, India',
    businessHours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
    announcement: {
      enabled: true,
      text: 'OFFICIAL LAUNCH • 10% OFF ORDERS ABOVE ₹1,999 WITH CODE RK10 • FREE NATIONWIDE SHIPPING',
      linkText: 'SHOP NOW',
      linkHref: '/products'
    }
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

  const handleAnnouncementChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      announcement: {
        ...(prev.announcement || {}),
        [field]: value
      }
    }));
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
      logActivity('Updated store announcement banner, shipping thresholds, and store configuration', 'settings');
      if (typeof refreshContent === 'function') {
        refreshContent();
      }
    } else {
      showToast(res.error || 'Failed to update store settings.', 'error');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center font-mono text-xs text-[#8C8C8C] flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-[#E11D2E]" />
        <span>Loading Store Configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E11D2E]">
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
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#E11D2E] hover:bg-[#AC1721] text-xs font-heading font-bold uppercase tracking-wider text-[#F5F4F2] transition-colors shadow-lg shadow-[#E11D2E]/20"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Storefront Announcement Banner Control */}
        <div className="p-4 sm:p-6 bg-[#141414] border border-[#242424] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#202020] gap-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#E11D2E] font-bold">
              <Megaphone className="w-4 h-4" />
              <span>Storefront Announcement Banner (Top Bar)</span>
            </div>

            <button
              type="button"
              onClick={() => handleAnnouncementChange('enabled', !settings.announcement?.enabled)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase font-bold border transition-colors cursor-pointer ${
                settings.announcement?.enabled
                  ? 'bg-[#10B981]/15 border-[#10B981] text-[#10B981]'
                  : 'bg-[#64748B]/15 border-[#64748B] text-[#8C8C8C]'
              }`}
            >
              {settings.announcement?.enabled ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Banner Active (Visible)</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Banner Disabled (Hidden)</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-[#8C8C8C]">
            Pinned at the very top of all customer-facing store pages. Use it for urgent notices, site-wide discounts, or promotion codes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1">
                Announcement Message Text
              </label>
              <input
                type="text"
                value={settings.announcement?.text || ''}
                onChange={(e) => handleAnnouncementChange('text', e.target.value)}
                placeholder="e.g. OFFICIAL LAUNCH • 10% OFF ORDERS ABOVE ₹1,999 WITH CODE RK10"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#E11D2E] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1">
                Action Button / CTA Text
              </label>
              <input
                type="text"
                value={settings.announcement?.linkText || ''}
                onChange={(e) => handleAnnouncementChange('linkText', e.target.value)}
                placeholder="e.g. SHOP NOW"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#E11D2E] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1">
                Action Link Destination URL
              </label>
              <input
                type="text"
                value={settings.announcement?.linkHref || ''}
                onChange={(e) => handleAnnouncementChange('linkHref', e.target.value)}
                placeholder="e.g. /products or /categories"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#E11D2E] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
              />
            </div>
          </div>

          {/* Live Storefront Preview */}
          <div className="pt-2">
            <span className="text-[10px] font-mono uppercase text-[#666666] block mb-1">Storefront Live Preview:</span>
            {settings.announcement?.enabled ? (
              <div className="bg-[#121212] border border-[#242424] text-[#F5F4F2] py-2 px-3 text-center flex items-center justify-center gap-2 text-[11px] font-mono uppercase">
                <span className="w-2 h-2 rounded-full bg-[#E11D2E] inline-block animate-pulse" />
                <span className="truncate">{settings.announcement?.text || 'Announcement Text'}</span>
                {settings.announcement?.linkText && (
                  <span className="text-[#E11D2E] font-bold underline ml-1">
                    {settings.announcement?.linkText} →
                  </span>
                )}
              </div>
            ) : (
              <div className="bg-[#181818] border border-[#242424] text-[#666666] py-2 px-3 text-center text-xs font-mono italic">
                Banner is currently disabled. Nothing will be displayed to customers.
              </div>
            )}
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="p-4 sm:p-6 bg-[#141414] border border-[#242424] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#E11D2E] font-bold pb-3 border-b border-[#202020]">
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
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#E11D2E] px-3 py-2 text-xs text-[#F5F4F2] font-mono focus:outline-none"
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
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#E11D2E] px-3 py-2 text-xs text-[#F5F4F2] font-mono focus:outline-none"
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
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#E11D2E] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
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
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#E11D2E] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Legal & Taxation Compliance */}
        <div className="p-4 sm:p-6 bg-[#141414] border border-[#242424] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#E11D2E] font-bold pb-3 border-b border-[#202020]">
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
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#E11D2E] px-3 py-2 text-xs text-[#F5F4F2] font-mono focus:outline-none"
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
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#E11D2E] px-3 py-2 text-xs text-[#F5F4F2] font-mono focus:outline-none uppercase"
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
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#E11D2E] px-3 py-2 text-xs text-[#F5F4F2] font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Business Contact & Support Desk */}
        <div className="p-4 sm:p-6 bg-[#141414] border border-[#242424] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#E11D2E] font-bold pb-3 border-b border-[#202020]">
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
                placeholder="Kuldeeprajput5262@gmail.com"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#E11D2E] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
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
                placeholder="+91 86306 63134 / +91 74520 13333"
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#E11D2E] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
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
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#E11D2E] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
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
                className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-[#E11D2E] px-3 py-2 text-xs text-[#F5F4F2] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
