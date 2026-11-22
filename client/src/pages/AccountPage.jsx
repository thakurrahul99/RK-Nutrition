import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  User, 
  Package, 
  MapPin, 
  Lock, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  Eye, 
  EyeOff, 
  ShoppingBag,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import DocumentMeta from '../components/common/DocumentMeta';

export default function AccountPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const { 
    user, 
    isAuthenticated, 
    isLoading: authLoading, 
    logout, 
    updateProfile, 
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress
  } = useAuth();

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  // Address Modal State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });
  const [addressSubmitting, setAddressSubmitting] = useState(false);
  const [addressError, setAddressError] = useState('');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Security Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=/account', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Sync profile form with current user
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Fetch Customer Orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await apiRequest('/orders/my-orders');
      if (res.success && Array.isArray(res.orders)) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  // Order Filtering
  const filteredOrders = useMemo(() => {
    if (orderFilter === 'ALL') return orders;
    return orders.filter(
      (o) => (o.orderStatus || 'PENDING').toUpperCase() === orderFilter
    );
  }, [orders, orderFilter]);

  // Metric Computations
  const activeOrdersCount = useMemo(() => {
    return orders.filter((o) => 
      ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes((o.orderStatus || '').toUpperCase())
    ).length;
  }, [orders]);

  const savedAddresses = user?.addresses || [];

  // Order Cancellation Handler
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Any deducted inventory will be restored.')) {
      return;
    }

    setCancellingOrderId(orderId);
    try {
      const res = await apiRequest(`/orders/${orderId}/cancel`, {
        method: 'PUT'
      });
      if (res.success) {
        // Refresh orders list
        await fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(res.order);
        }
      } else {
        alert(res.error || 'Failed to cancel order.');
      }
    } catch {
      alert('Unable to cancel order due to a network error.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: user?.name || '',
      phone: user?.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: savedAddresses.length === 0
    });
    setAddressError('');
    setAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'India',
      isDefault: Boolean(addr.isDefault)
    });
    setAddressError('');
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setAddressError('');

    if (!addressForm.fullName.trim()) {
      setAddressError('Recipient full name is required.');
      return;
    }
    const cleanPhone = addressForm.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setAddressError('A valid 10-digit mobile number is required.');
      return;
    }
    if (!addressForm.addressLine1.trim()) {
      setAddressError('Street address / House number is required.');
      return;
    }
    if (!addressForm.city.trim()) {
      setAddressError('City is required.');
      return;
    }
    const cleanPin = addressForm.postalCode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setAddressError('A valid 6-digit PIN code is required.');
      return;
    }

    setAddressSubmitting(true);
    try {
      let res;
      if (editingAddressId) {
        res = await updateAddress(editingAddressId, addressForm);
      } else {
        res = await addAddress(addressForm);
      }

      if (res.success) {
        setAddressModalOpen(false);
      } else {
        setAddressError(res.error || 'Failed to save address.');
      }
    } catch {
      setAddressError('Network error while saving address.');
    } finally {
      setAddressSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm('Are you sure you want to remove this delivery address?')) return;
    await deleteAddress(addrId);
  };

  const handleSetDefaultAddress = async (addrId) => {
    await updateAddress(addrId, { isDefault: true });
  };

  // Profile Update Handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    setProfileSubmitting(true);

    try {
      const res = await updateProfile(profileForm);
      if (res.success) {
        setProfileMessage({ type: 'success', text: 'Personal details updated successfully.' });
      } else {
        setProfileMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
      }
    } catch {
      setProfileMessage({ type: 'error', text: 'Network error occurred while updating profile.' });
    } finally {
      setProfileSubmitting(false);
    }
  };

  // Password Change Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (!passwordForm.currentPassword) {
      setPasswordMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordSubmitting(true);
    try {
      const res = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (res.success) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMessage({ type: 'error', text: res.error || 'Failed to change password.' });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'Network error while updating password.' });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatDate = (iso) => {
    if (!iso) return 'N/A';
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return iso;
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    switch (s) {
      case 'PENDING':
        return <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[10px] font-mono uppercase tracking-wider font-bold">Pending Processing</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-mono uppercase tracking-wider font-bold">Order Confirmed</span>;
      case 'PROCESSING':
        return <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono uppercase tracking-wider font-bold">Packing Formulation</span>;
      case 'SHIPPED':
        return <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-mono uppercase tracking-wider font-bold">Dispatched</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono uppercase tracking-wider font-bold">Delivered</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-mono uppercase tracking-wider font-bold">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 bg-[#222222] text-[#8C8C8C] border border-[#333333] text-[10px] font-mono uppercase tracking-wider">{s}</span>;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#111111]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#E11D2E] animate-spin" />
          <span className="font-mono text-xs uppercase tracking-wider text-[#8C8C8C]">Loading Athlete Profile...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F4F2] py-8 sm:py-12">
      <DocumentMeta 
        title="My Account | RK Nutrition" 
        description="Manage your RK Nutrition athlete profile, track sports nutrition orders, and configure delivery addresses." 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Profile Header */}
        <div className="bg-[#161616] border border-[#262626] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E11D2E] via-[#E52535] to-[#8A141D]" />

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1F1F1F] border-2 border-[#E11D2E] flex items-center justify-center font-heading font-black text-2xl sm:text-3xl text-[#F5F4F2] shadow-lg shadow-[#E11D2E]/10 shrink-0">
              {user.avatarInitials || 'RK'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#F5F4F2]">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 bg-[#E11D2E]/15 border border-[#E11D2E]/40 text-[#E11D2E] text-[10px] font-mono uppercase tracking-wider font-bold">
                  {user.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : user.role === 'CLIENT_ADMIN' ? 'STORE MANAGER' : 'VERIFIED ATHLETE'}
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-[#8C8C8C]">
                {user.email} {user.phone && `• +91 ${user.phone}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2.5 bg-[#1F1F1F] hover:bg-[#252525] border border-[#2E2E2E] hover:border-[#E11D2E] text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-[#E11D2E]" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-[#262626] flex items-center gap-1.5 sm:gap-4 overflow-x-auto pb-px no-scrollbar scroll-smooth">
          {[
            { id: 'overview', label: 'Overview', icon: ShieldCheck },
            { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
            { id: 'addresses', label: `Saved Addresses (${savedAddresses.length})`, icon: MapPin },
            { id: 'profile', label: 'Personal Info', icon: User },
            { id: 'security', label: 'Security', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTab(tab.id)}
                className={`shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 font-heading text-xs sm:text-base uppercase tracking-wider font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#E11D2E] text-[#F5F4F2] bg-[#161616]'
                    : 'border-transparent text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#141414]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E11D2E]' : 'text-[#666666]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-[#161616] border border-[#262626] p-6 space-y-2">
                <div className="flex items-center justify-between text-[#8C8C8C]">
                  <span className="text-xs font-mono uppercase tracking-wider">Total Formulations Ordered</span>
                  <Package className="w-5 h-5 text-[#E11D2E]" />
                </div>
                <div className="font-heading text-3xl sm:text-4xl font-black text-[#F5F4F2]">
                  {orders.length}
                </div>
                <p className="text-[11px] text-[#777777] font-body">Lifetime orders associated with this account</p>
              </div>

              <div className="bg-[#161616] border border-[#262626] p-6 space-y-2">
                <div className="flex items-center justify-between text-[#8C8C8C]">
                  <span className="text-xs font-mono uppercase tracking-wider">Active Shipments</span>
                  <Truck className="w-5 h-5 text-blue-400" />
                </div>
                <div className="font-heading text-3xl sm:text-4xl font-black text-[#F5F4F2]">
                  {activeOrdersCount}
                </div>
                <p className="text-[11px] text-[#777777] font-body">Pending, packing, or in-transit shipments</p>
              </div>

              <div className="bg-[#161616] border border-[#262626] p-6 space-y-2">
                <div className="flex items-center justify-between text-[#8C8C8C]">
                  <span className="text-xs font-mono uppercase tracking-wider">Saved Delivery Addresses</span>
                  <MapPin className="w-5 h-5 text-green-400" />
                </div>
                <div className="font-heading text-3xl sm:text-4xl font-black text-[#F5F4F2]">
                  {savedAddresses.length}
                </div>
                <p className="text-[11px] text-[#777777] font-body">Configured for express one-click checkout</p>
              </div>
            </div>

            {/* Quick Actions & Recent Order Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="bg-[#161616] border border-[#262626] p-6 space-y-4">
                <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F5F4F2] border-b border-[#262626] pb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2.5">
                  <Link
                    to="/products"
                    className="w-full flex items-center justify-between p-3 bg-[#1B1B1B] hover:bg-[#222222] border border-[#2E2E2E] text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShoppingBag className="w-4 h-4 text-[#E11D2E]" />
                      Explore Supplement Catalogue
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#666666]" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setTab('orders')}
                    className="w-full flex items-center justify-between p-3 bg-[#1B1B1B] hover:bg-[#222222] border border-[#2E2E2E] text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-[#E11D2E]" />
                      Track Recent Dispatches
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#666666]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab('addresses')}
                    className="w-full flex items-center justify-between p-3 bg-[#1B1B1B] hover:bg-[#222222] border border-[#2E2E2E] text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-[#E11D2E]" />
                      Manage Saved Addresses
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#666666]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab('security')}
                    className="w-full flex items-center justify-between p-3 bg-[#1B1B1B] hover:bg-[#222222] border border-[#2E2E2E] text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-[#E11D2E]" />
                      Account Credentials & Security
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#666666]" />
                  </button>
                </div>
              </div>

              {/* Most Recent Order Preview */}
              <div className="lg:col-span-2 bg-[#161616] border border-[#262626] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F5F4F2]">
                    Latest Supplement Order
                  </h3>
                  {orders.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setTab('orders')}
                      className="text-xs text-[#E11D2E] hover:underline uppercase font-mono tracking-wider"
                    >
                      View All Orders →
                    </button>
                  )}
                </div>

                {ordersLoading ? (
                  <div className="py-12 text-center text-xs font-mono text-[#8C8C8C]">
                    Fetching order history...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-10 text-center space-y-3">
                    <Package className="w-10 h-10 text-[#444444] mx-auto" />
                    <p className="text-sm text-[#8C8C8C] font-body">You have not placed any supplement orders yet.</p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E11D2E] text-white text-xs font-heading uppercase tracking-wider font-bold"
                    >
                      Start Shopping
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(() => {
                      const latest = orders[0];
                      return (
                        <div className="border border-[#262626] bg-[#121212] p-4 sm:p-5 space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#222222] pb-3">
                            <div>
                              <span className="font-mono text-xs text-[#8C8C8C]">Order Ref:</span>{' '}
                              <span className="font-mono text-sm font-bold text-[#F5F4F2]">{latest.id || `#${latest.orderNumber}`}</span>
                              <span className="text-xs text-[#666666] ml-3">• {formatDate(latest.createdAt)}</span>
                            </div>
                            <div>{getStatusBadge(latest.orderStatus)}</div>
                          </div>

                          <div className="space-y-2">
                            {(latest.items || []).slice(0, 2).map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs py-1">
                                <span className="text-[#CCCCCC] font-body truncate max-w-[280px] sm:max-w-md">
                                  {item.quantity}x {item.name} {item.variant ? `(${item.variant})` : ''}
                                </span>
                                <span className="font-mono text-[#F5F4F2] font-semibold">
                                  {formatCurrency(item.total || item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                            {(latest.items || []).length > 2 && (
                              <p className="text-[11px] text-[#777777] font-mono">
                                + {(latest.items || []).length - 2} more item(s)
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-[#222222]">
                            <span className="text-xs text-[#8C8C8C] uppercase font-mono">Order Total</span>
                            <span className="font-heading text-lg font-bold text-[#E11D2E]">
                              {formatCurrency(latest.total)}
                            </span>
                          </div>

                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(latest)}
                              className="w-full py-2 bg-[#1F1F1F] hover:bg-[#252525] border border-[#2E2E2E] hover:border-[#E11D2E] text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-colors"
                            >
                              View Full Order Details & Timeline
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Official Business Care & Athlete Assistance */}
            <div className="bg-[#161616] border border-[#262626] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E11D2E] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Athlete Care & Order Support</span>
                </div>
                <span className="text-xs font-mono text-[#8C8C8C]">Mon–Sat: 09:00–19:00 IST</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 bg-[#1A1A1A] border border-[#2E2E2E] space-y-1">
                  <span className="text-[#8C8C8C] block uppercase text-[10px]">Calling Support</span>
                  <div className="space-y-0.5">
                    <a href="tel:+918630663134" className="text-[#F5F4F2] hover:text-[#E11D2E] font-bold block">
                      +91 86306 63134
                    </a>
                    <a href="tel:+917452013333" className="text-[#F5F4F2] hover:text-[#E11D2E] font-bold block">
                      +91 74520 13333
                    </a>
                  </div>
                </div>

                <div className="p-3 bg-[#1A1A1A] border border-[#2E2E2E] space-y-1">
                  <span className="text-[#8C8C8C] block uppercase text-[10px]">WhatsApp Fast Desk</span>
                  <a 
                    href="https://wa.me/918630663134?text=Hi%20RK%20Nutrition%2C%20I%20need%20assistance%20with%20my%20account%20or%20orders." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#25D366] hover:underline font-bold block text-sm pt-0.5"
                  >
                    Chat on WhatsApp (8630663134)
                  </a>
                </div>

                <div className="p-3 bg-[#1A1A1A] border border-[#2E2E2E] space-y-1">
                  <span className="text-[#8C8C8C] block uppercase text-[10px]">Official Email</span>
                  <a href="mailto:Kuldeeprajput5262@gmail.com" className="text-[#F5F4F2] hover:text-[#E11D2E] font-bold block break-all pt-0.5">
                    Kuldeeprajput5262@gmail.com
                  </a>
                </div>
              </div>
              <p className="text-[11px] text-[#777777] font-body">
                Marketed by RK Nutrition • A12–16, Main Patpad Ganj Industrial Area, Delhi – 110092, India
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MY ORDERS */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Status Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors whitespace-nowrap cursor-pointer ${
                    orderFilter === st
                      ? 'bg-[#E11D2E] border-[#E11D2E] text-[#F5F4F2] font-bold'
                      : 'bg-[#161616] border-[#2E2E2E] text-[#8C8C8C] hover:text-[#F5F4F2]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Orders Listing */}
            {ordersLoading ? (
              <div className="py-20 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#E11D2E] animate-spin mx-auto" />
                <p className="text-xs font-mono text-[#8C8C8C]">Loading your orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-[#161616] border border-[#262626] p-12 text-center space-y-4">
                <Package className="w-12 h-12 text-[#444444] mx-auto" />
                <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-[#F5F4F2]">
                  No orders found
                </h3>
                <p className="text-xs text-[#8C8C8C] max-w-sm mx-auto font-body">
                  {orderFilter === 'ALL'
                    ? "You haven't placed any supplement orders yet. Start your training journey today."
                    : `No orders currently match status "${orderFilter}".`}
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E11D2E] hover:bg-[#D51F32] text-white text-xs font-heading uppercase tracking-wider font-bold transition-colors"
                >
                  <span>BROWSE SUPPLEMENTS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const canCancel = ['PENDING', 'CONFIRMED'].includes((order.orderStatus || '').toUpperCase());
                  return (
                    <div
                      key={order.id}
                      className="bg-[#161616] border border-[#262626] p-5 sm:p-6 space-y-4 hover:border-[#383838] transition-colors"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242424] pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm sm:text-base font-bold text-[#F5F4F2]">
                              {order.id || `#${order.orderNumber}`}
                            </span>
                            {getStatusBadge(order.orderStatus)}
                          </div>
                          <p className="text-xs text-[#8C8C8C] font-body">
                            Placed on {formatDate(order.createdAt)} • Payment:{' '}
                            <span className="uppercase font-mono text-[#F5F4F2]">{order.paymentMethod}</span> ({order.paymentStatus || 'PENDING'})
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-[#777777] uppercase font-mono block">Order Total</span>
                          <span className="font-heading text-xl sm:text-2xl font-bold text-[#E11D2E]">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-2 py-1">
                        {(order.items || []).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 object-cover bg-[#1A1A1A] border border-[#262626]"
                                />
                              )}
                              <span className="font-body text-[#CCCCCC]">
                                <span className="font-bold text-[#F5F4F2] font-mono mr-1.5">{item.quantity}x</span>
                                {item.name} {item.variant ? <span className="text-[#888888]">({item.variant})</span> : ''}
                              </span>
                            </div>
                            <span className="font-mono text-[#F5F4F2]">
                              {formatCurrency(item.total || item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Shipping info if dispatched */}
                      {order.tracking?.trackingNumber && (
                        <div className="p-3 bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2 text-purple-400">
                            <Truck className="w-4 h-4" />
                            <span>Courier: {order.tracking.carrier || 'Express Logistics'}</span>
                          </div>
                          <span className="text-[#F5F4F2]">
                            Tracking Ref: <span className="font-bold underline">{order.tracking.trackingNumber}</span>
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#242424]">
                        <span className="text-xs text-[#777777] font-body truncate max-w-xs">
                          Delivering to: {order.customer?.name}, {order.customer?.city} - {order.customer?.pincode}
                        </span>

                        <div className="flex items-center gap-2">
                          {canCancel && (
                            <button
                              type="button"
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={cancellingOrderId === order.id}
                              className="px-3.5 py-1.5 bg-[#2B1416] hover:bg-[#3D181B] border border-[#852229] text-red-300 hover:text-red-200 text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50"
                            >
                              {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="px-4 py-1.5 bg-[#1F1F1F] hover:bg-[#252525] border border-[#2E2E2E] hover:border-[#E11D2E] text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SAVED ADDRESSES */}
        {/* ========================================================================= */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-[#F5F4F2]">
                  Delivery Address Book
                </h3>
                <p className="text-xs text-[#8C8C8C] font-body">
                  Save your home, gym, or work delivery locations for instant one-click checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddAddress}
                className="px-4 py-2.5 bg-[#E11D2E] hover:bg-[#D51F32] text-white text-xs font-heading uppercase tracking-wider font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {savedAddresses.length === 0 ? (
              <div className="bg-[#161616] border border-[#262626] p-12 text-center space-y-4">
                <MapPin className="w-12 h-12 text-[#444444] mx-auto" />
                <h4 className="font-heading text-lg uppercase tracking-wider font-bold text-[#F5F4F2]">
                  No delivery addresses saved yet
                </h4>
                <p className="text-xs text-[#8C8C8C] max-w-sm mx-auto font-body">
                  Add your primary delivery address to speed up order processing during checkout.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="px-5 py-2.5 bg-[#1F1F1F] hover:bg-[#252525] border border-[#2E2E2E] hover:border-[#E11D2E] text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-colors"
                >
                  + Add First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-[#161616] border p-5 space-y-4 relative flex flex-col justify-between transition-colors ${
                      addr.isDefault ? 'border-[#E11D2E] shadow-lg shadow-[#E11D2E]/10' : 'border-[#262626] hover:border-[#333333]'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-base font-bold text-[#F5F4F2] uppercase tracking-wider">
                          {addr.fullName}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-[#E11D2E] text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                            DEFAULT
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#A3A3A3] font-body space-y-1 leading-relaxed">
                        <p>{addr.addressLine1}</p>
                        {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                        <p>
                          {addr.city}, {addr.state} - <span className="font-mono text-[#F5F4F2] font-semibold">{addr.postalCode}</span>
                        </p>
                        <p className="text-[#8C8C8C]">{addr.country || 'India'}</p>
                        <p className="pt-1 text-[#F5F4F2] font-mono font-medium">
                          Phone: +91 {addr.phone}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#242424] flex items-center justify-between text-xs font-mono">
                      {!addr.isDefault ? (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[#8C8C8C] hover:text-[#E11D2E] transition-colors"
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Primary Address
                        </span>
                      )}

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditAddress(addr)}
                          className="p-1 text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
                          title="Edit address"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-1 text-[#8C8C8C] hover:text-red-400 transition-colors"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PERSONAL INFO */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-[#161616] border border-[#262626] p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-[#F5F4F2]">
                Personal Profile
              </h3>
              <p className="text-xs text-[#8C8C8C] font-body">
                Update your contact details used for notifications and delivery updates.
              </p>
            </div>

            {profileMessage.text && (
              <div
                className={`p-3.5 text-xs sm:text-sm font-body flex items-start gap-2.5 ${
                  profileMessage.type === 'success'
                    ? 'bg-[#172517] border border-[#2E6030] text-[#86EFAC]'
                    : 'bg-[#2B1416] border border-[#852229] text-[#FFA8AE]'
                }`}
              >
                {profileMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#E11D2E] shrink-0 mt-0.5" />
                )}
                <span>{profileMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                  className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-4 py-3 text-sm text-[#F5F4F2] font-body outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                  className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-4 py-3 text-sm text-[#F5F4F2] font-body outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-4 py-3 text-sm text-[#F5F4F2] font-body outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={profileSubmitting}
                className="py-3 px-6 bg-[#E11D2E] hover:bg-[#D51F32] disabled:bg-[#44181B] text-white font-heading text-sm uppercase tracking-wider font-bold transition-colors flex items-center gap-2 cursor-pointer"
              >
                {profileSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SAVING CHANGES...</span>
                  </>
                ) : (
                  <span>SAVE CHANGES</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SECURITY */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="max-w-2xl bg-[#161616] border border-[#262626] p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-[#F5F4F2]">
                Account Security & Password
              </h3>
              <p className="text-xs text-[#8C8C8C] font-body">
                Ensure your account is protected with a secure and unique password.
              </p>
            </div>

            {passwordMessage.text && (
              <div
                className={`p-3.5 text-xs sm:text-sm font-body flex items-start gap-2.5 ${
                  passwordMessage.type === 'success'
                    ? 'bg-[#172517] border border-[#2E6030] text-[#86EFAC]'
                    : 'bg-[#2B1416] border border-[#852229] text-[#FFA8AE]'
                }`}
              >
                {passwordMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#E11D2E] shrink-0 mt-0.5" />
                )}
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-4 py-3 pr-11 text-sm text-[#F5F4F2] font-body outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#A3A3A3] p-1"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
                  New Password (Min 8 characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-4 py-3 pr-11 text-sm text-[#F5F4F2] font-body outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#A3A3A3] p-1"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A3A3A3]">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-4 py-3 text-sm text-[#F5F4F2] font-body outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={passwordSubmitting}
                className="py-3 px-6 bg-[#E11D2E] hover:bg-[#D51F32] disabled:bg-[#44181B] text-white font-heading text-sm uppercase tracking-wider font-bold transition-colors flex items-center gap-2 cursor-pointer"
              >
                {passwordSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>UPDATING PASSWORD...</span>
                  </>
                ) : (
                  <span>UPDATE PASSWORD</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ORDER DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-[#161616] border border-[#2E2E2E] shadow-2xl relative max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#262626]">
              <div>
                <span className="font-mono text-xs text-[#8C8C8C] uppercase">Order Details</span>
                <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-[#F5F4F2]">
                  {selectedOrder.id || `#${selectedOrder.orderNumber}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close modal"
                className="p-1.5 text-[#8C8C8C] hover:text-[#F5F4F2] bg-[#1F1F1F] border border-[#2E2E2E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* Order Status Progress */}
              <div className="bg-[#111111] border border-[#262626] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#8C8C8C]">Fulfillment Progress</span>
                  {getStatusBadge(selectedOrder.orderStatus)}
                </div>

                {/* Step indicator */}
                {selectedOrder.orderStatus !== 'CANCELLED' ? (
                  <div className="grid grid-cols-4 gap-2 pt-2 text-center">
                    {[
                      { label: 'Placed', active: true },
                      { label: 'Confirmed', active: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes((selectedOrder.orderStatus || '').toUpperCase()) },
                      { label: 'Dispatched', active: ['SHIPPED', 'DELIVERED'].includes((selectedOrder.orderStatus || '').toUpperCase()) },
                      { label: 'Delivered', active: (selectedOrder.orderStatus || '').toUpperCase() === 'DELIVERED' }
                    ].map((step, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className={`h-1.5 ${step.active ? 'bg-[#E11D2E]' : 'bg-[#262626]'}`} />
                        <span className={`text-[10px] font-mono uppercase tracking-wider block ${step.active ? 'text-[#F5F4F2] font-bold' : 'text-[#555555]'}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2.5 bg-[#2B1416] border border-[#852229] text-xs text-red-300 font-body">
                    This order was cancelled on {formatDate(selectedOrder.cancelledAt || selectedOrder.updatedAt)}.
                  </div>
                )}
              </div>

              {/* Courier Tracking if available */}
              {selectedOrder.tracking?.trackingNumber && (
                <div className="bg-[#1B1B1B] border border-[#2E2E2E] p-4 space-y-1 text-xs font-mono">
                  <div className="text-purple-400 font-bold uppercase flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    <span>Courier Consignment Dispatched</span>
                  </div>
                  <p className="text-[#A3A3A3]">
                    Carrier: <span className="text-[#F5F4F2]">{selectedOrder.tracking.carrier || 'Standard Courier'}</span>
                  </p>
                  <p className="text-[#A3A3A3]">
                    Tracking Number: <span className="text-[#F5F4F2] font-bold">{selectedOrder.tracking.trackingNumber}</span>
                  </p>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#8C8C8C]">
                  Formulations Ordered ({selectedOrder.items?.length || 0})
                </h4>
                <div className="space-y-2 border border-[#262626] divide-y divide-[#222222] bg-[#111111]">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover bg-[#1A1A1A] border border-[#262626]"
                          />
                        )}
                        <div>
                          <p className="font-heading text-sm uppercase text-[#F5F4F2] font-bold">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#8C8C8C] font-body">
                            {item.variant ? `Variant: ${item.variant} • ` : ''}Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-[#F5F4F2] font-bold">
                        {formatCurrency(item.total || item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
                {/* Delivery Address */}
                <div className="bg-[#111111] border border-[#262626] p-4 space-y-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8C8C] block">
                    Delivery Address
                  </span>
                  <p className="font-bold text-[#F5F4F2]">{selectedOrder.customer?.name}</p>
                  <p className="text-[#A3A3A3]">{selectedOrder.customer?.address}</p>
                  <p className="text-[#A3A3A3]">
                    {selectedOrder.customer?.city}, {selectedOrder.customer?.state} - {selectedOrder.customer?.pincode}
                  </p>
                  <p className="text-[#8C8C8C] font-mono pt-1">Phone: +91 {selectedOrder.customer?.phone}</p>
                </div>

                {/* Price Breakdown */}
                <div className="bg-[#111111] border border-[#262626] p-4 space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8C8C] block">
                    Payment Breakdown
                  </span>
                  <div className="flex justify-between text-[#A3A3A3]">
                    <span>Subtotal</span>
                    <span className="font-mono text-[#F5F4F2]">{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount {selectedOrder.couponCode ? `(${selectedOrder.couponCode})` : ''}</span>
                      <span className="font-mono">-{formatCurrency(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#A3A3A3]">
                    <span>Shipping</span>
                    <span className="font-mono text-[#F5F4F2]">
                      {selectedOrder.shippingFee === 0 ? 'FREE' : formatCurrency(selectedOrder.shippingFee)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#262626] flex justify-between font-bold text-sm">
                    <span className="text-[#F5F4F2] font-heading uppercase">Total Amount</span>
                    <span className="font-heading text-base text-[#E11D2E]">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#777777] font-mono pt-1">
                    Method: {selectedOrder.paymentMethod} • Status: {selectedOrder.paymentStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#262626] flex items-center justify-between">
              <span className="text-xs text-[#8C8C8C] font-mono">
                Order Placed: {formatDate(selectedOrder.createdAt)}
              </span>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#1F1F1F] hover:bg-[#252525] border border-[#2E2E2E] text-xs font-mono uppercase tracking-wider text-[#F5F4F2]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT ADDRESS MODAL */}
      {/* ========================================================================= */}
      {addressModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-[#161616] border border-[#2E2E2E] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#262626] pb-4 mb-4">
              <h3 className="font-heading text-xl uppercase tracking-wider font-bold text-[#F5F4F2]">
                {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                aria-label="Close dialog"
                className="p-1 text-[#8C8C8C] hover:text-[#F5F4F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addressError && (
              <div 
                role="alert"
                className="mb-4 p-3 bg-[#2B1416] border border-[#852229] text-[#FFA8AE] text-xs flex items-center gap-2 font-body"
              >
                <AlertCircle className="w-4 h-4 text-[#E11D2E] shrink-0" />
                <span>{addressError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-4 font-body">
              <div className="space-y-1">
                <label className="block text-xs font-mono uppercase text-[#A3A3A3]">Recipient Full Name *</label>
                <input
                  type="text"
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  placeholder="Rahul Kumar"
                  required
                  className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-3.5 py-2.5 text-sm text-[#F5F4F2] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono uppercase text-[#A3A3A3]">Mobile Phone Number *</label>
                <input
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="9876543210"
                  required
                  className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-3.5 py-2.5 text-sm text-[#F5F4F2] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono uppercase text-[#A3A3A3]">Address Line 1 (House/Flat, Building, Street) *</label>
                <input
                  type="text"
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  placeholder="Flat 402, Fitness Tower, MG Road"
                  required
                  className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-3.5 py-2.5 text-sm text-[#F5F4F2] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono uppercase text-[#A3A3A3]">Address Line 2 (Area, Landmark)</label>
                <input
                  type="text"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  placeholder="Near Gold's Gym"
                  className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-3.5 py-2.5 text-sm text-[#F5F4F2] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-[#A3A3A3]">City *</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="New Delhi"
                    required
                    className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-3.5 py-2.5 text-sm text-[#F5F4F2] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-[#A3A3A3]">State *</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder="Delhi"
                    required
                    className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-3.5 py-2.5 text-sm text-[#F5F4F2] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-[#A3A3A3]">PIN Code (6 digits) *</label>
                  <input
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    placeholder="110001"
                    maxLength={6}
                    required
                    className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-3.5 py-2.5 text-sm text-[#F5F4F2] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono uppercase text-[#A3A3A3]">Country</label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="w-full bg-[#111111] border border-[#2E2E2E] px-3.5 py-2.5 text-sm text-[#F5F4F2] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#8C8C8C] select-none">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="w-4 h-4 bg-[#111111] border border-[#2E2E2E] rounded accent-[#E11D2E] cursor-pointer"
                  />
                  <span>Set as primary default delivery address</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2.5 bg-[#1F1F1F] hover:bg-[#252525] border border-[#2E2E2E] text-xs font-mono uppercase text-[#F5F4F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressSubmitting}
                  className="px-6 py-2.5 bg-[#E11D2E] hover:bg-[#D51F32] disabled:bg-[#44181B] text-white font-heading text-xs uppercase tracking-wider font-bold flex items-center gap-2"
                >
                  {addressSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <span>{editingAddressId ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
