import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { apiRequest } from '../../services/api';
import { 
  Package, 
  Boxes, 
  ClipboardList, 
  CreditCard, 
  Tag, 
  MessageSquare, 
  BarChart3, 
  Sliders, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { adminUser, recentActivity } = useAuth();
  const { products } = useProducts();
  const [reports, setReports] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      const res = await apiRequest('/store/reports');
      if (res.success && res.reports) {
        setReports(res.reports);
      }
      setIsLoading(false);
    }
    loadReports();
  }, []);

  const lowStockCount = products.filter(
    (p) => typeof p.stock === 'number' && p.stock <= (p.lowStockThreshold || 10)
  ).length;

  const STORE_ACTIONS = [
    {
      title: 'Product Catalog',
      description: 'Add or modify formulations, pricing, variants, and product images.',
      path: '/admin/products',
      icon: Package,
      badge: `${products.length} Products`
    },
    {
      title: 'Inventory & Stock Matrix',
      description: 'Monitor stock levels, set low-stock thresholds, and trigger restocks.',
      path: '/admin/inventory',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} Need Restock` : 'Stock Healthy',
      alert: lowStockCount > 0
    },
    {
      title: 'Customer Orders',
      description: 'Fulfill orders, update delivery tracking numbers, and view invoices.',
      path: '/admin/orders',
      icon: ClipboardList,
      badge: reports ? `${reports.totalOrders} Total Orders` : 'Orders'
    },
    {
      title: 'Payment Rules',
      description: 'Manage COD availability, UPI / Card toggles, and test mixed-cart rules.',
      path: '/admin/payments',
      icon: CreditCard,
      badge: 'Rules Active'
    },
    {
      title: 'Offers & Coupons',
      description: 'Create discount codes, set minimum order requirements, and track usage.',
      path: '/admin/discounts',
      icon: Tag,
      badge: 'Promotions'
    },
    {
      title: 'Customer Inquiries',
      description: 'Review and respond to messages submitted via the website contact desk.',
      path: '/admin/inquiries',
      icon: MessageSquare,
      badge: 'Support Desk'
    },
    {
      title: 'Sales & Revenue Reports',
      description: 'Examine sales volume, payment method distribution, and category breakdowns.',
      path: '/admin/reports',
      icon: BarChart3,
      badge: 'Analytics'
    },
    {
      title: 'Store Settings',
      description: 'Configure standard shipping fees, free shipping order threshold, and GST.',
      path: '/admin/store-settings',
      icon: Sliders,
      badge: 'Logistics'
    }
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-8">
      {/* 1. Welcome & Status Banner */}
      <div className="bg-[#141414] border border-[#242424] p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C8202B] via-[#C8202B]/60 to-transparent" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C8202B]">
              <span className="w-2 h-2 rounded-full bg-[#C8202B] animate-pulse" />
              <span>Client Store Operations</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl uppercase font-black text-[#F5F4F2] tracking-tight">
              Welcome, <span className="text-[#C8202B]">{adminUser?.name || 'Store Owner'}</span>
            </h1>
            <p className="text-sm text-[#8C8C8C] max-w-2xl font-body">
              Manage your products, live inventory, shipping logistics, customer orders, payment rules, and discount promotions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C8202B] hover:bg-[#AC1721] text-xs font-heading font-bold uppercase tracking-wider text-[#F5F4F2] transition-colors shadow-lg shadow-[#C8202B]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Store Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-[#141414] border border-[#242424] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8C8C8C] uppercase tracking-wider">Catalog</span>
            <Package className="w-4 h-4 text-[#C8202B]" />
          </div>
          <div className="mt-2 font-heading font-black text-3xl text-[#F5F4F2]">
            {products.length}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-[#4CAF50]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active Formulations</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#141414] border border-[#242424] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8C8C8C] uppercase tracking-wider">Gross Sales</span>
            <TrendingUp className="w-4 h-4 text-[#4CAF50]" />
          </div>
          <div className="mt-2 font-heading font-black text-3xl text-[#F5F4F2]">
            {isLoading ? '...' : formatCurrency(reports?.totalRevenue || 0)}
          </div>
          <div className="mt-1 text-[11px] font-mono text-[#8C8C8C]">
            From verified orders
          </div>
        </div>

        {/* Orders Pipeline */}
        <div className="bg-[#141414] border border-[#242424] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8C8C8C] uppercase tracking-wider">Orders</span>
            <ClipboardList className="w-4 h-4 text-[#2196F3]" />
          </div>
          <div className="mt-2 font-heading font-black text-3xl text-[#F5F4F2]">
            {isLoading ? '...' : (reports?.totalOrders ?? 0)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-[#EAB308]">
            <Clock className="w-3.5 h-3.5" />
            <span>{reports?.pendingOrders ?? 0} Pending Fulfillment</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-[#141414] border border-[#242424] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8C8C8C] uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockCount > 0 ? 'text-[#C8202B]' : 'text-[#4CAF50]'}`} />
          </div>
          <div className={`mt-2 font-heading font-black text-3xl ${lowStockCount > 0 ? 'text-[#C8202B]' : 'text-[#4CAF50]'}`}>
            {lowStockCount}
          </div>
          <div className="mt-1 text-[11px] font-mono text-[#8C8C8C]">
            {lowStockCount > 0 ? (
              <Link to="/admin/inventory" className="text-[#C8202B] hover:underline">
                Review Restock Needs →
              </Link>
            ) : (
              'All inventory healthy'
            )}
          </div>
        </div>
      </div>

      {/* 3. Store Operations Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg uppercase font-bold text-[#F5F4F2] tracking-wider">
            Store Management Modules
          </h2>
          <span className="text-xs font-mono text-[#666666]">Client Control</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STORE_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.path}
                to={action.path}
                className="group p-5 bg-[#141414] hover:bg-[#181818] border border-[#242424] hover:border-[#C8202B]/60 transition-all flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 bg-[#1C1C1C] border border-[#2D2D2D] flex items-center justify-center group-hover:border-[#C8202B]/40 transition-colors">
                      <Icon className="w-4 h-4 text-[#C8202B]" />
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 border ${
                      action.alert 
                        ? 'bg-[#C8202B]/10 border-[#C8202B]/30 text-[#C8202B]' 
                        : 'bg-[#1D1D1D] border-[#2A2A2A] text-[#8C8C8C]'
                    }`}>
                      {action.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-sm uppercase font-bold text-[#F5F4F2] group-hover:text-[#C8202B] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-[#8C8C8C] mt-1.5 leading-relaxed font-body">
                    {action.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#202020] flex items-center justify-between text-xs font-heading uppercase text-[#C8202B] tracking-wider">
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Recent Store Activity */}
      <div className="bg-[#141414] border border-[#242424] p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#222222]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8202B]" />
            <h3 className="font-heading text-sm uppercase font-bold text-[#F5F4F2] tracking-wider">
              Recent Store Activity
            </h3>
          </div>
          <span className="text-xs font-mono text-[#666666]">Live Log</span>
        </div>

        <div className="divide-y divide-[#202020] space-y-2">
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.slice(0, 6).map((item) => (
              <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[#C5C5C5] font-body">{item.action}</span>
                <span className="font-mono text-[#666666] text-[11px] shrink-0 ml-4">{item.time}</span>
              </div>
            ))
          ) : (
            <p className="text-xs font-mono text-[#666666]">No recent activity recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
