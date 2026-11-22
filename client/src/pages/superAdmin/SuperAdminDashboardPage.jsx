import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { apiRequest } from '../../services/api';
import { 
  Terminal, 
  LayoutTemplate, 
  FileCode2, 
  Palette, 
  Compass, 
  Cpu, 
  HardDrive, 
  Activity, 
  ArrowRight,
  Database
} from 'lucide-react';

export default function SuperAdminDashboardPage() {
  const { products } = useProducts();
  const [logs, setLogs] = useState([]);
  const [reports, setReports] = useState(null);

  useEffect(() => {
    async function loadData() {
      const [logsRes, reportsRes] = await Promise.all([
        apiRequest('/content/logs'),
        apiRequest('/store/reports')
      ]);

      if (logsRes.success && Array.isArray(logsRes.logs)) {
        setLogs(logsRes.logs);
      }
      if (reportsRes.success && reportsRes.reports) {
        setReports(reportsRes.reports);
      }
    }
    loadData();
  }, []);

  const DEV_MODULES = [
    {
      title: 'Homepage Composition Engine',
      description: 'Fine-tune hero typography, section order, visibility toggles, and banners.',
      path: '/super-admin/homepage',
      icon: LayoutTemplate,
      badge: 'Landing Layout'
    },
    {
      title: 'Informational Pages & FAQ',
      description: 'Manage About Us story, contact routing, and legal policies.',
      path: '/super-admin/pages',
      icon: FileCode2,
      badge: 'Editorial Copy'
    },
    {
      title: 'Brand Styling & Tokens',
      description: 'Inspect CSS variables, brand hex codes, typography, and watermarks.',
      path: '/super-admin/branding',
      icon: Palette,
      badge: 'Design System'
    },
    {
      title: 'Navigation & URL Registry',
      description: 'Configure header navbar, mobile drawer items, and footer link hierarchy.',
      path: '/super-admin/navigation',
      icon: Compass,
      badge: 'Site Structure'
    },
    {
      title: 'Advanced Config & Secrets',
      description: 'Payment gateway API keys, SMTP mailer settings, GA4 IDs, and maintenance mode.',
      path: '/super-admin/config',
      icon: Cpu,
      badge: 'Server Config'
    },
    {
      title: 'Database & Backups',
      description: 'Download JSON data backups, inspect audit logs, and check storage health.',
      path: '/super-admin/config',
      icon: Database,
      badge: 'Atomic Storage'
    }
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* 1. Developer Console Header */}
      <div className="bg-[#0A0E17] border border-[#1E293B] p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#38BDF8] via-[#0EA5E9] to-transparent" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#38BDF8]">
              <Terminal className="w-4 h-4" />
              <span>Root Technical Console</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl uppercase font-black text-[#F1F5F9] tracking-tight">
              Developer <span className="text-[#38BDF8]">Workspace</span>
            </h1>
            <p className="text-xs text-[#94A3B8] max-w-2xl font-body leading-relaxed">
              Authorized developer interface for RK Nutrition. Controls dynamic homepage layout, brand parameters, page content, payment gateway credentials, and atomic database persistence.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/super-admin/config"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#38BDF8] hover:bg-[#0EA5E9] text-xs uppercase font-bold text-[#0A0E17] transition-colors shadow-lg shadow-[#38BDF8]/20"
            >
              <Cpu className="w-4 h-4" />
              <span>Technical Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. System Status KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#0A0E17] border border-[#1E293B] p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] text-[#64748B] uppercase tracking-wider">Backend Engine</span>
            <Activity className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="mt-2 text-base sm:text-xl font-bold text-[#F1F5F9] truncate">
            Node / Express 5
          </div>
          <div className="mt-1 text-[10px] text-[#10B981]">
            Port 5000 • Active
          </div>
        </div>

        <div className="bg-[#0A0E17] border border-[#1E293B] p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] text-[#64748B] uppercase tracking-wider">Database Storage</span>
            <Database className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="mt-2 text-base sm:text-xl font-bold text-[#F1F5F9] truncate">
            Atomic JSON DB
          </div>
          <div className="mt-1 text-[10px] text-[#94A3B8] truncate">
            server/data/rk_database.json
          </div>
        </div>

        <div className="bg-[#0A0E17] border border-[#1E293B] p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] text-[#64748B] uppercase tracking-wider">Catalog Entities</span>
            <HardDrive className="w-4 h-4 text-[#E11D2E]" />
          </div>
          <div className="mt-2 text-base sm:text-xl font-bold text-[#F1F5F9]">
            {products.length} Products
          </div>
          <div className="mt-1 text-[10px] text-[#94A3B8] truncate">
            {reports ? `${reports.totalOrders} live orders` : 'Loading...'}
          </div>
        </div>

        <div className="bg-[#0A0E17] border border-[#1E293B] p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] text-[#64748B] uppercase tracking-wider">Audit Trail</span>
            <Terminal className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="mt-2 text-base sm:text-xl font-bold text-[#38BDF8]">
            {logs.length} Log Records
          </div>
          <div className="mt-1 text-[10px] text-[#94A3B8]">
            Session logging active
          </div>
        </div>
      </div>

      {/* 3. Developer Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm uppercase font-bold text-[#F1F5F9] tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#38BDF8]" />
            <span>Developer Modules</span>
          </h2>
          <span className="text-xs text-[#64748B]">Super Admin Scope</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEV_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.title}
                to={mod.path}
                className="group p-5 bg-[#0A0E17] hover:bg-[#0F172A] border border-[#1E293B] hover:border-[#38BDF8]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 bg-[#0F172A] border border-[#1E293B] flex items-center justify-center group-hover:border-[#38BDF8]/40 transition-colors">
                      <Icon className="w-4 h-4 text-[#38BDF8]" />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 border bg-[#0F172A] border-[#1E293B] text-[#94A3B8]">
                      {mod.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#F1F5F9] group-hover:text-[#38BDF8] transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed font-body">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs text-[#38BDF8] tracking-wider">
                  <span>Configure</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Live System Logs Snippet */}
      <div className="bg-[#0A0E17] border border-[#1E293B] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
            <h3 className="text-xs uppercase font-bold text-[#F1F5F9] tracking-wider">
              Recent System Audit Logs
            </h3>
          </div>
          <Link to="/super-admin/config" className="text-xs text-[#38BDF8] hover:underline">
            View All Logs →
          </Link>
        </div>

        <div className="space-y-2 text-xs">
          {logs.length === 0 ? (
            <p className="text-[#64748B]">No audit events logged yet.</p>
          ) : (
            logs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-2.5 bg-[#0F172A] border border-[#1E293B] flex items-center justify-between">
                <div className="flex items-center gap-3 truncate">
                  <span className={`px-1.5 py-0.5 text-[9px] uppercase font-bold border ${
                    log.level === 'WARN'
                      ? 'bg-[#EAB308]/10 border-[#EAB308]/30 text-[#EAB308]'
                      : 'bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#38BDF8]'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-[#64748B] text-[10px]">[{log.category}]</span>
                  <span className="text-[#F1F5F9] truncate font-body">{log.message}</span>
                </div>
                <span className="text-[10px] text-[#64748B] shrink-0 ml-4">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
