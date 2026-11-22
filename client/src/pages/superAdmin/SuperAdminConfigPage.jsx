import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../../services/api';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Cpu, 
  Database, 
  Save, 
  Download, 
  Upload,
  AlertTriangle, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  CheckCircle2,
  Globe
} from 'lucide-react';

export default function SuperAdminConfigPage() {
  const { content, updateAdvanced, showToast } = useContent();
  const { logActivity } = useAuth();

  const [activeTab, setActiveTab] = useState('gateway'); // gateway | seo | system | logs | backup
  const [isSaving, setIsSaving] = useState(false);

  // 1. Payment Gateway State
  const [gatewayForm, setGatewayForm] = useState({
    provider: 'razorpay',
    keyId: '',
    keySecret: '',
    webhookSecret: '',
    sandboxMode: true,
    isConfigured: false
  });
  const [showSecret, setShowSecret] = useState(false);

  // 2. Global SEO & OpenGraph State
  const [seoForm, setSeoForm] = useState({
    siteTitle: 'RK Nutrition — Official Performance Nutrition Platform',
    metaDescription: 'Engineered for dedicated athletes. High-yield Whey Protein Isolate, Mass Gainer, and Pre-Workout formulations with verified label transparency.',
    canonicalUrl: 'https://rknutrition.com',
    ogTitle: 'RK Nutrition — Premium Sports Nutrition & Supplements',
    ogDescription: 'Micro-filtered Whey Protein Isolate, Mass Gainers, Creatine, and Pre-Workout formulations with transparent labels and zero amino spiking.',
    ogImage: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=1200&q=80'
  });

  // 3. Advanced System Config State
  const [systemForm, setSystemForm] = useState({
    maintenanceMode: false,
    maintenanceMessage: 'Notice: Website maintenance mode is currently active. Public catalogue is in review status.',
    analytics: {
      googleAnalyticsId: '',
      metaPixelId: ''
    },
    smtp: {
      host: 'smtp.gmail.com',
      port: 587,
      user: 'notifications@rknutrition.com',
      senderEmail: 'noreply@rknutrition.com'
    }
  });

  // 3. System Logs State
  const [logs, setLogs] = useState([]);
  const [logFilter, setLogFilter] = useState('ALL');
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const fetchGatewayConfig = async () => {
    const res = await apiRequest('/payments/gateway-config');
    if (res.success && res.gatewayConfig) {
      setGatewayForm((prev) => ({
        ...prev,
        provider: res.gatewayConfig.provider || 'razorpay',
        keyId: res.gatewayConfig.keyId || '',
        keySecret: res.gatewayConfig.keySecret || '',
        webhookSecret: res.gatewayConfig.webhookSecret || '',
        sandboxMode: res.gatewayConfig.sandboxMode !== false,
        isConfigured: Boolean(res.gatewayConfig.isConfigured)
      }));
    }
  };

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    const res = await apiRequest('/content/logs');
    if (res.success && Array.isArray(res.logs)) {
      setLogs(res.logs);
    }
    setIsLoadingLogs(false);
  };

  useEffect(() => {
    fetchGatewayConfig();
    fetchLogs();
    if (content?.advanced) {
      setSystemForm((prev) => ({
        ...prev,
        ...content.advanced,
        analytics: { ...prev.analytics, ...(content.advanced.analytics || {}) },
        smtp: { ...prev.smtp, ...(content.advanced.smtp || {}) }
      }));
    }
    if (content?.advanced?.seo || content?.settings) {
      const s = content?.advanced?.seo || content?.settings || {};
      setSeoForm((prev) => ({
        ...prev,
        siteTitle: s.siteTitle || prev.siteTitle,
        metaDescription: s.metaDescription || prev.metaDescription,
        canonicalUrl: s.canonicalUrl || prev.canonicalUrl,
        ogTitle: s.ogTitle || s.siteTitle || prev.ogTitle,
        ogDescription: s.ogDescription || s.metaDescription || prev.ogDescription,
        ogImage: s.ogImage || prev.ogImage
      }));
    }
  }, [content]);

  // Save SEO & Meta Settings
  const handleSaveSeo = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedAdvanced = {
      ...(content?.advanced || {}),
      seo: seoForm
    };

    const res = await updateAdvanced(updatedAdvanced);
    if (res.success) {
      showToast('Global SEO metadata saved to server.', 'success');
      logActivity('Super Admin updated global SEO metadata and Open Graph tags', 'settings');
    } else {
      showToast(res.error || 'Failed to update SEO settings.', 'error');
    }
    setIsSaving(false);
  };

  // Save Gateway Credentials
  const handleSaveGateway = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await apiRequest('/payments/gateway-config', {
      method: 'PUT',
      body: JSON.stringify(gatewayForm)
    });

    if (res.success && res.gatewayConfig) {
      setGatewayForm((prev) => ({ ...prev, ...res.gatewayConfig }));
      showToast('Payment gateway API credentials updated on server.', 'success');
      logActivity(`Super Admin updated ${gatewayForm.provider.toUpperCase()} credentials (Sandbox: ${gatewayForm.sandboxMode})`, 'security');
    } else {
      showToast(res.error || 'Failed to update gateway credentials.', 'error');
    }
    setIsSaving(false);
  };

  // Save System Config
  const handleSaveSystem = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await updateAdvanced(systemForm);
    if (res.success) {
      showToast('System configuration & maintenance status deployed.', 'success');
      logActivity(`Super Admin updated system parameters (Maintenance Mode: ${systemForm.maintenanceMode})`, 'config');
    } else {
      showToast(res.error || 'Failed to update system config.', 'error');
    }
    setIsSaving(false);
  };

  // Download Atomic JSON Database Backup
  const handleDownloadBackup = async () => {
    const res = await apiRequest('/content/backup');
    if (res.success && res.database) {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.database, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `rk_nutrition_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast('Database JSON snapshot downloaded successfully.', 'success');
      logActivity('Super Admin generated and downloaded full database JSON snapshot', 'backup');
    } else {
      showToast(res.error || 'Failed to download database backup.', 'error');
    }
  };

  const [isRestoring, setIsRestoring] = useState(false);
  const restoreFileInputRef = useRef(null);

  const handleRestoreFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm(`Warning: Restoring "${file.name}" will overwrite current store products and settings. Continue?`)) {
      if (restoreFileInputRef.current) restoreFileInputRef.current.value = '';
      return;
    }

    setIsRestoring(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.products)) {
        throw new Error('Invalid backup file. The JSON must contain a valid database snapshot with products.');
      }

      const res = await apiRequest('/content/restore', {
        method: 'POST',
        body: JSON.stringify({ database: parsed })
      });

      if (res.success) {
        showToast('Database successfully restored from backup snapshot.', 'success');
        logActivity(`Super Admin restored database from backup file: ${file.name}`, 'backup');
      } else {
        throw new Error(res.error || 'Restore failed on server.');
      }
    } catch (err) {
      showToast(err.message || 'Failed to restore backup.', 'error');
    } finally {
      setIsRestoring(false);
      if (restoreFileInputRef.current) restoreFileInputRef.current.value = '';
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (logFilter === 'ALL') return true;
    return log.level?.toUpperCase() === logFilter;
  });

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#38BDF8]">
            <Cpu className="w-4 h-4" />
            <span>Root Technical Configuration</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F1F5F9] tracking-tight mt-1">
            Gateway Secrets, System & Backups
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-body">
            Manage live payment gateway keys, maintenance mode switches, system audit trails, and atomic database archives.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1E293B] gap-2 overflow-x-auto pb-1 sm:pb-0">
        {[
          { id: 'gateway', label: '1. Payment Gateway Secrets' },
          { id: 'seo', label: '2. Global SEO & Metadata' },
          { id: 'system', label: '3. Maintenance & Analytics' },
          { id: 'logs', label: `4. System Logs (${logs.length})` },
          { id: 'backup', label: '5. Database Backup' }
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

      {/* Tab 1: Payment Gateway Credentials */}
      {activeTab === 'gateway' && (
        <form onSubmit={handleSaveGateway} className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div>
              <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider">
                Production Payment Gateway API Credentials
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5 font-body">
                Configured keys are saved strictly to the backend database and masked from client bundles and store owners.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-xs uppercase font-bold text-[#0A0E17] flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Deploy Gateway Keys'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">
                  Active Payment Provider
                </label>
                <select
                  value={gatewayForm.provider}
                  onChange={(e) => setGatewayForm({ ...gatewayForm, provider: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
                >
                  <option value="razorpay">Razorpay (India UPI / Cards / Netbanking)</option>
                  <option value="cashfree">Cashfree Payments (Auto Collect)</option>
                  <option value="stripe">Stripe Global Payments</option>
                  <option value="manual">Manual Bank Transfer / QR Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">
                  Gateway Environment
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGatewayForm({ ...gatewayForm, sandboxMode: true })}
                    className={`flex-1 py-2 text-xs uppercase font-bold border transition-colors ${
                      gatewayForm.sandboxMode
                        ? 'bg-[#EAB308]/15 border-[#EAB308] text-[#EAB308]'
                        : 'bg-[#0F172A] border-[#1E293B] text-[#64748B]'
                    }`}
                  >
                    Test / Sandbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setGatewayForm({ ...gatewayForm, sandboxMode: false })}
                    className={`flex-1 py-2 text-xs uppercase font-bold border transition-colors ${
                      !gatewayForm.sandboxMode
                        ? 'bg-[#10B981]/15 border-[#10B981] text-[#10B981]'
                        : 'bg-[#0F172A] border-[#1E293B] text-[#64748B]'
                    }`}
                  >
                    Live Production
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">
                API Key ID / Merchant ID
              </label>
              <input
                type="text"
                value={gatewayForm.keyId}
                onChange={(e) => setGatewayForm({ ...gatewayForm, keyId: e.target.value })}
                placeholder="rzp_live_xxxxxxxxxxxxxxxxxxxx or rzp_test_xxxxxxxxxx"
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs uppercase text-[#94A3B8]">
                  Key Secret / Client Secret
                </label>
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="text-[10px] text-[#38BDF8] hover:underline flex items-center gap-1"
                >
                  {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showSecret ? 'Mask Secret' : 'Reveal Secret'}</span>
                </button>
              </div>
              <input
                type={showSecret ? 'text' : 'password'}
                value={gatewayForm.keySecret}
                onChange={(e) => setGatewayForm({ ...gatewayForm, keySecret: e.target.value })}
                placeholder="••••••••••••••••••••••••••••••••"
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">
                Webhook Secret (For Payment Settlement Verification)
              </label>
              <input
                type="text"
                value={gatewayForm.webhookSecret}
                onChange={(e) => setGatewayForm({ ...gatewayForm, webhookSecret: e.target.value })}
                placeholder="webhook_secret_key"
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Global SEO & Search Metadata */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveSeo} className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#38BDF8]" />
                <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider">
                  Global SEO, Canonical & OpenGraph Metadata
                </h2>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5 font-body">
                Configured metadata dynamically injects into document title, browser SERP previews, and social media rich cards.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-xs uppercase font-bold text-[#0A0E17] flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Deploy SEO Settings'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">
                Website Title (Browser Tab & SERP Heading)
              </label>
              <input
                type="text"
                value={seoForm.siteTitle}
                onChange={(e) => setSeoForm({ ...seoForm, siteTitle: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
                placeholder="e.g. RK Nutrition — Official Performance Nutrition Platform"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">
                Meta Description (Search Engine Snippet)
              </label>
              <textarea
                rows={3}
                value={seoForm.metaDescription}
                onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] p-3 text-xs text-[#F1F5F9] focus:outline-none font-body"
                placeholder="Summary describing the athletic product formulations..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">
                  Canonical Base URL
                </label>
                <input
                  type="url"
                  value={seoForm.canonicalUrl}
                  onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
                  placeholder="https://rknutrition.com"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">
                  Open Graph Image URL (Social Share Card)
                </label>
                <input
                  type="text"
                  value={seoForm.ogImage}
                  onChange={(e) => setSeoForm({ ...seoForm, ogImage: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
                  placeholder="https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=1200&q=80"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">
                  Open Graph Title
                </label>
                <input
                  type="text"
                  value={seoForm.ogTitle}
                  onChange={(e) => setSeoForm({ ...seoForm, ogTitle: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
                  placeholder="RK Nutrition — Fuel Your Potential"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-[#94A3B8] mb-1">
                  Open Graph Description
                </label>
                <input
                  type="text"
                  value={seoForm.ogDescription}
                  onChange={(e) => setSeoForm({ ...seoForm, ogDescription: e.target.value })}
                  className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
                  placeholder="Athletic-grade sports nutrition designed for serious lifters."
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: Maintenance Mode & Analytics */}
      {activeTab === 'system' && (
        <form onSubmit={handleSaveSystem} className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div>
              <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider">
                System Controls & Tracking IDs
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5 font-body">
                Control public maintenance status and configure marketing tracking identifiers.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-xs uppercase font-bold text-[#0A0E17] flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Deploy System Config'}</span>
            </button>
          </div>

          {/* Maintenance Mode Box */}
          <div className={`p-4 border transition-all ${
            systemForm.maintenanceMode ? 'bg-[#EAB308]/10 border-[#EAB308]/40' : 'bg-[#0F172A] border-[#1E293B]'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${systemForm.maintenanceMode ? 'text-[#EAB308]' : 'text-[#64748B]'}`} />
                <span className="text-xs uppercase font-bold text-[#F1F5F9]">Website Maintenance Mode</span>
              </div>
              <button
                type="button"
                onClick={() => setSystemForm({ ...systemForm, maintenanceMode: !systemForm.maintenanceMode })}
                className={`px-3 py-1 text-xs uppercase font-bold border transition-colors ${
                  systemForm.maintenanceMode
                    ? 'bg-[#EAB308] text-black border-[#EAB308]'
                    : 'bg-[#1E293B] text-[#94A3B8] border-[#334155]'
                }`}
              >
                {systemForm.maintenanceMode ? 'ACTIVE (Notice Shown)' : 'DISABLED (Normal Operations)'}
              </button>
            </div>

            <div className="mt-3">
              <label className="block text-[10px] uppercase text-[#94A3B8] mb-1">
                Maintenance Notice Banner Text
              </label>
              <input
                type="text"
                value={systemForm.maintenanceMessage}
                onChange={(e) => setSystemForm({ ...systemForm, maintenanceMessage: e.target.value })}
                className="w-full bg-[#0A0E17] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>
          </div>

          {/* Analytics IDs */}
          <div className="p-4 bg-[#0F172A] border border-[#1E293B] space-y-3">
            <span className="text-xs uppercase font-bold text-[#38BDF8] block">Analytics Tracking IDs</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase text-[#94A3B8] mb-1">Google Analytics 4 Measurement ID</label>
                <input
                  type="text"
                  value={systemForm.analytics?.googleAnalyticsId || ''}
                  onChange={(e) => setSystemForm({
                    ...systemForm,
                    analytics: { ...systemForm.analytics, googleAnalyticsId: e.target.value }
                  })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full bg-[#0A0E17] border border-[#1E293B] px-3 py-2 text-xs text-[#F1F5F9] focus:border-[#38BDF8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#94A3B8] mb-1">Meta / Facebook Pixel ID</label>
                <input
                  type="text"
                  value={systemForm.analytics?.metaPixelId || ''}
                  onChange={(e) => setSystemForm({
                    ...systemForm,
                    analytics: { ...systemForm.analytics, metaPixelId: e.target.value }
                  })}
                  placeholder="123456789012345"
                  className="w-full bg-[#0A0E17] border border-[#1E293B] px-3 py-2 text-xs text-[#F1F5F9] focus:border-[#38BDF8] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SMTP Mailer */}
          <div className="p-4 bg-[#0F172A] border border-[#1E293B] space-y-3">
            <span className="text-xs uppercase font-bold text-[#38BDF8] block">SMTP Notification Relay</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase text-[#94A3B8] mb-1">SMTP Server Host</label>
                <input
                  type="text"
                  value={systemForm.smtp?.host || ''}
                  onChange={(e) => setSystemForm({
                    ...systemForm,
                    smtp: { ...systemForm.smtp, host: e.target.value }
                  })}
                  className="w-full bg-[#0A0E17] border border-[#1E293B] px-3 py-2 text-xs text-[#F1F5F9] focus:border-[#38BDF8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#94A3B8] mb-1">Port</label>
                <input
                  type="number"
                  value={systemForm.smtp?.port || 587}
                  onChange={(e) => setSystemForm({
                    ...systemForm,
                    smtp: { ...systemForm.smtp, port: Number(e.target.value) }
                  })}
                  className="w-full bg-[#0A0E17] border border-[#1E293B] px-3 py-2 text-xs text-[#F1F5F9] focus:border-[#38BDF8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#94A3B8] mb-1">Sender Email</label>
                <input
                  type="email"
                  value={systemForm.smtp?.senderEmail || ''}
                  onChange={(e) => setSystemForm({
                    ...systemForm,
                    smtp: { ...systemForm.smtp, senderEmail: e.target.value }
                  })}
                  className="w-full bg-[#0A0E17] border border-[#1E293B] px-3 py-2 text-xs text-[#F1F5F9] focus:border-[#38BDF8] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: System Logs */}
      {activeTab === 'logs' && (
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1E293B] gap-3">
            <div>
              <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider">
                System Audit Trail
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5 font-body">
                Full chronological activity log captured by the Express backend API.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border border-[#1E293B] p-0.5 bg-[#0F172A]">
                {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLogFilter(lvl)}
                    className={`px-2.5 py-1 text-[10px] uppercase font-bold transition-colors ${
                      logFilter === lvl ? 'bg-[#38BDF8] text-[#0A0E17]' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={fetchLogs}
                className="p-1.5 bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:text-[#F1F5F9]"
                title="Refresh Logs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <p className="text-xs text-[#64748B] py-4 text-center">No logs matching filter level.</p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-[#0F172A] border border-[#1E293B] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 truncate">
                    <span className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${
                      log.level === 'WARN'
                        ? 'bg-[#EAB308]/10 border-[#EAB308]/30 text-[#EAB308]'
                        : log.level === 'ERROR'
                        ? 'bg-[#F43F5E]/10 border-[#F43F5E]/30 text-[#F43F5E]'
                        : 'bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#38BDF8]'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-[#64748B] text-[10px]">[{log.category}]</span>
                    <span className="text-[#F1F5F9] truncate font-body">{log.message}</span>
                  </div>
                  <span className="text-[10px] text-[#64748B] shrink-0 ml-4">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Database Snapshot & Backups */}
      {activeTab === 'backup' && (
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1E293B] gap-3">
            <div>
              <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider">
                Atomic Database Snapshot & Disaster Recovery
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5 font-body">
                The database is persisted in <code className="text-[#38BDF8]">server/data/rk_database.json</code> with atomic file writes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="file" 
                ref={restoreFileInputRef} 
                onChange={handleRestoreFile} 
                accept=".json,application/json" 
                className="hidden" 
              />
              <button
                type="button"
                disabled={isRestoring}
                onClick={() => restoreFileInputRef.current?.click()}
                className="px-3.5 py-2 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-xs uppercase font-bold text-[#F1F5F9] flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{isRestoring ? 'Restoring...' : 'Restore Backup'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadBackup}
                className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-xs uppercase font-bold text-[#0A0E17] flex items-center gap-2 transition-colors shadow-lg shadow-[#38BDF8]/20"
              >
                <Download className="w-4 h-4" />
                <span>Download JSON Backup</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0F172A] border border-[#1E293B] space-y-2">
              <span className="text-xs uppercase font-bold text-[#10B981] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero-Loss Atomic Writes</span>
              </span>
              <p className="text-xs text-[#94A3B8] font-body leading-relaxed">
                Every API mutation writes through an atomic temporary buffer before swapping, completely eliminating corrupted state on crashes or sudden server restarts.
              </p>
            </div>

            <div className="p-4 bg-[#0F172A] border border-[#1E293B] space-y-2">
              <span className="text-xs uppercase font-bold text-[#38BDF8] flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                <span>MongoDB Enterprise Ready</span>
              </span>
              <p className="text-xs text-[#94A3B8] font-body leading-relaxed">
                The storage driver architecture matches document database schemas, allowing plug-and-play migration to MongoDB Atlas simply by setting <code className="text-[#38BDF8]">MONGODB_URI</code> in <code className="text-[#38BDF8]">server/.env</code>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
