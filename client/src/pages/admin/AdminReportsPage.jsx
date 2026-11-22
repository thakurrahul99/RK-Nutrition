import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { 
  BarChart3, 
  PieChart, 
  CreditCard, 
  RefreshCw,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminReportsPage() {
  const [reports, setReports] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    setIsLoading(true);
    const res = await apiRequest('/store/reports');
    if (res.success && res.reports) {
      setReports(res.reports);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  if (isLoading || !reports) {
    return (
      <div className="py-20 text-center font-mono text-xs text-[#8C8C8C] flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-[#E11D2E]" />
        <span>Compiling Store Performance Metrics...</span>
      </div>
    );
  }

  const avgOrderValue = reports.totalOrders > 0 ? reports.totalRevenue / reports.totalOrders : 0;
  const codShare = reports.totalOrders > 0 ? Math.round((reports.codOrders / reports.totalOrders) * 100) : 0;
  const prepaidShare = reports.totalOrders > 0 ? 100 - codShare : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E11D2E]">
            <BarChart3 className="w-4 h-4" />
            <span>Store Intelligence</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F5F4F2] tracking-tight mt-1">
            Sales & Performance Reports
          </h1>
          <p className="text-xs text-[#8C8C8C] mt-1 font-body">
            Real order metrics, settlement distribution, category popularity, and supply replenishment alerts.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReports}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-xs font-mono text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#141414] border border-[#242424]">
          <span className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider block">Total Gross Sales</span>
          <span className="font-heading font-black text-2xl sm:text-3xl text-[#4CAF50] block mt-1">
            {formatCurrency(reports.totalRevenue)}
          </span>
          <span className="text-[10px] font-mono text-[#666666]">Settled revenue</span>
        </div>

        <div className="p-5 bg-[#141414] border border-[#242424]">
          <span className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider block">Total Orders</span>
          <span className="font-heading font-black text-2xl sm:text-3xl text-[#F5F4F2] block mt-1">
            {reports.totalOrders}
          </span>
          <span className="text-[10px] font-mono text-[#666666]">{reports.completedOrders} Delivered</span>
        </div>

        <div className="p-5 bg-[#141414] border border-[#242424]">
          <span className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider block">Avg Order Value (AOV)</span>
          <span className="font-heading font-black text-2xl sm:text-3xl text-[#F5F4F2] block mt-1">
            {formatCurrency(avgOrderValue)}
          </span>
          <span className="text-[10px] font-mono text-[#666666]">Per cart checkout</span>
        </div>

        <div className="p-5 bg-[#141414] border border-[#242424]">
          <span className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider block">Prepaid Ratio</span>
          <span className="font-heading font-black text-2xl sm:text-3xl text-[#2196F3] block mt-1">
            {prepaidShare}%
          </span>
          <span className="text-[10px] font-mono text-[#666666]">{codShare}% COD redemptions</span>
        </div>
      </div>

      {/* Breakdown Grid: Payment split + Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods Split */}
        <div className="p-6 bg-[#141414] border border-[#242424] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#202020]">
            <h2 className="font-heading text-sm uppercase font-bold text-[#F5F4F2] tracking-wider">
              Payment Method Breakdown
            </h2>
            <CreditCard className="w-4 h-4 text-[#E11D2E]" />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#F5F4F2]">Prepaid (UPI / Cards):</span>
                <span className="text-[#38BDF8] font-bold">{reports.prepaidOrders} orders ({prepaidShare}%)</span>
              </div>
              <div className="h-2 w-full bg-[#1C1C1C] overflow-hidden">
                <div 
                  className="h-full bg-[#38BDF8] transition-all duration-500"
                  style={{ width: `${prepaidShare}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#F5F4F2]">Cash On Delivery (COD):</span>
                <span className="text-[#EAB308] font-bold">{reports.codOrders} orders ({codShare}%)</span>
              </div>
              <div className="h-2 w-full bg-[#1C1C1C] overflow-hidden">
                <div 
                  className="h-full bg-[#EAB308] transition-all duration-500"
                  style={{ width: `${codShare}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#111111] border border-[#202020] text-[11px] font-mono text-[#8C8C8C] leading-relaxed">
            Prepaid orders minimize return-to-origin (RTO) costs and secure upfront working capital.
          </div>
        </div>

        {/* Category Performance */}
        <div className="p-6 bg-[#141414] border border-[#242424] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#202020]">
            <h2 className="font-heading text-sm uppercase font-bold text-[#F5F4F2] tracking-wider">
              Category Volume Distribution
            </h2>
            <PieChart className="w-4 h-4 text-[#E11D2E]" />
          </div>

          <div className="space-y-3">
            {[
              { label: 'Whey Protein', count: reports.categorySales?.protein || 0, color: '#E11D2E' },
              { label: 'Mass Gainers', count: reports.categorySales?.['mass-gainer'] || 0, color: '#EAB308' },
              { label: 'Pre-Workout & Energy', count: reports.categorySales?.['pre-workout'] || 0, color: '#2196F3' }
            ].map((cat) => (
              <div key={cat.label} className="p-3 bg-[#111111] border border-[#202020] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="font-heading text-xs uppercase font-bold text-[#F5F4F2]">{cat.label}</span>
                </div>
                <span className="font-mono text-xs font-bold text-[#F5F4F2]">{cat.count} units sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Replenishment Matrix */}
      {reports.lowStockProducts && reports.lowStockProducts.length > 0 && (
        <div className="p-6 bg-[#141414] border border-[#242424] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#202020]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#E11D2E] font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Critical Inventory Warning</span>
            </div>
            <Link 
              to="/admin/inventory"
              className="text-xs font-mono uppercase text-[#E11D2E] hover:underline flex items-center gap-1"
            >
              <span>Restock Matrix</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {reports.lowStockProducts.map((p) => (
              <div key={p.id} className="p-4 bg-[#111111] border border-[#E11D2E]/30 space-y-1">
                <span className="font-heading font-bold uppercase text-xs text-[#F5F4F2] block truncate">{p.name}</span>
                <span className="font-mono text-[10px] text-[#8C8C8C] block">SKU: {p.sku}</span>
                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-[#8C8C8C] font-mono">Stock: <strong className="text-[#E11D2E] font-bold">{p.stock}</strong></span>
                  <span className="text-[#666666] font-mono">Alert: {p.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
