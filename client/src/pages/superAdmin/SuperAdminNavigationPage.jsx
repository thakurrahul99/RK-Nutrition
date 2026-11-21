import { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { Compass, Save, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

export default function SuperAdminNavigationPage() {
  const { content, updateNavigation, showToast } = useContent();
  const { logActivity } = useAuth();

  const [headerLinks, setHeaderLinks] = useState([
    { label: 'Products', path: '/products', visible: true },
    { label: 'Categories', path: '/categories', visible: true },
    { label: 'About', path: '/about', visible: true },
    { label: 'Contact', path: '/contact', visible: true }
  ]);

  const [footerLinks, setFooterLinks] = useState([
    { label: 'All Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'About RK Nutrition', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact Desk', path: '/contact' },
    { label: 'Shipping & Returns', path: '/shipping-policy' }
  ]);

  const [socialLinks, setSocialLinks] = useState({
    instagram: 'https://instagram.com/rknutrition',
    youtube: 'https://youtube.com/@rknutrition',
    twitter: 'https://twitter.com/rknutrition',
    whatsapp: 'https://wa.me/919876543210'
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (content?.navigation) {
      if (Array.isArray(content.navigation.headerLinks)) setHeaderLinks(content.navigation.headerLinks);
      if (Array.isArray(content.navigation.footerLinks)) setFooterLinks(content.navigation.footerLinks);
      if (content.navigation.socialLinks) setSocialLinks((prev) => ({ ...prev, ...content.navigation.socialLinks }));
    }
  }, [content]);

  const handleToggleHeader = (index) => {
    const updated = [...headerLinks];
    updated[index] = { ...updated[index], visible: !updated[index].visible };
    setHeaderLinks(updated);
  };

  const handleMoveHeader = (index, direction) => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= headerLinks.length) return;
    const updated = [...headerLinks];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setHeaderLinks(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      headerLinks,
      footerLinks,
      socialLinks
    };

    const res = await updateNavigation(payload);
    if (res.success) {
      showToast('Navigation routes and links saved to server.', 'success');
      logActivity('Super Admin updated header and footer navigation structure', 'navigation');
    } else {
      showToast(res.error || 'Failed to update navigation.', 'error');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#38BDF8]">
            <Compass className="w-4 h-4" />
            <span>Site Hierarchy</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F1F5F9] tracking-tight mt-1">
            Navigation Menus & Links
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-body">
            Manage global header navbar items, footer quick links, and official social media channel connections.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-xs uppercase font-bold text-[#0A0E17] transition-colors shadow-lg shadow-[#38BDF8]/20"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Deploy Menus'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Header Navbar Links */}
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-4">
          <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider pb-3 border-b border-[#1E293B]">
            Header Navbar Links
          </h2>

          <div className="space-y-2">
            {headerLinks.map((item, idx) => (
              <div key={idx} className="p-3 bg-[#0F172A] border border-[#1E293B] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-[#1E293B] text-[10px] font-bold text-[#38BDF8] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-[#F1F5F9] uppercase">{item.label}</span>
                    <span className="text-[10px] text-[#64748B] block">Route: {item.path}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleHeader(idx)}
                    className={`p-1.5 border transition-colors ${
                      item.visible !== false
                        ? 'border-[#10B981]/40 text-[#10B981]'
                        : 'border-[#64748B]/40 text-[#64748B]'
                    }`}
                  >
                    {item.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveHeader(idx, 'up')}
                    className="p-1.5 bg-[#1E293B] hover:bg-[#334155] disabled:opacity-30 text-[#F1F5F9]"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === headerLinks.length - 1}
                    onClick={() => handleMoveHeader(idx, 'down')}
                    className="p-1.5 bg-[#1E293B] hover:bg-[#334155] disabled:opacity-30 text-[#F1F5F9]"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-4">
          <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider pb-3 border-b border-[#1E293B]">
            Official Social Media Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Instagram URL</label>
              <input
                type="text"
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">YouTube URL</label>
              <input
                type="text"
                value={socialLinks.youtube}
                onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Twitter / X URL</label>
              <input
                type="text"
                value={socialLinks.twitter}
                onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">WhatsApp Direct Desk</label>
              <input
                type="text"
                value={socialLinks.whatsapp}
                onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
