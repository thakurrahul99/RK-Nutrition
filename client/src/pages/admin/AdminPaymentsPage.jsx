import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { useProducts } from '../../context/ProductContext';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  Save, 
  RefreshCw, 
  HelpCircle,
  Plus,
  Trash2,
  Lock
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const { products } = useProducts();
  const { showToast } = useContent();
  const { logActivity } = useAuth();

  const [methods, setMethods] = useState(null);
  const [gatewayStatus, setGatewayStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Mixed Cart Simulator State
  const [simCartItems, setSimCartItems] = useState([]);
  const [simResult, setSimResult] = useState(null);

  const fetchPaymentData = async () => {
    setIsLoading(true);
    const res = await apiRequest('/payments/methods');
    if (res.success && res.paymentMethods) {
      setMethods(res.paymentMethods);
    }

    const gwRes = await apiRequest('/payments/gateway-config');
    if (gwRes.success && gwRes.gatewayConfig) {
      setGatewayStatus(gwRes.gatewayConfig);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const handleToggleMethod = (methodKey) => {
    if (!methods || !methods[methodKey]) return;
    setMethods((prev) => ({
      ...prev,
      [methodKey]: {
        ...prev[methodKey],
        enabled: !prev[methodKey].enabled
      }
    }));
  };

  const handleMethodFieldChange = (methodKey, field, value) => {
    setMethods((prev) => ({
      ...prev,
      [methodKey]: {
        ...prev[methodKey],
        [field]: value
      }
    }));
  };

  const handleSaveMethods = async () => {
    if (!methods) return;
    setIsSaving(true);

    const res = await apiRequest('/payments/methods', {
      method: 'PUT',
      body: JSON.stringify({ methods })
    });

    if (res.success && res.paymentMethods) {
      setMethods(res.paymentMethods);
      showToast('Store payment methods updated successfully.', 'success');
      logActivity('Updated global payment methods and limits', 'payments');
    } else {
      showToast(res.error || 'Failed to update payment methods.', 'error');
    }
    setIsSaving(false);
  };

  // Mixed Cart Simulator handlers
  const handleAddSimItem = (product) => {
    const existing = simCartItems.find((it) => it.productId === product.id);
    if (existing) {
      setSimCartItems(
        simCartItems.map((it) => (it.productId === product.id ? { ...it, quantity: it.quantity + 1 } : it))
      );
    } else {
      setSimCartItems([
        ...simCartItems,
        {
          productId: product.id,
          name: product.name,
          paymentRule: product.paymentRule || 'ALL',
          quantity: 1
        }
      ]);
    }
  };

  const handleRemoveSimItem = (productId) => {
    setSimCartItems(simCartItems.filter((it) => it.productId !== productId));
  };

  // Evaluate mixed cart whenever simCartItems changes
  useEffect(() => {
    async function evaluateSimCart() {
      if (simCartItems.length === 0) {
        setSimResult(null);
        return;
      }
      const res = await apiRequest('/payments/validate-cart', {
        method: 'POST',
        body: JSON.stringify({
          items: simCartItems.map((it) => ({ productId: it.productId, quantity: it.quantity }))
        })
      });
      if (res.success) {
        setSimResult(res);
      }
    }
    evaluateSimCart();
  }, [simCartItems]);

  if (isLoading || !methods) {
    return (
      <div className="py-20 text-center font-mono text-xs text-[#8C8C8C] flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-[#E11D2E]" />
        <span>Loading Payment Operations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E11D2E]">
            <CreditCard className="w-4 h-4" />
            <span>Financial Operations</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F5F4F2] tracking-tight mt-1">
            Payment Methods & Mixed-Cart Rules
          </h1>
          <p className="text-xs text-[#8C8C8C] mt-1 font-body">
            Configure available customer checkout methods, enforce prepaid-only cart policies, and inspect gateway status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveMethods}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#E11D2E] hover:bg-[#AC1721] text-xs font-heading font-bold uppercase tracking-wider text-[#F5F4F2] transition-colors shadow-lg shadow-[#E11D2E]/20"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Gateway Configuration Status Card */}
      <div className="p-5 bg-[#141414] border border-[#242424] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#8C8C8C] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E11D2E]" />
            <span>Payment Gateway Infrastructure Status</span>
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 border ${
            gatewayStatus?.isConfigured
              ? 'bg-[#4CAF50]/10 border-[#4CAF50]/30 text-[#4CAF50]'
              : 'bg-[#EAB308]/10 border-[#EAB308]/30 text-[#EAB308]'
          }`}>
            {gatewayStatus?.isConfigured ? 'Gateway Active' : 'Configuration Pending'}
          </span>
        </div>

        <p className="text-xs text-[#A0A0A0] leading-relaxed font-body">
          {gatewayStatus?.isConfigured ? (
            <span>Production gateway provider <strong className="text-[#F5F4F2] uppercase">{gatewayStatus.provider}</strong> is verified and active.</span>
          ) : (
            <span>Notice: Online payment gateway credentials (Razorpay/Cashfree/Stripe) are currently pending setup by the Super Admin (Developer). Customers can currently complete checkout using <strong>Cash on Delivery (COD)</strong> or Direct Bank Transfer once verified.</span>
          )}
        </p>

        <div className="text-[11px] font-mono text-[#666666] flex items-center gap-2 pt-2 border-t border-[#202020]">
          <Lock className="w-3.5 h-3.5 text-[#555555]" />
          <span>Gateway API credentials & secret keys are securely managed by Super Admin at <code className="text-[#38BDF8]">/super-admin/config</code>.</span>
        </div>
      </div>

      {/* 1. Global Payment Methods Toggles */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg uppercase font-bold text-[#F5F4F2] tracking-wider">
          Global Checkout Methods
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cash on Delivery (COD) */}
          <div className={`p-5 bg-[#141414] border transition-all ${methods.cod.enabled ? 'border-[#E11D2E]/60 shadow-lg shadow-[#E11D2E]/5' : 'border-[#242424]'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#202020]">
              <span className="font-heading font-bold uppercase text-[#F5F4F2] text-sm">
                Cash On Delivery (COD)
              </span>
              <button
                type="button"
                onClick={() => handleToggleMethod('cod')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer transition-colors duration-200 ease-in-out border-2 border-transparent ${
                  methods.cod.enabled ? 'bg-[#E11D2E]' : 'bg-[#2A2A2A]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform bg-white transition duration-200 ease-in-out ${
                    methods.cod.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-[#8C8C8C] mt-3 font-body leading-relaxed">
              Allow customers to pay via cash or UPI upon home delivery.
            </p>

            <div className="mt-4 space-y-3 pt-3 border-t border-[#202020]">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#666666] mb-1">
                  Extra COD Handling Charge (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={methods.cod.extraFee || 0}
                  onChange={(e) => handleMethodFieldChange('cod', 'extraFee', Number(e.target.value))}
                  className="w-full bg-[#181818] border border-[#2C2C2C] px-3 py-1 text-xs text-[#F5F4F2] font-mono focus:border-[#E11D2E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#666666] mb-1">
                  Maximum COD Order Limit (₹)
                </label>
                <input
                  type="number"
                  min="500"
                  value={methods.cod.maxLimit || 10000}
                  onChange={(e) => handleMethodFieldChange('cod', 'maxLimit', Number(e.target.value))}
                  className="w-full bg-[#181818] border border-[#2C2C2C] px-3 py-1 text-xs text-[#F5F4F2] font-mono focus:border-[#E11D2E] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Instant UPI Payments */}
          <div className={`p-5 bg-[#141414] border transition-all ${methods.upi.enabled ? 'border-[#E11D2E]/60 shadow-lg shadow-[#E11D2E]/5' : 'border-[#242424]'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#202020]">
              <span className="font-heading font-bold uppercase text-[#F5F4F2] text-sm">
                Instant UPI (PhonePe / GPay)
              </span>
              <button
                type="button"
                onClick={() => handleToggleMethod('upi')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer transition-colors duration-200 ease-in-out border-2 border-transparent ${
                  methods.upi.enabled ? 'bg-[#E11D2E]' : 'bg-[#2A2A2A]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform bg-white transition duration-200 ease-in-out ${
                    methods.upi.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-[#8C8C8C] mt-3 font-body leading-relaxed">
              Enable instant digital UPI intent and QR payment at zero extra convenience fee.
            </p>

            <div className="mt-4 pt-3 border-t border-[#202020]">
              <span className="text-[10px] font-mono uppercase text-[#666666] block mb-1">Status:</span>
              <span className="text-xs font-mono text-[#4CAF50]">0% Extra Transaction Fee</span>
            </div>
          </div>

          {/* Credit & Debit Cards */}
          <div className={`p-5 bg-[#141414] border transition-all ${methods.card.enabled ? 'border-[#E11D2E]/60 shadow-lg shadow-[#E11D2E]/5' : 'border-[#242424]'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#202020]">
              <span className="font-heading font-bold uppercase text-[#F5F4F2] text-sm">
                Cards & Net Banking
              </span>
              <button
                type="button"
                onClick={() => handleToggleMethod('card')}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer transition-colors duration-200 ease-in-out border-2 border-transparent ${
                  methods.card.enabled ? 'bg-[#E11D2E]' : 'bg-[#2A2A2A]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform bg-white transition duration-200 ease-in-out ${
                    methods.card.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-[#8C8C8C] mt-3 font-body leading-relaxed">
              Accept all major Visa, MasterCard, RuPay, and American Express cards.
            </p>

            <div className="mt-4 pt-3 border-t border-[#202020]">
              <span className="text-[10px] font-mono uppercase text-[#666666] block mb-1">Security:</span>
              <span className="text-xs font-mono text-[#4CAF50]">PCI-DSS Level 1 Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Mixed-Cart Payment Rule Inspector */}
      <div className="p-6 bg-[#141414] border border-[#242424] space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E11D2E]">
            <HelpCircle className="w-4 h-4" />
            <span>Cart Rule Policy Tester</span>
          </div>
          <h2 className="font-heading text-lg uppercase font-bold text-[#F5F4F2] tracking-wider mt-1">
            Mixed-Cart Payment Simulator
          </h2>
          <p className="text-xs text-[#8C8C8C] mt-1 font-body">
            Test how different product combinations evaluate payment method eligibility. If any item in the cart is tagged as <strong className="text-[#E11D2E]">Prepaid Only</strong>, Cash on Delivery is automatically blocked for the entire order.
          </p>
        </div>

        {/* Product Picker */}
        <div>
          <span className="text-xs font-mono uppercase text-[#8C8C8C] block mb-2">
            Click to add sample product to test cart:
          </span>
          <div className="flex flex-wrap gap-2">
            {products.map((p) => {
              const rule = p.paymentRule || 'ALL';
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleAddSimItem(p)}
                  className="px-3 py-1.5 bg-[#181818] hover:bg-[#202020] border border-[#2A2A2A] hover:border-[#E11D2E]/60 text-xs font-mono text-[#F5F4F2] flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-3 h-3 text-[#E11D2E]" />
                  <span>{p.name}</span>
                  <span className={`text-[10px] px-1 py-0.2 border ${
                    rule === 'PREPAID_ONLY' || rule === 'COD_DISABLED'
                      ? 'border-[#E11D2E] text-[#E11D2E]'
                      : 'border-[#4CAF50] text-[#4CAF50]'
                  }`}>
                    {rule}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Test Cart */}
        <div className="p-4 bg-[#111111] border border-[#242424] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8C8C8C]">
            <span>Current Test Cart ({simCartItems.length} items):</span>
            {simCartItems.length > 0 && (
              <button
                type="button"
                onClick={() => setSimCartItems([])}
                className="text-[#E11D2E] hover:underline"
              >
                Clear Cart
              </button>
            )}
          </div>

          {simCartItems.length === 0 ? (
            <p className="text-xs font-mono text-[#555555] py-2">
              Cart is currently empty. Click one or more products above to test.
            </p>
          ) : (
            <div className="divide-y divide-[#202020]">
              {simCartItems.map((it) => (
                <div key={it.productId} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-heading uppercase font-bold text-[#F5F4F2]">{it.name}</span>
                    <span className="font-mono text-[10px] text-[#8C8C8C]">x{it.quantity}</span>
                    <span className={`text-[10px] font-mono px-1 py-0.2 border ${
                      it.paymentRule === 'PREPAID_ONLY' || it.paymentRule === 'COD_DISABLED'
                        ? 'border-[#E11D2E] text-[#E11D2E]'
                        : 'border-[#4CAF50] text-[#4CAF50]'
                    }`}>
                      Rule: {it.paymentRule}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSimItem(it.productId)}
                    className="text-[#666666] hover:text-[#E11D2E]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evaluation Output */}
        {simResult && (
          <div className="p-4 bg-[#181818] border border-[#2E2E2E] space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#F5F4F2] font-bold block">
              Cart Policy Evaluation Result:
            </span>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-[#8C8C8C]">Allowed Checkout Methods:</span>
              {simResult.allowedMethods?.map((m) => (
                <span key={m} className="px-2.5 py-1 bg-[#4CAF50]/10 border border-[#4CAF50]/30 text-[#4CAF50] font-mono text-xs font-bold uppercase">
                  ✓ {m}
                </span>
              ))}
            </div>

            {/* COD Status */}
            <div className={`p-3 text-xs flex items-start gap-2 border ${
              simResult.codAllowed
                ? 'bg-[#4CAF50]/10 border-[#4CAF50]/30 text-[#A5D6A7]'
                : 'bg-[#E11D2E]/10 border-[#E11D2E]/30 text-[#EF9A9A]'
            }`}>
              {simResult.codAllowed ? (
                <>
                  <Check className="w-4 h-4 text-[#4CAF50] shrink-0 mt-0.5" />
                  <span><strong>Cash on Delivery Eligible:</strong> All items in this cart qualify for COD.</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-[#E11D2E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block uppercase font-bold text-[#F5F4F2]">Cash On Delivery Blocked</strong>
                    <span>{simResult.codBlockedReason}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
