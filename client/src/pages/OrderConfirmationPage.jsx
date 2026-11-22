import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  Truck, 
  ArrowRight, 
  Printer, 
  AlertCircle 
} from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);

  const handleLookup = async (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/public/${encodeURIComponent(orderId)}?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to verify order details.');
      }
      setOrder(data.order);
    } catch (err) {
      setError(err.message || 'Unable to verify order details.');
    } finally {
      setLoading(false);
    }
  };


  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3 font-mono text-xs uppercase tracking-widest text-[#8C8C8C]">
          <div className="w-8 h-8 border-2 border-[#E11D2E] border-t-transparent animate-spin mx-auto" />
          <p>Verifying Order Confirmation...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#161616] border border-[#262626] p-6 sm:p-8 space-y-5">
          <div className="text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-[#E11D2E] mx-auto" />
            <h1 className="font-heading text-xl uppercase tracking-wider text-[#F5F4F2] font-bold">
              Verify Your Order
            </h1>
            <p className="text-sm text-[#8C8C8C] leading-relaxed">
              For privacy, enter the phone number used at checkout to view this order confirmation.
            </p>
          </div>
          {error && (
            <div className="p-3 bg-[#E11D2E]/10 border border-[#E11D2E]/40 text-sm text-[#F5F4F2]" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleLookup} className="space-y-4">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
              Checkout Phone Number
              <input
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                required
                minLength={10}
                className="mt-2 w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#E11D2E] focus:outline-none px-3 py-3 text-sm text-[#F5F4F2]"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E11D2E] hover:bg-[#AC1721] disabled:opacity-50 text-[#F5F4F2] font-heading uppercase text-xs tracking-widest font-bold transition-colors"
            >
              {loading ? 'Verifying…' : 'View Order'}
            </button>
          </form>
          <Link to="/" className="block text-center text-xs text-[#8C8C8C] hover:text-white">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const { customer, items = [] } = order;

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      
      {/* 1. Header Banner */}
      <div className="bg-[#141414] border border-[#242424] p-6 sm:p-8 text-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#E11D2E]/10 rounded-bl-full pointer-events-none" />
        
        <div className="w-16 h-16 bg-[#181818] border border-[#2E2E2E] flex items-center justify-center mx-auto text-[#22C55E]">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E11D2E] font-bold">
            Order Confirmed // Ready For Dispatch
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl text-[#F5F4F2] uppercase font-black tracking-tight">
            Thank You, {customer?.name?.split(' ')[0] || 'Athlete'}!
          </h1>
          <p className="text-xs sm:text-sm text-[#8C8C8C] font-body max-w-md mx-auto">
            Your official RK Nutrition formulation order has been received and queued for physical warehouse fulfilment.
          </p>
        </div>

        {/* Order Reference Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-[#1A1A1A] border border-[#2E2E2E] px-4 py-2 text-xs font-mono">
          <span className="text-[#888888]">Order ID:</span>
          <strong className="text-[#F5F4F2] tracking-wider">{order.id}</strong>
          <span className="text-[#444444]">|</span>
          <span className="text-[#888888]">Status:</span>
          <span className="text-emerald-400 font-bold uppercase">{order.orderStatus}</span>
          <span className="text-[#444444]">|</span>
          <span className="text-[#888888]">Payment:</span>
          <span className="text-[#F5F4F2] font-semibold">{order.paymentMethod} ({order.paymentStatus})</span>
        </div>
      </div>

      {/* 2. Order Breakdown Card */}
      <div className="bg-[#141414] border border-[#242424] p-6 sm:p-8 space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <h2 className="font-heading font-bold text-lg uppercase tracking-wider text-[#F5F4F2] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#E11D2E]" />
            Ordered Items ({items.length})
          </h2>
          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Items Table */}
        <div className="space-y-4 divide-y divide-[#1C1C1C]">
          {items.map((item, idx) => (
            <div key={idx} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 bg-[#1A1A1A] border border-[#2E2E2E] shrink-0 overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-heading font-black text-sm text-[#444]">RK</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-bold text-sm text-[#F5F4F2] uppercase truncate">
                    {item.name}
                  </h3>
                  {item.variant && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#E11D2E] block">
                      {item.variant}
                    </span>
                  )}
                  <span className="text-xs font-mono text-[#8C8C8C]">
                    Qty: {item.quantity} × {formatCurrency(item.price)}
                  </span>
                </div>
              </div>

              <div className="font-heading font-bold text-sm text-[#F5F4F2] text-right shrink-0">
                {formatCurrency(item.total || item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="pt-6 border-t border-[#222222] space-y-2 text-xs font-mono">
          <div className="flex justify-between text-[#8C8C8C]">
            <span>Items Subtotal</span>
            <span className="text-[#F5F4F2]">{formatCurrency(order.subtotal)}</span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-[#22C55E]">
              <span>Coupon Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-[#8C8C8C]">
            <span>Shipping</span>
            {order.shippingFee === 0 ? (
              <span className="text-[#22C55E] uppercase font-bold">Free</span>
            ) : (
              <span className="text-[#F5F4F2]">{formatCurrency(order.shippingFee)}</span>
            )}
          </div>

          <div className="flex justify-between items-baseline pt-3 border-t border-[#262626] text-base">
            <span className="font-heading uppercase font-bold text-[#F5F4F2] tracking-wider">
              Total Amount
            </span>
            <span className="font-heading font-black text-2xl text-[#F5F4F2] tracking-tight">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

      </div>

      {/* 3. Delivery & Dispatch Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Shipping Address */}
        <div className="bg-[#141414] border border-[#242424] p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E11D2E] font-bold">
            <MapPin className="w-4 h-4" />
            <span>Delivery Destination</span>
          </div>
          <div className="space-y-1 text-xs text-[#CCCCCC] font-body leading-relaxed">
            <p className="font-bold text-sm text-[#F5F4F2] font-heading uppercase">{customer?.name}</p>
            <p>{customer?.address}</p>
            <p>{customer?.city}, {customer?.state} - {customer?.pincode}</p>
            <div className="pt-2 flex flex-col gap-1 text-[#8C8C8C] font-mono text-[11px]">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#E11D2E]" />
                {customer?.phone}
              </span>
              {customer?.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#E11D2E]" />
                  {customer?.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Fulfillment & Courier Info */}
        <div className="bg-[#141414] border border-[#242424] p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E11D2E] font-bold">
            <Truck className="w-4 h-4" />
            <span>Courier & Tracking</span>
          </div>
          <div className="space-y-2 text-xs text-[#8C8C8C] font-body">
            <p>
              Estimated delivery: <strong className="text-[#F5F4F2]">3 - 5 Business Days</strong> across all pan-India metropolitan routes.
            </p>
            <div className="p-3 bg-[#1A1A1A] border border-[#282828] text-[11px] font-mono text-[#AAAAAA] space-y-1">
              <span className="text-[#F5F4F2] font-semibold block uppercase">Tracking Updates</span>
              Tracking details will be transmitted to <strong className="text-[#F5F4F2]">{customer?.phone}</strong> upon warehouse barcode scan.
            </div>
          </div>
        </div>

      </div>

      {/* Order Assistance & Direct Help */}
      <div className="bg-[#141414] border border-[#242424] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-[#E11D2E] font-bold block">
            Order Assistance Desk
          </span>
          <p className="text-sm font-heading uppercase font-bold text-[#F5F4F2]">
            Questions about Order #{order.id}?
          </p>
          <p className="text-xs text-[#8C8C8C] font-body">
            Call <a href="tel:+918630663134" className="text-[#F5F4F2] hover:text-[#E11D2E] font-mono font-bold">+91 86306 63134</a> / <a href="tel:+917452013333" className="text-[#F5F4F2] hover:text-[#E11D2E] font-mono font-bold">+91 74520 13333</a> or Email <a href="mailto:Kuldeeprajput5262@gmail.com" className="text-[#F5F4F2] hover:text-[#E11D2E] font-mono font-bold">Kuldeeprajput5262@gmail.com</a>
          </p>
        </div>
        <a
          href={`https://wa.me/918630663134?text=${encodeURIComponent(`Hi RK Nutrition, I have a question regarding my Order #${order.id}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-heading uppercase tracking-wider font-bold transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-[#25D366]/20"
        >
          <span>WhatsApp Support</span>
        </a>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#222222]">
        <Link
          to="/"
          className="text-xs font-mono uppercase tracking-wider text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
        >
          Return to Homepage
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="sm:hidden flex-1 py-3 bg-[#1A1A1A] text-[#F5F4F2] font-mono uppercase text-xs tracking-wider border border-[#2E2E2E]"
          >
            Print
          </button>
          
          <Link
            to="/products"
            className="flex-1 sm:flex-initial px-6 py-3.5 bg-[#E11D2E] hover:bg-[#AC1721] text-[#F5F4F2] font-heading uppercase text-xs tracking-widest font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#E11D2E]/20"
          >
            <span>Explore More Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
