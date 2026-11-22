import { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { Compass, Save, ArrowUp, ArrowDown, Eye, EyeOff, Plus, Trash2, Edit3, Check, X } from 'lucide-react';

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

  const [newHeader, setNewHeader] = useState({ label: '', path: '' });
  const [newFooter, setNewFooter] = useState({ label: '', path: '' });

  const [editingHeaderIdx, setEditingHeaderIdx] = useState(null);
  const [editHeaderForm, setEditHeaderForm] = useState({ label: '', path: '' });

  const [editingFooterIdx, setEditingFooterIdx] = useState(null);
  const [editFooterForm, setEditFooterForm] = useState({ label: '', path: '' });

  const handleStartEditHeader = (index) => {
    setEditingHeaderIdx(index);
    setEditHeaderForm({ label: headerLinks[index].label, path: headerLinks[index].path });
  };

  const handleSaveEditHeader = (index) => {
    if (!editHeaderForm.label.trim() || !editHeaderForm.path.trim()) return;
    const updated = [...headerLinks];
    updated[index] = {
      ...updated[index],
      label: editHeaderForm.label.trim(),
      path: editHeaderForm.path.trim()
    };
    setHeaderLinks(updated);
    setEditingHeaderIdx(null);
  };

  const handleCancelEditHeader = () => {
    setEditingHeaderIdx(null);
  };

  const handleStartEditFooter = (index) => {
    setEditingFooterIdx(index);
    setEditFooterForm({ label: footerLinks[index].label, path: footerLinks[index].path });
  };

  const handleSaveEditFooter = (index) => {
    if (!editFooterForm.label.trim() || !editFooterForm.path.trim()) return;
    const updated = [...footerLinks];
    updated[index] = {
      ...updated[index],
      label: editFooterForm.label.trim(),
      path: editFooterForm.path.trim()
    };
    setFooterLinks(updated);
    setEditingFooterIdx(null);
  };

  const handleCancelEditFooter = () => {
    setEditingFooterIdx(null);
  };

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

  const handleAddHeader = (e) => {
    e.preventDefault();
    if (!newHeader.label.trim() || !newHeader.path.trim()) return;
    setHeaderLinks([...headerLinks, { label: newHeader.label.trim(), path: newHeader.path.trim(), visible: true }]);
    setNewHeader({ label: '', path: '' });
  };

  const handleDeleteHeader = (index) => {
    setHeaderLinks(headerLinks.filter((_, i) => i !== index));
  };

  const handleAddFooter = (e) => {
    e.preventDefault();
    if (!newFooter.label.trim() || !newFooter.path.trim()) return;
    setFooterLinks([...footerLinks, { label: newFooter.label.trim(), path: newFooter.path.trim() }]);
    setNewFooter({ label: '', path: '' });
  };

  const handleDeleteFooter = (index) => {
    setFooterLinks(footerLinks.filter((_, i) => i !== index));
  };

  const handleMoveFooter = (index, direction) => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= footerLinks.length) return;
    const updated = [...footerLinks];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setFooterLinks(updated);
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
              <div key={idx} className="p-3 bg-[#0F172A] border border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                {editingHeaderIdx === idx ? (
                  <div className="flex-1 flex flex-col sm:flex-row gap-2 items-center">
                    <span className="w-6 h-6 rounded bg-[#1E293B] text-[10px] font-bold text-[#38BDF8] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={editHeaderForm.label}
                      onChange={(e) => setEditHeaderForm({ ...editHeaderForm, label: e.target.value })}
                      placeholder="Label"
                      className="bg-[#0A0E17] border border-[#38BDF8]/60 px-2 py-1 text-xs text-[#F1F5F9] focus:outline-none flex-1 w-full sm:w-auto"
                    />
                    <input
                      type="text"
                      value={editHeaderForm.path}
                      onChange={(e) => setEditHeaderForm({ ...editHeaderForm, path: e.target.value })}
                      placeholder="Route / Path"
                      className="bg-[#0A0E17] border border-[#38BDF8]/60 px-2 py-1 text-xs text-[#F1F5F9] focus:outline-none flex-1 w-full sm:w-auto"
                    />
                    <div className="flex items-center gap-1 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleSaveEditHeader(idx)}
                        className="p-1.5 bg-[#38BDF8] text-[#0A0E17] hover:bg-[#0EA5E9] transition-colors"
                        title="Save link changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditHeader}
                        className="p-1.5 bg-[#1E293B] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-[#1E293B] text-[10px] font-bold text-[#38BDF8] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-[#F1F5F9] uppercase">{item.label}</span>
                        <span className="text-[10px] text-[#64748B] block">Route: {item.path}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleStartEditHeader(idx)}
                        title="Edit link label and route"
                        className="p-1.5 bg-[#1E293B] hover:bg-[#38BDF8]/20 hover:text-[#38BDF8] text-[#94A3B8] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleHeader(idx)}
                        className={`p-1.5 border transition-colors ${
                          item.visible !== false
                            ? 'border-[#10B981]/40 text-[#10B981]'
                            : 'border-[#64748B]/40 text-[#64748B]'
                        }`}
                        title={item.visible !== false ? 'Visible on navbar' : 'Hidden from navbar'}
                      >
                        {item.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveHeader(idx, 'up')}
                        className="p-1.5 bg-[#1E293B] hover:bg-[#334155] disabled:opacity-30 text-[#F1F5F9]"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === headerLinks.length - 1}
                        onClick={() => handleMoveHeader(idx, 'down')}
                        className="p-1.5 bg-[#1E293B] hover:bg-[#334155] disabled:opacity-30 text-[#F1F5F9]"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteHeader(idx)}
                        title="Delete link"
                        className="p-1.5 bg-[#1E293B] hover:bg-[#EF4444]/20 hover:text-[#EF4444] text-[#94A3B8] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add Header Link Inline */}
          <div className="pt-3 border-t border-[#1E293B] flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Label (e.g. Clearance)"
              value={newHeader.label}
              onChange={(e) => setNewHeader({ ...newHeader, label: e.target.value })}
              className="bg-[#0F172A] border border-[#1E293B] px-3 py-1.5 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8] flex-1"
            />
            <input
              type="text"
              placeholder="Route / Path (e.g. /products)"
              value={newHeader.path}
              onChange={(e) => setNewHeader({ ...newHeader, path: e.target.value })}
              className="bg-[#0F172A] border border-[#1E293B] px-3 py-1.5 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8] flex-1"
            />
            <button
              type="button"
              onClick={handleAddHeader}
              className="px-3 py-1.5 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A0E17] font-bold text-xs uppercase flex items-center justify-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Footer Navigation Links */}
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-4">
          <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider pb-3 border-b border-[#1E293B]">
            Footer Quick Links
          </h2>

          <div className="space-y-2">
            {footerLinks.map((item, idx) => (
              <div key={idx} className="p-3 bg-[#0F172A] border border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                {editingFooterIdx === idx ? (
                  <div className="flex-1 flex flex-col sm:flex-row gap-2 items-center">
                    <span className="w-6 h-6 rounded bg-[#1E293B] text-[10px] font-bold text-[#38BDF8] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={editFooterForm.label}
                      onChange={(e) => setEditFooterForm({ ...editFooterForm, label: e.target.value })}
                      placeholder="Label"
                      className="bg-[#0A0E17] border border-[#38BDF8]/60 px-2 py-1 text-xs text-[#F1F5F9] focus:outline-none flex-1 w-full sm:w-auto"
                    />
                    <input
                      type="text"
                      value={editFooterForm.path}
                      onChange={(e) => setEditFooterForm({ ...editFooterForm, path: e.target.value })}
                      placeholder="Route / Path"
                      className="bg-[#0A0E17] border border-[#38BDF8]/60 px-2 py-1 text-xs text-[#F1F5F9] focus:outline-none flex-1 w-full sm:w-auto"
                    />
                    <div className="flex items-center gap-1 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleSaveEditFooter(idx)}
                        className="p-1.5 bg-[#38BDF8] text-[#0A0E17] hover:bg-[#0EA5E9] transition-colors"
                        title="Save link changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditFooter}
                        className="p-1.5 bg-[#1E293B] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-[#1E293B] text-[10px] font-bold text-[#38BDF8] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-[#F1F5F9] uppercase">{item.label}</span>
                        <span className="text-[10px] text-[#64748B] block">Route: {item.path}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleStartEditFooter(idx)}
                        title="Edit footer link"
                        className="p-1.5 bg-[#1E293B] hover:bg-[#38BDF8]/20 hover:text-[#38BDF8] text-[#94A3B8] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveFooter(idx, 'up')}
                        className="p-1.5 bg-[#1E293B] hover:bg-[#334155] disabled:opacity-30 text-[#F1F5F9]"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === footerLinks.length - 1}
                        onClick={() => handleMoveFooter(idx, 'down')}
                        className="p-1.5 bg-[#1E293B] hover:bg-[#334155] disabled:opacity-30 text-[#F1F5F9]"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFooter(idx)}
                        title="Delete footer link"
                        className="p-1.5 bg-[#1E293B] hover:bg-[#EF4444]/20 hover:text-[#EF4444] text-[#94A3B8] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add Footer Link Inline */}
          <div className="pt-3 border-t border-[#1E293B] flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Label (e.g. Terms)"
              value={newFooter.label}
              onChange={(e) => setNewFooter({ ...newFooter, label: e.target.value })}
              className="bg-[#0F172A] border border-[#1E293B] px-3 py-1.5 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8] flex-1"
            />
            <input
              type="text"
              placeholder="Route / Path (e.g. /terms)"
              value={newFooter.path}
              onChange={(e) => setNewFooter({ ...newFooter, path: e.target.value })}
              className="bg-[#0F172A] border border-[#1E293B] px-3 py-1.5 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8] flex-1"
            />
            <button
              type="button"
              onClick={handleAddFooter}
              className="px-3 py-1.5 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A0E17] font-bold text-xs uppercase flex items-center justify-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
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
