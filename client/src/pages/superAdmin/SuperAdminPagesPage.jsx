import { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FileCode2, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Save, 
  X
} from 'lucide-react';

export default function SuperAdminPagesPage() {
  const { content, updatePages, showToast } = useContent();
  const { logActivity } = useAuth();

  const [activeTab, setActiveTab] = useState('faq'); // faq | about | contact | shipping | legal
  const [isSaving, setIsSaving] = useState(false);

  // FAQ State
  const [faqList, setFaqList] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  // About Form
  const [aboutForm, setAboutForm] = useState({
    headline: 'FOR ATHLETES WHO DEMAND EXCELLENCE.',
    subheadline: 'Crafted without compromises for peak physiological adaptation.',
    story: 'RK Nutrition was established with a singular mission: to eliminate proprietary blends, misleading label claims, and underdosed formulations. We engineer supplements that deliver measurable outcomes for serious athletes.',
    mission: 'To set an uncompromising benchmark in sports nutrition purity, safety, and performance potency.',
    vision: 'To empower athletes at every level with certified, lab-tested formulations that build elite strength.'
  });

  // Contact Form
  const [contactForm, setContactForm] = useState({
    title: "LET'S CONNECT.",
    description: 'Have a question or need information? Reach out to RK Nutrition.',
    deskHours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
    officialEmail: 'contact@rknutrition.com',
    supportPhone: '+91 98765 43210'
  });

  // Shipping & Return Policy Form
  const [shippingForm, setShippingForm] = useState({
    dispatchTimeline: 'Orders are dispatched within 24-48 hours from our central warehouse.',
    deliveryTimeline: 'Standard delivery transit takes 3-5 business days across India.',
    shippingCharges: 'Standard ₹99 flat fee on orders below ₹1,999. Free shipping applies on orders of ₹1,999 or more.',
    returnWindow: '7 calendar days from the date of confirmed delivery.',
    returnConditions: 'Items must be untampered, unopened, and sealed in original packaging with batch codes intact.'
  });

  // Legal Policies (Privacy & Terms)
  const [legalForm, setLegalForm] = useState({
    privacyPolicy: 'At RK Nutrition, we value the privacy of our athletes and visitors. This informational and commerce platform does not sell personal tracking profiles. Commercial transaction data is secured via bank-grade encryption.',
    termsOfService: 'Welcome to the official digital platform of RK Nutrition. By exploring or ordering from this website, you agree to these terms. All formulations, visual branding, typography, and trade copy are the property of RK Nutrition.'
  });

  useEffect(() => {
    if (content?.pages) {
      if (Array.isArray(content.pages.faq)) setFaqList(content.pages.faq);
      if (content.pages.about) setAboutForm((prev) => ({ ...prev, ...content.pages.about }));
      if (content.pages.contact) setContactForm((prev) => ({ ...prev, ...content.pages.contact }));
      if (content.pages.shippingPolicy) setShippingForm((prev) => ({ ...prev, ...content.pages.shippingPolicy }));
      if (content.pages.privacyPolicy || content.pages.termsOfService) {
        setLegalForm((prev) => ({
          privacyPolicy: content.pages.privacyPolicy?.text || prev.privacyPolicy,
          termsOfService: content.pages.termsOfService?.text || prev.termsOfService
        }));
      }
    }
  }, [content]);

  // FAQ Handlers
  const handleToggleFaq = (id) => {
    setFaqList(faqList.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item)));
  };

  const handleMoveFaq = (index, direction) => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= faqList.length) return;
    const updated = [...faqList];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setFaqList(updated);
  };

  const handleDeleteFaq = (id) => {
    if (window.confirm('Delete this question permanently?')) {
      setFaqList(faqList.filter((f) => f.id !== id));
    }
  };

  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newItem = {
      id: `faq-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      visible: true
    };

    setFaqList([...faqList, newItem]);
    setNewQuestion('');
    setNewAnswer('');
    setIsAddingFaq(false);
  };

  // Save all pages content
  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const payload = {
      faq: faqList,
      about: aboutForm,
      contact: contactForm,
      shippingPolicy: shippingForm,
      privacyPolicy: { text: legalForm.privacyPolicy },
      termsOfService: { text: legalForm.termsOfService }
    };

    const res = await updatePages(payload);
    if (res.success) {
      showToast('Informational pages copy saved to server.', 'success');
      logActivity('Super Admin updated editorial page copy and policies', 'content');
    } else {
      showToast(res.error || 'Failed to update pages.', 'error');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#38BDF8]">
            <FileCode2 className="w-4 h-4" />
            <span>Editorial Copy Engine</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F1F5F9] tracking-tight mt-1">
            Informational Pages & Policies
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-body">
            Manage public FAQs, brand narrative story, contact details, shipping and returns policy, and legal agreements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-xs uppercase font-bold text-[#0A0E17] transition-colors shadow-lg shadow-[#38BDF8]/20"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Pages Copy'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1E293B] gap-2 overflow-x-auto pb-1 sm:pb-0">
        {[
          { id: 'faq', label: `1. FAQ Database (${faqList.length})` },
          { id: 'about', label: '2. About RK Nutrition' },
          { id: 'contact', label: '3. Contact Desk' },
          { id: 'shipping', label: '4. Shipping & Returns' },
          { id: 'legal', label: '5. Privacy & Terms' }
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

      {/* Tab 1: FAQ Manager */}
      {activeTab === 'faq' && (
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div>
              <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5 font-body">
                Questions displayed on the public <code className="text-[#38BDF8]">/faq</code> page and accordion widgets.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingFaq(true)}
              className="px-3 py-1.5 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A0E17] text-xs uppercase font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          {/* Add FAQ Form */}
          {isAddingFaq && (
            <form onSubmit={handleAddFaq} className="p-4 bg-[#0F172A] border border-[#38BDF8]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-[#38BDF8]">Create New Question</span>
                <button type="button" onClick={() => setIsAddingFaq(false)} className="text-[#94A3B8] hover:text-[#F1F5F9]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#94A3B8] mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. Are RK Nutrition formulations tested for banned substances?"
                  className="w-full bg-[#0A0E17] border border-[#1E293B] px-3 py-2 text-xs text-[#F1F5F9] focus:border-[#38BDF8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#94A3B8] mb-1">Answer</label>
                <textarea
                  rows={3}
                  required
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Comprehensive verified answer..."
                  className="w-full bg-[#0A0E17] border border-[#1E293B] p-3 text-xs text-[#F1F5F9] focus:border-[#38BDF8] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingFaq(false)}
                  className="px-3 py-1.5 bg-[#1E293B] text-xs text-[#94A3B8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#38BDF8] text-[#0A0E17] text-xs uppercase font-bold"
                >
                  Insert Question
                </button>
              </div>
            </form>
          )}

          {/* FAQ List */}
          <div className="space-y-3">
            {faqList.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 bg-[#0F172A] border border-[#1E293B] space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded bg-[#1E293B] text-[10px] font-bold text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h3 className="font-heading text-sm uppercase font-bold text-[#F1F5F9]">
                      {item.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleFaq(item.id)}
                      className={`p-1.5 border transition-colors ${
                        item.visible
                          ? 'border-[#10B981]/40 text-[#10B981]'
                          : 'border-[#64748B]/40 text-[#64748B]'
                      }`}
                      title={item.visible ? 'Visible on /faq' : 'Hidden from /faq'}
                    >
                      {item.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveFaq(idx, 'up')}
                      className="p-1.5 bg-[#1E293B] hover:bg-[#334155] disabled:opacity-30 text-[#F1F5F9]"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === faqList.length - 1}
                      onClick={() => handleMoveFaq(idx, 'down')}
                      className="p-1.5 bg-[#1E293B] hover:bg-[#334155] disabled:opacity-30 text-[#F1F5F9]"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(item.id)}
                      className="p-1.5 text-[#F43F5E] hover:bg-[#1E293B]"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#94A3B8] font-body leading-relaxed pl-8">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: About Us Narrative */}
      {activeTab === 'about' && (
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-4">
          <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider pb-3 border-b border-[#1E293B]">
            About Page Narrative & Pillars
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Headline Statement</label>
              <input
                type="text"
                value={aboutForm.headline}
                onChange={(e) => setAboutForm({ ...aboutForm, headline: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Subheadline</label>
              <input
                type="text"
                value={aboutForm.subheadline}
                onChange={(e) => setAboutForm({ ...aboutForm, subheadline: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Brand Founding Story</label>
              <textarea
                rows={4}
                value={aboutForm.story}
                onChange={(e) => setAboutForm({ ...aboutForm, story: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] p-3 text-xs text-[#F1F5F9] focus:outline-none font-body leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">Core Mission</label>
                <textarea
                  rows={3}
                  value={aboutForm.mission}
                  onChange={(e) => setAboutForm({ ...aboutForm, mission: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] p-3 text-xs text-[#F1F5F9] focus:outline-none font-body"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">Brand Vision</label>
                <textarea
                  rows={3}
                  value={aboutForm.vision}
                  onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] p-3 text-xs text-[#F1F5F9] focus:outline-none font-body"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Contact Desk Copy */}
      {activeTab === 'contact' && (
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-4">
          <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider pb-3 border-b border-[#1E293B]">
            Public Contact Desk Copy
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Hero Title</label>
              <input
                type="text"
                value={contactForm.title}
                onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Desk Introduction</label>
              <input
                type="text"
                value={contactForm.description}
                onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">Official Email</label>
                <input
                  type="email"
                  value={contactForm.officialEmail}
                  onChange={(e) => setContactForm({ ...contactForm, officialEmail: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">Desk Hours</label>
                <input
                  type="text"
                  value={contactForm.deskHours}
                  onChange={(e) => setContactForm({ ...contactForm, deskHours: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={contactForm.supportPhone}
                  onChange={(e) => setContactForm({ ...contactForm, supportPhone: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Shipping & Return Policy */}
      {activeTab === 'shipping' && (
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-4">
          <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider pb-3 border-b border-[#1E293B]">
            Shipping Policy & Returns Guidelines
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Dispatch Timelines</label>
              <textarea
                rows={2}
                value={shippingForm.dispatchTimeline}
                onChange={(e) => setShippingForm({ ...shippingForm, dispatchTimeline: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] p-3 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Delivery Window Estimates</label>
              <textarea
                rows={2}
                value={shippingForm.deliveryTimeline}
                onChange={(e) => setShippingForm({ ...shippingForm, deliveryTimeline: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] p-3 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Shipping Charges Policy</label>
              <textarea
                rows={2}
                value={shippingForm.shippingCharges}
                onChange={(e) => setShippingForm({ ...shippingForm, shippingCharges: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] p-3 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">Return Window</label>
                <input
                  type="text"
                  value={shippingForm.returnWindow}
                  onChange={(e) => setShippingForm({ ...shippingForm, returnWindow: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">Return / Replacement Conditions</label>
                <textarea
                  rows={2}
                  value={shippingForm.returnConditions}
                  onChange={(e) => setShippingForm({ ...shippingForm, returnConditions: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] p-3 text-xs text-[#F1F5F9] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Privacy & Terms */}
      {activeTab === 'legal' && (
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-4">
          <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider pb-3 border-b border-[#1E293B]">
            Legal Agreements (Privacy Policy & Terms of Service)
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Privacy Policy Copy</label>
              <textarea
                rows={5}
                value={legalForm.privacyPolicy}
                onChange={(e) => setLegalForm({ ...legalForm, privacyPolicy: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] p-3 text-xs text-[#F1F5F9] focus:outline-none font-body leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Terms of Service Copy</label>
              <textarea
                rows={5}
                value={legalForm.termsOfService}
                onChange={(e) => setLegalForm({ ...legalForm, termsOfService: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] p-3 text-xs text-[#F1F5F9] focus:outline-none font-body leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
