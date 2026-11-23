import { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutTemplate, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff 
} from 'lucide-react';

const SECTION_LABELS = {
  hero: 'Hero Headline & Supplement Atmosphere',
  pillars: 'Quality Pillars Strip (Pure Protein / Zero Spiking / Transparency)',
  featured: 'Featured Formulations Showcase',
  categories: 'Category Navigation Grid',
  education: 'Supplement Science & Product Education Module',
  intro: 'Brand Philosophy & Nutrition Manifesto',
  feature: 'Purity & Transparency Spotlight',
  values: 'Formulation Standards & Quality Pillars'
};

export default function SuperAdminHomepagePage() {
  const { content, updateHomepage, showToast } = useContent();
  const { logActivity } = useAuth();

  const [activeTab, setActiveTab] = useState('hero'); // hero | order | visibility | banner
  const [isSaving, setIsSaving] = useState(false);

  // Forms
  const [heroForm, setHeroForm] = useState({
    badge: 'RK NUTRITION / PERFORMANCE SERIES',
    headlineWhite: 'FUEL YOUR',
    headlineRed: 'POTENTIAL.',
    subtext: 'Straightforward sports nutrition. Transparent ingredients. No unnecessary hype. Find the essentials to support your training and everyday routine.',
    primaryCtaText: 'SHOP SUPPLEMENTS',
    primaryCtaLink: '/products',
    secondaryCtaText: 'EXPLORE THE RANGE',
    secondaryCtaLink: '/categories'
  });

  const [sectionOrder, setSectionOrder] = useState([
    'hero',
    'pillars',
    'featured',
    'categories',
    'education',
    'intro',
    'feature',
    'values'
  ]);

  const [sectionVisibility, setSectionVisibility] = useState({
    hero: true,
    pillars: true,
    featured: true,
    categories: true,
    education: true,
    intro: true,
    feature: true,
    values: true
  });

  const [bannerForm, setBannerForm] = useState({
    text: 'FOUNDATIONAL LAUNCH LINEUP — VERIFIED ATHLETIC FORMULATIONS NOW ACTIVE',
    link: '/products',
    linkText: 'SHOP NOW',
    isActive: true,
    enabled: true
  });

  useEffect(() => {
    if (content?.homepage) {
      if (content.homepage.hero) {
        const h = content.homepage.hero;
        setHeroForm((prev) => ({
          ...prev,
          ...h,
          headlineWhite: h.headlineWhite || h.headingLine1 || prev.headlineWhite,
          headlineRed: h.headlineRed || h.headingLine2 || prev.headlineRed,
          primaryCtaText: h.primaryCtaText || prev.primaryCtaText,
          primaryCtaLink: h.primaryCtaLink || h.primaryCtaHref || prev.primaryCtaLink,
          secondaryCtaText: h.secondaryCtaText || prev.secondaryCtaText,
          secondaryCtaLink: h.secondaryCtaLink || h.secondaryCtaHref || prev.secondaryCtaLink
        }));
      }
      if (Array.isArray(content.homepage.sectionOrder)) setSectionOrder(content.homepage.sectionOrder);
      if (content.homepage.sectionVisibility) setSectionVisibility((prev) => ({ ...prev, ...content.homepage.sectionVisibility }));
      if (content.homepage.banner) {
        setBannerForm((prev) => ({
          ...prev,
          ...content.homepage.banner,
          text: content.homepage.banner.text || prev.text,
          link: content.homepage.banner.link || content.homepage.banner.linkHref || prev.link,
          linkText: content.homepage.banner.linkText || content.homepage.banner.ctaText || prev.linkText,
          isActive: content.homepage.banner.isActive !== undefined ? content.homepage.banner.isActive : (content.homepage.banner.enabled !== undefined ? content.homepage.banner.enabled : true),
          enabled: content.homepage.banner.enabled !== undefined ? content.homepage.banner.enabled : (content.homepage.banner.isActive !== undefined ? content.homepage.banner.isActive : true)
        }));
      }
    }
  }, [content]);

  // Section Order handlers
  const handleMoveSection = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sectionOrder.length) return;
    const updated = [...sectionOrder];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSectionOrder(updated);
  };

  const handleToggleVisibility = (key) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const normalizedHero = {
      ...heroForm,
      headingLine1: heroForm.headlineWhite,
      headingLine2: heroForm.headlineRed,
      primaryCtaHref: heroForm.primaryCtaLink,
      secondaryCtaHref: heroForm.secondaryCtaLink
    };

    const payload = {
      hero: normalizedHero,
      sectionOrder,
      sectionVisibility,
      banner: {
        ...bannerForm,
        enabled: Boolean(bannerForm.isActive ?? bannerForm.enabled),
        isActive: Boolean(bannerForm.isActive ?? bannerForm.enabled),
        linkHref: bannerForm.link || '/products',
        linkText: bannerForm.linkText || 'SHOP NOW'
      }
    };

    const res = await updateHomepage(payload);
    if (res.success) {
      showToast('Homepage composition saved to server.', 'success');
      logActivity('Super Admin updated homepage layout and hero composition', 'content');
    } else {
      showToast(res.error || 'Failed to update homepage.', 'error');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#38BDF8]">
            <LayoutTemplate className="w-4 h-4" />
            <span>Frontend Layout Engine</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F1F5F9] tracking-tight mt-1">
            Homepage Composition & Hero Editor
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-body">
            Manage headline typography, reorder landing sections dynamically, toggle module visibility, and configure promotional banners.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-xs uppercase font-bold text-[#0A0E17] transition-colors shadow-lg shadow-[#38BDF8]/20"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Deploy Changes'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1E293B] gap-2 overflow-x-auto pb-1 sm:pb-0">
        {[
          { id: 'hero', label: '1. Hero Section' },
          { id: 'order', label: '2. Section Order' },
          { id: 'visibility', label: '3. Section Visibility' },
          { id: 'banner', label: '4. Announcement Banner' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'border-[#38BDF8] text-[#38BDF8] font-bold bg-[#0F172A]'
                : 'border-transparent text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Hero Section Editor */}
      {activeTab === 'hero' && (
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-5">
          <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider pb-3 border-b border-[#1E293B]">
            Hero Copy & Call-To-Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Badge Text</label>
              <input
                type="text"
                value={heroForm.badge}
                onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Headline Line 1 (White)</label>
              <input
                type="text"
                value={heroForm.headlineWhite}
                onChange={(e) => setHeroForm({ ...heroForm, headlineWhite: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Headline Line 2 (Red)</label>
              <input
                type="text"
                value={heroForm.headlineRed}
                onChange={(e) => setHeroForm({ ...heroForm, headlineRed: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Subheadline Body Copy</label>
              <textarea
                rows={3}
                value={heroForm.subtext}
                onChange={(e) => setHeroForm({ ...heroForm, subtext: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] p-3 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Primary CTA Label</label>
              <input
                type="text"
                value={heroForm.primaryCtaText}
                onChange={(e) => setHeroForm({ ...heroForm, primaryCtaText: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Primary CTA Link</label>
              <input
                type="text"
                value={heroForm.primaryCtaLink}
                onChange={(e) => setHeroForm({ ...heroForm, primaryCtaLink: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Secondary CTA Label</label>
              <input
                type="text"
                value={heroForm.secondaryCtaText}
                onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaText: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Secondary CTA Link</label>
              <input
                type="text"
                value={heroForm.secondaryCtaLink}
                onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaLink: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Section Order Manager */}
      {activeTab === 'order' && (
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-4">
          <div>
            <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider">
              Dynamic Section Sequence
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1 font-body">
              Reorder homepage components. The customer storefront renders components in the exact sequence configured below.
            </p>
          </div>

          <div className="space-y-2">
            {sectionOrder.map((sectionKey, idx) => (
              <div 
                key={sectionKey}
                className="p-3.5 bg-[#0F172A] border border-[#1E293B] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-[#1E293B] flex items-center justify-center font-bold text-[#38BDF8]">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-[#F1F5F9] uppercase">{SECTION_LABELS[sectionKey] || sectionKey}</span>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">Key: {sectionKey}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveSection(idx, 'up')}
                    className="p-1.5 bg-[#1E293B] hover:bg-[#334155] disabled:opacity-30 text-[#F1F5F9] transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === sectionOrder.length - 1}
                    onClick={() => handleMoveSection(idx, 'down')}
                    className="p-1.5 bg-[#1E293B] hover:bg-[#334155] disabled:opacity-30 text-[#F1F5F9] transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Section Visibility Toggles */}
      {activeTab === 'visibility' && (
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-4">
          <div>
            <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider">
              Component Visibility Controls
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1 font-body">
              Enable or disable entire modules on the homepage without altering page code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.keys(sectionVisibility).map((key) => {
              const isVisible = sectionVisibility[key];
              return (
                <div
                  key={key}
                  onClick={() => handleToggleVisibility(key)}
                  className={`p-4 border transition-all cursor-pointer flex items-center justify-between select-none ${
                    isVisible
                      ? 'bg-[#0F172A] border-[#38BDF8]/50 text-[#F1F5F9]'
                      : 'bg-[#0A0E17] border-[#1E293B] text-[#64748B]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isVisible ? <Eye className="w-4 h-4 text-[#38BDF8]" /> : <EyeOff className="w-4 h-4 text-[#64748B]" />}
                    <div>
                      <span className="font-bold text-xs uppercase block">{SECTION_LABELS[key] || key}</span>
                      <span className="text-[10px] text-[#64748B]">module: {key}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${
                    isVisible
                      ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
                      : 'bg-[#64748B]/10 border-[#64748B]/30 text-[#64748B]'
                  }`}>
                    {isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Announcement Banner */}
      {activeTab === 'banner' && (
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div>
              <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider">
                Top Announcement Bar
              </h2>
              <p className="text-xs text-[#94A3B8] mt-1 font-body">
                The global banner pinned at the very top of the customer storefront.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setBannerForm({ ...bannerForm, isActive: !bannerForm.isActive })}
              className={`px-3 py-1 text-xs uppercase font-bold border transition-colors ${
                bannerForm.isActive
                  ? 'bg-[#10B981]/15 border-[#10B981] text-[#10B981]'
                  : 'bg-[#64748B]/15 border-[#64748B] text-[#64748B]'
              }`}
            >
              {bannerForm.isActive ? 'Banner Active' : 'Banner Disabled'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Banner Announcement Text</label>
              <input
                type="text"
                value={bannerForm.text}
                onChange={(e) => setBannerForm({ ...bannerForm, text: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">CTA Button Label</label>
                <input
                  type="text"
                  value={bannerForm.linkText || ''}
                  onChange={(e) => setBannerForm({ ...bannerForm, linkText: e.target.value })}
                  placeholder="e.g. SHOP NOW"
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">Target URL Destination</label>
                <input
                  type="text"
                  value={bannerForm.link}
                  onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                  placeholder="e.g. /products"
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
                />
              </div>
            </div>

            {/* Preview Box */}
            <div className="pt-2">
              <span className="text-[10px] uppercase text-[#64748B] block mb-1">Storefront Live Preview:</span>
              {bannerForm.isActive ? (
                <div className="bg-[#121212] border border-[#242424] text-[#F5F4F2] py-2 px-3 text-center flex items-center justify-center gap-2 text-[11px] font-mono uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#E11D2E] inline-block animate-pulse" />
                  <span className="truncate">{bannerForm.text || 'Announcement Text'}</span>
                  {bannerForm.linkText && (
                    <span className="text-[#E11D2E] font-bold underline ml-1">
                      {bannerForm.linkText} →
                    </span>
                  )}
                </div>
              ) : (
                <div className="bg-[#0F172A] border border-[#1E293B] text-[#64748B] py-2 px-3 text-center text-xs italic">
                  Banner is currently disabled. Pinned banner will not render on storefront.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
