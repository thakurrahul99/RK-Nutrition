import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Truck, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  ShoppingBag,
  Info,
  User as UserIcon,
  Plus,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    appliedCoupon,
    couponError,
    couponLoading,
    applyCoupon,
    removeCoupon,
    clearCart,
    validateCartPayments
  } = useCart();

  const { user, isAuthenticated, addAddress } = useAuth();

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: ''
  });

  const [selectedAddressId, setSelectedAddressId] = useState('custom');
  const [saveAddressToAccount, setSaveAddressToAccount] = useState(false);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD');
  
  // Mixed-Cart Payment Validation State
  const [paymentValidation, setPaymentValidation] = useState({
    loading: true,
    codAllowed: true,
    codBlockedReason: null,
    allowedMethods: ['COD', 'UPI', 'CARD'],
    isGatewayReady: false,
    gatewayWarning: null
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Auto-fill user contact info & saved address if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));

      // If user has saved addresses and none selected yet, pick default
      if (Array.isArray(user.addresses) && user.addresses.length > 0 && selectedAddressId === 'custom') {
        const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setFormData((prev) => ({
            ...prev,
            name: defaultAddr.fullName || prev.name || user.name || '',
            phone: defaultAddr.phone || prev.phone || user.phone || '',
            address: defaultAddr.addressLine1 + (defaultAddr.addressLine2 ? ', ' + defaultAddr.addressLine2 : ''),
            city: defaultAddr.city || '',
            state: defaultAddr.state || '',
            pincode: defaultAddr.postalCode || ''
          }));
        }
      }
    }
  }, [user, selectedAddressId]);

  const handleSelectAddress = (addr) => {
    if (addr === 'custom') {
      setSelectedAddressId('custom');
      setFormData((prev) => ({
        ...prev,
        address: '',
        city: '',
        state: '',
        pincode: ''
      }));
    } else {
      setSelectedAddressId(addr.id);
      setFormData((prev) => ({
        ...prev,
        name: addr.fullName || prev.name,
        phone: addr.phone || prev.phone,
        address: addr.addressLine1 + (addr.addressLine2 ? ', ' + addr.addressLine2 : ''),
        city: addr.city,
        state: addr.state,
        pincode: addr.postalCode
      }));
      setErrors({});
    }
  };

  // Validate mixed-cart payment capabilities
  useEffect(() => {
    let isMounted = true;
    async function checkRules() {
      if (items.length === 0) return;
      const res = await validateCartPayments();
      if (isMounted && res) {
        setPaymentValidation({
          loading: false,
          codAllowed: res.codAllowed !== false,
          codBlockedReason: res.codBlockedReason || null,
          allowedMethods: res.allowedMethods || ['COD'],
          isGatewayReady: Boolean(res.isGatewayReady),
          gatewayWarning: res.gatewayWarning || null
        });

        // If COD not allowed, select an alternative or first allowed method
        if (!res.codAllowed && selectedPaymentMethod === 'COD') {
          const firstAllowed = res.allowedMethods?.find((m) => m !== 'COD') || 'UPI';
          setSelectedPaymentMethod(firstAllowed);
        }
      }
    }
    checkRules();
    return () => {
      isMounted = false;
    };
  }, [items, validateCartPayments, selectedPaymentMethod]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    
    // Phone: Indian 10-digit number
    const phoneClean = formData.phone.replace(/\D/g, '');
    if (!phoneClean || phoneClean.length < 10) {
      errs.phone = 'Valid 10-digit mobile number required';
    }

    // Email
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Valid email address required';
    }

    if (!formData.address.trim()) errs.address = 'Street address / delivery location required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State / Province is required';

    // PIN code: 6 digits
    const pinClean = formData.pincode.replace(/\D/g, '');
    if (!pinClean || pinClean.length !== 6) {
      errs.pincode = 'Valid 6-digit PIN code required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCouponApply = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = await applyCoupon(couponCodeInput.trim());
    if (res.success) {
      setCouponCodeInput('');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!validateForm()) {
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    // Check payment gateway readiness for online payments
    if (selectedPaymentMethod !== 'COD' && !paymentValidation.isGatewayReady) {
      setSubmitError(
        'Online payment gateway integration is currently in Test / Configuration mode by Super Admin. Direct online card/UPI captures will be enabled in production release. Please select Cash on Delivery or contact store for direct transfer.'
      );
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          notes: formData.notes.trim()
        },
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variant?.id || null,
          variantName: item.variant?.name || 'Standard',
          quantity: item.quantity
        })),
        paymentMethod: selectedPaymentMethod,
        couponCode: appliedCoupon?.code || null
      };

      const data = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!data.success || !data.order) {
        throw new Error(data.error || 'Failed to place order.');
      }

      // If requested, save this address to customer account
      if (isAuthenticated && saveAddressToAccount && selectedAddressId === 'custom') {
        try {
          await addAddress({
            fullName: formData.name.trim(),
            phone: formData.phone.trim(),
            addressLine1: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            postalCode: formData.pincode.trim(),
            country: 'India',
            isDefault: (user?.addresses || []).length === 0
          });
        } catch (e) {
          console.warn('Failed to save address after order:', e);
        }
      }

      // Clear cart on successful placement
      clearCart();

      // Redirect to confirmation page
      navigate(`/order-confirmation/${data.order.id}`);
    } catch (err) {
      setSubmitError(err.message || 'An unexpected error occurred while placing your order.');
      setSubmitting(false);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-[#161616] border border-[#262626] p-8 text-center space-y-5">
          <div className="w-16 h-16 bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center mx-auto text-[#666666]">
            <ShoppingBag className="w-8 h-8 text-[#E11D2E]" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-2xl uppercase tracking-wider text-[#F5F4F2] font-black">
              Your Cart Is Empty
            </h1>
            <p className="text-xs text-[#8C8C8C] font-body leading-relaxed">
              You haven't added any athletic formulations to your cart yet. Explore our supplements to begin checkout.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#E11D2E] hover:bg-[#AC1721] text-[#F5F4F2] font-heading uppercase text-xs tracking-widest font-bold transition-colors"
          >
            <span>Explore Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Breadcrumb & Trust Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#222222]">
        <Link
          to="/products"
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>

        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-[#8C8C8C]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            256-Bit SSL Encrypted
          </span>
          <span className="text-[#333333]">|</span>
          <span className="flex items-center gap-1.5 text-[#CCCCCC]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E11D2E]" />
            Official Direct Dispatch
          </span>
        </div>
      </div>

      {/* Main Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column (7 cols): Customer & Shipping Information */}
        <div className="lg:col-span-7 space-y-8">
          
          {submitError && (
            <div className="p-4 bg-red-950/40 border border-red-800/80 text-red-200 text-xs font-mono flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-red-300 uppercase tracking-wider">Checkout Notice</strong>
                {submitError}
              </div>
            </div>
          )}

          {/* Guest Sign-In Banner */}
          {!isAuthenticated && (
            <div className="p-4 bg-[#181818] border border-[#2E2E2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-body shadow-sm">
              <div className="flex items-center gap-2.5 text-[#F5F4F2]">
                <UserIcon className="w-4 h-4 text-[#E11D2E] shrink-0" />
                <span>
                  Already an RK Nutrition athlete? <strong className="text-white">Sign in</strong> for express checkout with saved delivery addresses.
                </span>
              </div>
              <Link
                to="/login?redirect=/checkout"
                className="px-3.5 py-1.5 bg-[#E11D2E] hover:bg-[#D51F32] text-white text-xs font-mono uppercase tracking-wider font-bold whitespace-nowrap text-center transition-colors"
              >
                Sign In →
              </Link>
            </div>
          )}

          {/* Mobile Collapsible Order Summary Accordion */}
          <div className="lg:hidden bg-[#161616] border border-[#262626]">
            <button
              type="button"
              onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
              className="w-full p-4 flex items-center justify-between text-left text-xs font-mono uppercase tracking-wider text-[#F5F4F2]"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#E11D2E]" />
                <span>{isMobileSummaryOpen ? 'Hide' : 'Show'} Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#8C8C8C] transition-transform duration-200 ${isMobileSummaryOpen ? 'rotate-180 text-[#E11D2E]' : ''}`} />
              </div>
              <span className="font-heading font-black text-sm text-[#F5F4F2]">
                {formatCurrency(total)}
              </span>
            </button>

            {isMobileSummaryOpen && (
              <div className="p-4 pt-0 border-t border-[#222222] space-y-3">
                <div className="max-h-60 overflow-y-auto divide-y divide-[#202020] pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="pt-2.5 pb-2.5 first:pt-2 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 bg-[#1A1A1A] border border-[#262626] shrink-0 overflow-hidden flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-heading font-bold text-[10px] text-[#444]">RK</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-heading font-bold text-[#F5F4F2] uppercase truncate text-[11px]">
                            {item.name}
                          </p>
                          <span className="text-[10px] font-mono text-[#8C8C8C]">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                      <span className="font-heading font-bold text-xs text-[#F5F4F2] shrink-0">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#202020] text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-[#8C8C8C]">
                    <span>Subtotal</span>
                    <span className="text-[#F5F4F2]">{formatCurrency(subtotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-[#22C55E]">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#8C8C8C]">
                    <span>Delivery</span>
                    <span>{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-6">
            
            {/* Step 1: Customer Contact */}
            <div className="bg-[#141414] border border-[#222222] p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#222222]">
                <span className="w-6 h-6 bg-[#E11D2E] text-[#F5F4F2] font-heading font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="font-heading font-bold text-base uppercase tracking-wider text-[#F5F4F2]">
                  Customer & Delivery Contact
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                    Full Name <span className="text-[#E11D2E]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full bg-[#181818] border ${errors.name ? 'border-[#E11D2E]' : 'border-[#2E2E2E]'} focus:border-[#E11D2E] text-sm text-[#F5F4F2] px-3.5 py-2.5 focus:outline-none`}
                  />
                  {errors.name && <p className="text-[11px] font-mono text-[#E11D2E] mt-1">{errors.name}</p>}
                </div>

                {/* Mobile Phone */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                    Mobile Phone <span className="text-[#E11D2E]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className={`w-full bg-[#181818] border ${errors.phone ? 'border-[#E11D2E]' : 'border-[#2E2E2E]'} focus:border-[#E11D2E] text-sm text-[#F5F4F2] px-3.5 py-2.5 focus:outline-none`}
                  />
                  {errors.phone && <p className="text-[11px] font-mono text-[#E11D2E] mt-1">{errors.phone}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                    Email Address <span className="text-[#E11D2E]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="rahul@example.com"
                    className={`w-full bg-[#181818] border ${errors.email ? 'border-[#E11D2E]' : 'border-[#2E2E2E]'} focus:border-[#E11D2E] text-sm text-[#F5F4F2] px-3.5 py-2.5 focus:outline-none`}
                  />
                  {errors.email && <p className="text-[11px] font-mono text-[#E11D2E] mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-[#141414] border border-[#222222] p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#222222]">
                <span className="w-6 h-6 bg-[#E11D2E] text-[#F5F4F2] font-heading font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="font-heading font-bold text-base uppercase tracking-wider text-[#F5F4F2]">
                  Shipping Address
                </h2>
              </div>

              {/* Saved Address Book Selection if authenticated & has addresses */}
              {isAuthenticated && Array.isArray(user?.addresses) && user.addresses.length > 0 && (
                <div className="space-y-3 pb-3 border-b border-[#222222]">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#A3A3A3] block">
                    Choose Delivery Address:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr)}
                        className={`p-3.5 border cursor-pointer transition-all text-xs font-body ${
                          selectedAddressId === addr.id
                            ? 'border-[#E11D2E] bg-[#1C1415] text-[#F5F4F2]'
                            : 'border-[#2E2E2E] bg-[#181818] text-[#8C8C8C] hover:border-[#444444]'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-1">
                          <span className="font-heading uppercase font-bold text-sm text-[#F5F4F2]">
                            {addr.fullName}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#E11D2E] text-white font-bold">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] truncate">{addr.addressLine1}</p>
                        <p className="text-[11px] truncate">
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-[10px] font-mono text-[#777777] pt-1">
                          Ph: +91 {addr.phone}
                        </p>
                      </div>
                    ))}

                    <div
                      onClick={() => handleSelectAddress('custom')}
                      className={`p-3.5 border border-dashed cursor-pointer transition-all text-xs font-body flex items-center justify-center gap-2 ${
                        selectedAddressId === 'custom'
                          ? 'border-[#E11D2E] bg-[#1C1415] text-[#F5F4F2]'
                          : 'border-[#2E2E2E] bg-[#181818] text-[#8C8C8C] hover:border-[#444444]'
                      }`}
                    >
                      <Plus className="w-4 h-4 text-[#E11D2E]" />
                      <span className="font-mono uppercase text-xs">Different Delivery Address</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Street Address */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                    Address / Building / Landmark <span className="text-[#E11D2E]">*</span>
                  </label>
                  <textarea
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House/Flat number, Street name, Landmark"
                    className={`w-full bg-[#181818] border ${errors.address ? 'border-[#E11D2E]' : 'border-[#2E2E2E]'} focus:border-[#E11D2E] text-sm text-[#F5F4F2] px-3.5 py-2.5 focus:outline-none font-body`}
                  />
                  {errors.address && <p className="text-[11px] font-mono text-[#E11D2E] mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                      City <span className="text-[#E11D2E]">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Mumbai"
                      className={`w-full bg-[#181818] border ${errors.city ? 'border-[#E11D2E]' : 'border-[#2E2E2E]'} focus:border-[#E11D2E] text-sm text-[#F5F4F2] px-3.5 py-2.5 focus:outline-none`}
                    />
                    {errors.city && <p className="text-[11px] font-mono text-[#E11D2E] mt-1">{errors.city}</p>}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                      State <span className="text-[#E11D2E]">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Maharashtra"
                      className={`w-full bg-[#181818] border ${errors.state ? 'border-[#E11D2E]' : 'border-[#2E2E2E]'} focus:border-[#E11D2E] text-sm text-[#F5F4F2] px-3.5 py-2.5 focus:outline-none`}
                    />
                    {errors.state && <p className="text-[11px] font-mono text-[#E11D2E] mt-1">{errors.state}</p>}
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                      PIN Code <span className="text-[#E11D2E]">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit PIN"
                      className={`w-full bg-[#181818] border ${errors.pincode ? 'border-[#E11D2E]' : 'border-[#2E2E2E]'} focus:border-[#E11D2E] text-sm text-[#F5F4F2] px-3.5 py-2.5 focus:outline-none font-mono`}
                    />
                    {errors.pincode && <p className="text-[11px] font-mono text-[#E11D2E] mt-1">{errors.pincode}</p>}
                  </div>
                </div>

                {/* Delivery Notes */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8C8C8C] mb-1.5">
                    Order Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Ring doorbell, deliver during morning hours"
                    className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#E11D2E] text-xs text-[#F5F4F2] px-3.5 py-2 focus:outline-none"
                  />
                </div>

                {/* Save Address to Account Checkbox */}
                {isAuthenticated && selectedAddressId === 'custom' && (
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#8C8C8C] select-none font-body">
                      <input
                        type="checkbox"
                        checked={saveAddressToAccount}
                        onChange={(e) => setSaveAddressToAccount(e.target.checked)}
                        className="w-4 h-4 bg-[#111111] border border-[#2E2E2E] rounded accent-[#E11D2E] cursor-pointer"
                      />
                      <span>Save this shipping address to my account for future orders</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-[#141414] border border-[#222222] p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#E11D2E] text-[#F5F4F2] font-heading font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <h2 className="font-heading font-bold text-base uppercase tracking-wider text-[#F5F4F2]">
                    Payment Method
                  </h2>
                </div>

                <span className="text-[10px] font-mono uppercase text-[#8C8C8C]">
                  Select Option
                </span>
              </div>

              {/* Mixed Cart Notice if COD blocked */}
              {!paymentValidation.codAllowed && paymentValidation.codBlockedReason && (
                <div className="p-3 bg-amber-950/30 border border-amber-800/60 text-amber-300 text-xs font-mono flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-200 uppercase tracking-wider">Mixed-Cart Restriction</strong>
                    {paymentValidation.codBlockedReason}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {/* 1. Cash on Delivery (COD) */}
                <label
                  className={`flex items-start gap-3 p-4 border transition-all cursor-pointer ${
                    !paymentValidation.codAllowed
                      ? 'bg-[#101010] border-[#1C1C1C] opacity-50 cursor-not-allowed'
                      : selectedPaymentMethod === 'COD'
                      ? 'bg-[#1C1515] border-[#E11D2E]'
                      : 'bg-[#181818] border-[#2A2A2A] hover:border-[#3D3D3D]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    disabled={!paymentValidation.codAllowed}
                    checked={selectedPaymentMethod === 'COD'}
                    onChange={() => setSelectedPaymentMethod('COD')}
                    className="mt-1 accent-[#E11D2E]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-sm uppercase tracking-wider text-[#F5F4F2] flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#E11D2E]" />
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] font-mono text-[#8C8C8C] uppercase">
                        Pay upon receipt
                      </span>
                    </div>
                    <p className="text-xs text-[#8C8C8C] mt-1 font-body">
                      Pay with cash or UPI directly to the courier agent when your package arrives at your doorstep.
                    </p>
                    {!paymentValidation.codAllowed && (
                      <span className="inline-block mt-2 text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-950/50 px-2 py-0.5 border border-amber-800/40">
                        Not eligible for this cart combination
                      </span>
                    )}
                  </div>
                </label>

                {/* 2. UPI / QR (Online) */}
                <label
                  className={`flex items-start gap-3 p-4 border transition-all cursor-pointer ${
                    selectedPaymentMethod === 'UPI'
                      ? 'bg-[#1C1515] border-[#E11D2E]'
                      : 'bg-[#181818] border-[#2A2A2A] hover:border-[#3D3D3D]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={selectedPaymentMethod === 'UPI'}
                    onChange={() => setSelectedPaymentMethod('UPI')}
                    className="mt-1 accent-[#E11D2E]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-sm uppercase tracking-wider text-[#F5F4F2] flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[#E11D2E]" />
                        Instant UPI / QR Code
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase">
                        Zero Fee
                      </span>
                    </div>
                    <p className="text-xs text-[#8C8C8C] mt-1 font-body">
                      Instant verification via Google Pay, PhonePe, Paytm, or BHIM UPI app.
                    </p>
                    {!paymentValidation.isGatewayReady && selectedPaymentMethod === 'UPI' && (
                      <div className="mt-2.5 p-2.5 bg-[#1C1C1C] border border-amber-800/50 text-[11px] font-mono text-amber-300">
                        Notice: Online payment gateway is currently in Test / Configuration mode. Choose COD for instant order placement or contact store support.
                      </div>
                    )}
                  </div>
                </label>

                {/* 3. Cards / NetBanking */}
                <label
                  className={`flex items-start gap-3 p-4 border transition-all cursor-pointer ${
                    selectedPaymentMethod === 'CARD'
                      ? 'bg-[#1C1515] border-[#E11D2E]'
                      : 'bg-[#181818] border-[#2A2A2A] hover:border-[#3D3D3D]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={selectedPaymentMethod === 'CARD'}
                    onChange={() => setSelectedPaymentMethod('CARD')}
                    className="mt-1 accent-[#E11D2E]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-sm uppercase tracking-wider text-[#F5F4F2] flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#E11D2E]" />
                        Credit / Debit Card / Net Banking
                      </span>
                      <span className="text-[10px] font-mono text-[#8C8C8C] uppercase">
                        Visa / MC / RuPay
                      </span>
                    </div>
                    <p className="text-xs text-[#8C8C8C] mt-1 font-body">
                      Secure payment with all major Indian debit/credit cards and net banking portals.
                    </p>
                    {!paymentValidation.isGatewayReady && selectedPaymentMethod === 'CARD' && (
                      <div className="mt-2.5 p-2.5 bg-[#1C1C1C] border border-amber-800/50 text-[11px] font-mono text-amber-300">
                        Notice: Online payment gateway is currently in Test / Configuration mode. Choose COD for instant order placement or contact store support.
                      </div>
                    )}
                  </div>
                </label>
              </div>

            </div>

            {/* Submit Action for Mobile */}
            <div className="lg:hidden pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#E11D2E] hover:bg-[#C81A27] disabled:opacity-50 text-[#F5F4F2] font-heading uppercase text-sm tracking-widest font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#E11D2E]/25 btn-shimmer relative overflow-hidden group/btn active:scale-[0.99] cursor-pointer"
              >
                {submitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span>Place Order • {formatCurrency(total)}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column (5 cols): Order Summary & Final Submission */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#141414] border border-[#222222] p-6 space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <h3 className="font-heading font-bold text-base uppercase tracking-wider text-[#F5F4F2]">
                Order Summary
              </h3>
              <span className="text-xs font-mono text-[#8C8C8C]">
                {items.length} {items.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>

            {/* Items List */}
            <div className="max-h-72 overflow-y-auto space-y-3 divide-y divide-[#1C1C1C] pr-1">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-[#1A1A1A] border border-[#262626] shrink-0 overflow-hidden flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-heading font-bold text-xs text-[#444]">RK</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-[#F5F4F2] uppercase truncate">
                        {item.name}
                      </p>
                      {item.variant && (
                        <span className="text-[10px] font-mono text-[#E11D2E] uppercase block">
                          {item.variant.name}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-[#8C8C8C]">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>

                  <div className="font-heading font-bold text-sm text-[#F5F4F2] shrink-0 text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="pt-2 border-t border-[#222222] space-y-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#181818] border border-[#22C55E]/40 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span className="font-bold text-[#22C55E] uppercase tracking-wider">
                      {appliedCoupon.code}
                    </span>
                    <span className="text-[#888888]">
                      (-{formatCurrency(discountAmount)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[10px] text-[#E11D2E] hover:underline uppercase tracking-wider"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCouponApply} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      placeholder="PROMO CODE"
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#E11D2E] text-xs font-mono pl-9 pr-3 py-2 text-[#F5F4F2] placeholder-[#666666] uppercase focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCodeInput.trim()}
                    className="px-4 py-2 bg-[#222222] hover:bg-[#2C2C2C] disabled:opacity-40 text-xs font-mono uppercase tracking-wider text-[#F5F4F2] border border-[#333333] transition-colors"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] font-mono text-[#E11D2E]">
                  {couponError}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs font-mono pt-3 border-t border-[#222222]">
              <div className="flex justify-between text-[#8C8C8C]">
                <span>Items Subtotal</span>
                <span className="text-[#F5F4F2] font-semibold">{formatCurrency(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-[#22C55E]">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#8C8C8C]">
                <span>Standard Delivery</span>
                {shippingFee === 0 ? (
                  <span className="text-[#22C55E] uppercase font-bold">Free</span>
                ) : (
                  <span className="text-[#F5F4F2]">{formatCurrency(shippingFee)}</span>
                )}
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-[#262626]">
                <span className="font-heading uppercase font-bold text-base text-[#F5F4F2] tracking-wider">
                  Total Payable
                </span>
                <div className="text-right">
                  <span className="font-heading font-black text-2xl text-[#F5F4F2] tracking-tight">
                    {formatCurrency(total)}
                  </span>
                  <span className="block text-[10px] font-mono text-[#666666] uppercase">
                    Inclusive of all taxes
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Action for Desktop */}
            <div className="hidden lg:block pt-3">
              <button
                type="submit"
                form="checkout-form"
                disabled={submitting}
                className="w-full py-4 bg-[#E11D2E] hover:bg-[#C81A27] disabled:opacity-50 text-[#F5F4F2] font-heading uppercase text-sm tracking-widest font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#E11D2E]/25 btn-shimmer relative overflow-hidden group/btn active:scale-[0.99] cursor-pointer"
              >
                {submitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span>Place Order • {formatCurrency(total)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Dispatch Guarantee Box */}
            <div className="p-3 bg-[#111111] border border-[#222222] text-[11px] font-mono text-[#777777] space-y-1">
              <div className="flex items-center gap-1.5 text-[#CCCCCC]">
                <Truck className="w-3.5 h-3.5 text-[#E11D2E]" />
                <span className="font-semibold uppercase tracking-wider">Fast Dispatch Commitment</span>
              </div>
              <p>
                Orders placed before 2:00 PM are dispatched on the same business day with authentic serial tracking.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
