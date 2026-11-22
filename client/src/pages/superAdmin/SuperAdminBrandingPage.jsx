import { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { Palette, Save } from 'lucide-react';
import RKWatermark from '../../components/common/RKWatermark';

export default function SuperAdminBrandingPage() {
  const { content, updateBranding, showToast } = useContent();
  const { logActivity } = useAuth();

  const [brandingForm, setBrandingForm] = useState({
    brandName: 'RK Nutrition',
    tagline: 'FUEL YOUR POTENTIAL',
    colors: {
      primaryBlack: '#111111',
      darkGrey: '#1A1A1A',
      accentRed: '#E11D2E',
      accentRedHover: '#AC1721',
      offWhite: '#F5F4F2',
      mutedGrey: '#8C8C8C'
    },
    typography: {
      headingFont: 'Montserrat, sans-serif',
      bodyFont: 'Inter, sans-serif',
      monoFont: 'JetBrains Mono, monospace'
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (content?.branding) {
      setBrandingForm((prev) => ({
        ...prev,
        ...content.branding,
        colors: { ...prev.colors, ...(content.branding.colors || {}) }
      }));
    }
  }, [content]);

  const handleColorChange = (key, val) => {
    setBrandingForm((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: val
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await updateBranding(brandingForm);
    if (res.success) {
      showToast('Brand styling parameters saved to server.', 'success');
      logActivity('Super Admin updated visual identity palette tokens', 'branding');
    } else {
      showToast(res.error || 'Failed to update branding.', 'error');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#38BDF8]">
            <Palette className="w-4 h-4" />
            <span>Design Tokens</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F1F5F9] tracking-tight mt-1">
            Visual Identity & Brand Tokens
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-body">
            Configure CSS design tokens, brand hex codes, typography standards, and athletic monogram styling.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-xs uppercase font-bold text-[#0A0E17] transition-colors shadow-lg shadow-[#38BDF8]/20"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Deploy Palette'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Core Identity */}
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-4">
          <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider pb-3 border-b border-[#1E293B]">
            Core Brand Copy
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Brand Name</label>
              <input
                type="text"
                value={brandingForm.brandName}
                onChange={(e) => setBrandingForm({ ...brandingForm, brandName: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Tagline Slogan</label>
              <input
                type="text"
                value={brandingForm.tagline}
                onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Color Palette Tokens */}
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-5">
          <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider pb-3 border-b border-[#1E293B]">
            Official Color Palette Tokens
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'primaryBlack', label: 'Primary Black (Dark Canvas)', default: '#111111' },
              { key: 'accentRed', label: 'RK Signature Red (Accent)', default: '#E11D2E' },
              { key: 'accentRedHover', label: 'Red Hover State', default: '#AC1721' },
              { key: 'darkGrey', label: 'Dark Charcoal Surface', default: '#1A1A1A' },
              { key: 'offWhite', label: 'Off-White Text Tone', default: '#F5F4F2' },
              { key: 'mutedGrey', label: 'Muted Secondary Text', default: '#8C8C8C' }
            ].map((col) => (
              <div key={col.key} className="p-4 bg-[#0F172A] border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase text-[#F1F5F9] font-bold">{col.label}</span>
                  <div
                    className="w-6 h-6 border border-[#334155]"
                    style={{ backgroundColor: brandingForm.colors[col.key] || col.default }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandingForm.colors[col.key] || col.default}
                    onChange={(e) => handleColorChange(col.key, e.target.value)}
                    className="w-8 h-8 cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={brandingForm.colors[col.key] || col.default}
                    onChange={(e) => handleColorChange(col.key, e.target.value)}
                    className="w-full bg-[#0A0E17] border border-[#1E293B] px-2 py-1 text-xs text-[#F1F5F9] font-mono focus:border-[#38BDF8] focus:outline-none uppercase"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Mark Preview */}
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-4">
          <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider pb-3 border-b border-[#1E293B]">
            Athletic Monogram Asset Preview
          </h2>

          <div className="p-8 bg-[#111111] border border-[#242424] flex items-center justify-center relative overflow-hidden">
            <div className="w-64 opacity-20">
              <RKWatermark className="w-full h-auto" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3">
                <img 
                  src="/images/RK%20Nutrition%20Logo.png" 
                  alt="RK Nutrition" 
                  className="h-16 w-auto object-contain mx-auto" 
                />
                <div className="text-xs font-mono text-[#8C8C8C] uppercase tracking-widest">
                  {brandingForm.tagline}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
