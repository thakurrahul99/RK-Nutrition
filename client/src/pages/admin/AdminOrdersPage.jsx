import { useState, useEffect, useMemo } from 'react';
import { apiRequest } from '../../services/api';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { useConfirmation } from '../../context/ConfirmationContext';
import { 
  ClipboardList, 
  Search, 
  Eye, 
  Truck, 
  Printer, 
  X, 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  RefreshCw,
  Trash2
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { showToast } = useContent();
  const { logActivity } = useAuth();
  const { confirm } = useConfirmation();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Selected Order for Modal / Details
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);
  const [trackingForm, setTrackingForm] = useState({ carrier: '', trackingNumber: '', estimatedDelivery: '' });
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    const res = await apiRequest('/orders?limit=1000');
    if (res.success && Array.isArray(res.orders)) {
      setOrders(res.orders);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    let est = order.tracking?.estimatedDelivery || '';
    if (est && est.includes('T')) {
      est = est.split('T')[0];
    }
    setTrackingForm({
      carrier: order.tracking?.carrier || 'Delhivery',
      trackingNumber: order.tracking?.trackingNumber || '',
      estimatedDelivery: est
    });
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);

    const res = await apiRequest(`/orders/${selectedOrder.id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus: newStatus })
    });

    if (res.success && res.order) {
      setSelectedOrder(res.order);
      setOrders((prev) => prev.map((o) => (o.id === res.order.id ? res.order : o)));
      showToast(`Order #${selectedOrder.id} status updated to ${newStatus}.`, 'success');
      logActivity(`Updated Order #${selectedOrder.id} status to ${newStatus}`, 'orders');
    } else {
      showToast(res.error || 'Failed to update order status.', 'error');
    }
    setIsUpdatingStatus(false);
  };

  const handleUpdatePaymentStatus = async (newPaymentStatus) => {
    if (!selectedOrder) return;
    const res = await apiRequest(`/orders/${selectedOrder.id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ paymentStatus: newPaymentStatus })
    });

    if (res.success && res.order) {
      setSelectedOrder(res.order);
      setOrders((prev) => prev.map((o) => (o.id === res.order.id ? res.order : o)));
      showToast(`Payment status updated to ${newPaymentStatus}.`, 'success');
      logActivity(`Updated Order #${selectedOrder.id} payment status to ${newPaymentStatus}`, 'orders');
    }
  };

  const handleSaveTracking = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdatingTracking(true);

    const res = await apiRequest(`/orders/${selectedOrder.id}/tracking`, {
      method: 'PUT',
      body: JSON.stringify(trackingForm)
    });

    if (res.success && res.order) {
      setSelectedOrder(res.order);
      setOrders((prev) => prev.map((o) => (o.id === res.order.id ? res.order : o)));
      showToast(`Tracking saved for Order #${selectedOrder.id}.`, 'success');
      logActivity(`Updated shipping tracking for Order #${selectedOrder.id} (${trackingForm.carrier}: ${trackingForm.trackingNumber})`, 'orders');
    } else {
      showToast(res.error || 'Failed to update tracking.', 'error');
    }
    setIsUpdatingTracking(false);
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmed = await confirm({
      title: `Delete Order #${orderId}?`,
      message: 'Are you sure you want to permanently delete this order record? This action cannot be undone.',
      confirmText: 'Delete Order',
      cancelText: 'Keep Order',
      variant: 'danger',
      icon: Trash2
    });
    if (!confirmed) return;

    const res = await apiRequest(`/orders/${orderId}`, {
      method: 'DELETE'
    });

    if (res.success) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
      showToast(`Order #${orderId} deleted permanently.`, 'info');
      logActivity(`Deleted order #${orderId}`, 'orders');
    } else {
      showToast(res.error || 'Failed to delete order.', 'error');
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.email?.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q) ||
        o.tracking?.trackingNumber?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || o.orderStatus?.toLowerCase() === statusFilter.toLowerCase();
      const matchesPayment = paymentFilter === 'all' || o.paymentMethod?.toLowerCase() === paymentFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E11D2E]">
            <ClipboardList className="w-4 h-4" />
            <span>Customer Logistics</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F5F4F2] tracking-tight mt-1">
            Orders & Shipping Fulfillment
          </h1>
          <p className="text-xs text-[#8C8C8C] mt-1 font-body">
            Review customer orders, update delivery pipeline status, assign tracking numbers, and print invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-xs font-mono text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-[#242424] p-4">
          <span className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider block">Total Orders</span>
          <span className="font-heading font-black text-2xl text-[#F5F4F2] block mt-1">{orders.length}</span>
          <span className="text-[10px] font-mono text-[#666666]">Lifetime volume</span>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-4">
          <span className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider block">Pending / Processing</span>
          <span className="font-heading font-black text-2xl text-[#EAB308] block mt-1">
            {orders.filter((o) => o.orderStatus === 'PENDING' || o.orderStatus === 'CONFIRMED').length}
          </span>
          <span className="text-[10px] font-mono text-[#666666]">Requires packing</span>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-4">
          <span className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider block">Shipped / In Transit</span>
          <span className="font-heading font-black text-2xl text-[#2196F3] block mt-1">
            {orders.filter((o) => o.orderStatus === 'SHIPPED').length}
          </span>
          <span className="text-[10px] font-mono text-[#666666]">With courier</span>
        </div>

        <div className="bg-[#141414] border border-[#242424] p-4">
          <span className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider block">Delivered</span>
          <span className="font-heading font-black text-2xl text-[#4CAF50] block mt-1">
            {orders.filter((o) => o.orderStatus === 'DELIVERED').length}
          </span>
          <span className="text-[10px] font-mono text-[#666666]">Successfully closed</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, customer name, phone, or tracking..."
            className="w-full bg-[#141414] border border-[#242424] focus:border-[#E11D2E] focus:outline-none pl-9 pr-4 py-2 text-xs text-[#F5F4F2] placeholder-[#555555]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#141414] border border-[#242424] text-xs font-mono text-[#F5F4F2] px-3 py-2 focus:border-[#E11D2E] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-[#141414] border border-[#242424] text-xs font-mono text-[#F5F4F2] px-3 py-2 focus:border-[#E11D2E] focus:outline-none"
          >
            <option value="all">All Payment Methods</option>
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="upi">UPI</option>
            <option value="card">Cards</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#141414] border border-[#242424] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#242424] bg-[#111111] text-[#8C8C8C] font-mono uppercase text-[11px] tracking-wider">
              <th className="py-3 px-4">Order ID & Date</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Order Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202020]">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[#666666] font-mono">
                  No customer orders match your search criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const totalItemsCount = (order.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0);

                let statusBadge;
                switch (order.orderStatus) {
                  case 'DELIVERED':
                    statusBadge = <span className="px-2 py-0.5 bg-[#4CAF50]/10 border border-[#4CAF50]/30 text-[#4CAF50] font-mono text-[10px] uppercase font-bold">Delivered</span>;
                    break;
                  case 'SHIPPED':
                    statusBadge = <span className="px-2 py-0.5 bg-[#2196F3]/10 border border-[#2196F3]/30 text-[#2196F3] font-mono text-[10px] uppercase font-bold">Shipped</span>;
                    break;
                  case 'CONFIRMED':
                    statusBadge = <span className="px-2 py-0.5 bg-[#EAB308]/10 border border-[#EAB308]/30 text-[#EAB308] font-mono text-[10px] uppercase font-bold">Confirmed</span>;
                    break;
                  case 'CANCELLED':
                    statusBadge = <span className="px-2 py-0.5 bg-[#E11D2E]/10 border border-[#E11D2E]/30 text-[#E11D2E] font-mono text-[10px] uppercase font-bold">Cancelled</span>;
                    break;
                  default:
                    statusBadge = <span className="px-2 py-0.5 bg-[#EAB308]/10 border border-[#EAB308]/30 text-[#EAB308] font-mono text-[10px] uppercase">Pending</span>;
                }

                return (
                  <tr key={order.id} className="hover:bg-[#181818] transition-colors">
                    {/* Order ID & Date */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-[#F5F4F2] text-xs">
                        {order.id}
                      </div>
                      <div className="font-mono text-[10px] text-[#666666] mt-0.5">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div className="font-heading font-bold uppercase text-[#F5F4F2]">
                        {order.customer?.name || 'Customer'}
                      </div>
                      <div className="font-mono text-[10px] text-[#8C8C8C]">
                        {order.customer?.phone} • {order.customer?.city}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs text-[#F5F4F2]">
                        {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                      </div>
                      <div className="font-mono text-[10px] text-[#8C8C8C] truncate max-w-[140px]">
                        {order.items?.map((it) => it.name).join(', ')}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3 px-4 font-mono font-bold text-sm text-[#F5F4F2]">
                      {formatCurrency(order.total)}
                    </td>

                    {/* Payment */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs font-semibold text-[#F5F4F2]">
                        {order.paymentMethod}
                      </div>
                      <div className={`font-mono text-[10px] ${order.paymentStatus === 'PAID' ? 'text-[#4CAF50]' : 'text-[#EAB308]'}`}>
                        {order.paymentStatus}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {statusBadge}
                      {order.tracking?.trackingNumber && (
                        <div className="font-mono text-[10px] text-[#2196F3] mt-1 flex items-center gap-1">
                          <Truck className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[120px]">{order.tracking.carrier || 'AWB'}: {order.tracking.trackingNumber}</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openOrderDetails(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] hover:border-[#E11D2E]/60 text-xs font-mono text-[#F5F4F2] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#E11D2E]" />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order.id)}
                          title="Delete Order"
                          className="p-1.5 bg-[#1C1C1C] hover:bg-[#E11D2E]/20 border border-[#2D2D2D] hover:border-[#E11D2E]/60 text-[#8C8C8C] hover:text-[#E11D2E] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl bg-[#141414] border border-[#2E2E2E] p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#1C1C1C] border border-[#2D2D2D] flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-[#E11D2E]" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold uppercase text-[#F5F4F2]">
                    Order #{selectedOrder.id}
                  </h3>
                  <span className="font-mono text-[10px] text-[#8C8C8C]">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(true)}
                  className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-xs font-mono text-[#F5F4F2] flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-[#E11D2E]" />
                  <span>Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  title="Delete Order"
                  className="px-2.5 py-1.5 bg-[#1C1C1C] hover:bg-[#E11D2E]/20 border border-[#2D2D2D] hover:border-[#E11D2E]/60 text-xs font-mono text-[#E11D2E] flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#1E1E1E]"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="py-6 space-y-6 overflow-y-auto pr-1">
              {/* Order Status Pipeline */}
              <div className="p-4 bg-[#111111] border border-[#242424]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C8C8C] block mb-2">
                  Order Status Pipeline
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={isUpdatingStatus || selectedOrder.orderStatus === st}
                      onClick={() => handleUpdateStatus(st)}
                      className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all border ${
                        selectedOrder.orderStatus === st
                          ? 'bg-[#E11D2E] border-[#E11D2E] text-[#F5F4F2] font-bold shadow-lg shadow-[#E11D2E]/20'
                          : 'bg-[#181818] border-[#2A2A2A] text-[#8C8C8C] hover:text-[#F5F4F2] hover:border-[#444444]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                {selectedOrder.orderStatus === 'CANCELLED' && (
                  <div className="mt-3 p-3 bg-[#2B1416] border border-[#852229] text-xs font-mono text-red-300 flex flex-wrap items-center justify-between gap-2">
                    <span>
                      This order was cancelled {selectedOrder.cancelledBy ? `by ${selectedOrder.cancelledBy}` : ''}
                      {selectedOrder.cancelledAt ? ` on ${new Date(selectedOrder.cancelledAt).toLocaleString()}` : ''}.
                    </span>
                    <span className="font-bold uppercase tracking-wider text-red-400">Inventory Restored</span>
                  </div>
                )}
              </div>

              {/* Customer and Delivery details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Details */}
                <div className="p-4 bg-[#111111] border border-[#242424] space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#E11D2E] font-bold block">
                    Customer Information
                  </span>
                  <div className="text-sm font-heading font-bold uppercase text-[#F5F4F2]">
                    {selectedOrder.customer?.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#A0A0A0]">
                    <Phone className="w-3.5 h-3.5 text-[#666666]" />
                    <span>{selectedOrder.customer?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#A0A0A0]">
                    <Mail className="w-3.5 h-3.5 text-[#666666]" />
                    <span>{selectedOrder.customer?.email}</span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="p-4 bg-[#111111] border border-[#242424] space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#E11D2E] font-bold block">
                    Shipping Destination
                  </span>
                  <div className="flex items-start gap-2 text-xs font-body text-[#A0A0A0] leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-[#666666] shrink-0 mt-0.5" />
                    <div>
                      <p>{selectedOrder.customer?.address}</p>
                      <p className="font-mono text-[#F5F4F2] mt-0.5">
                        {selectedOrder.customer?.city}, {selectedOrder.customer?.state || 'India'} — {selectedOrder.customer?.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-[#242424] bg-[#111111]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181818] border-b border-[#242424] text-[10px] font-mono uppercase text-[#8C8C8C]">
                    <tr>
                      <th className="p-3">Item Formulation</th>
                      <th className="p-3">Variant</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202020]">
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3">
                          <span className="font-heading font-bold uppercase text-[#F5F4F2] block">{item.name}</span>
                          <span className="font-mono text-[10px] text-[#666666]">SKU: {item.sku}</span>
                        </td>
                        <td className="p-3 font-mono text-[#A0A0A0]">{item.variant || 'Standard'}</td>
                        <td className="p-3 font-mono text-center text-[#F5F4F2]">{item.quantity}</td>
                        <td className="p-3 font-mono text-right text-[#A0A0A0]">{formatCurrency(item.price)}</td>
                        <td className="p-3 font-mono text-right font-bold text-[#F5F4F2]">{formatCurrency(item.itemTotal || (item.price * item.quantity))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals & Payment Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* Payment summary */}
                <div className="p-4 bg-[#111111] border border-[#242424] space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C8C8C] block">
                    Payment Status
                  </span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#8C8C8C]">Method:</span>
                    <span className="font-heading font-bold text-[#F5F4F2] uppercase">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#8C8C8C]">Status:</span>
                    <span className={`font-mono font-bold ${selectedOrder.paymentStatus === 'PAID' ? 'text-[#4CAF50]' : 'text-[#EAB308]'}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdatePaymentStatus('PAID')}
                      className="px-2.5 py-1 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-[10px] font-mono text-[#4CAF50]"
                    >
                      Mark Paid
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdatePaymentStatus('PENDING')}
                      className="px-2.5 py-1 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-[10px] font-mono text-[#EAB308]"
                    >
                      Mark Pending
                    </button>
                  </div>
                </div>

                {/* Totals */}
                <div className="p-4 bg-[#111111] border border-[#242424] space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-[#8C8C8C]">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-[#4CAF50]">
                      <span>Discount ({selectedOrder.couponCode || 'Promo'}):</span>
                      <span>-{formatCurrency(selectedOrder.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#8C8C8C]">
                    <span>Shipping Fee:</span>
                    <span>{selectedOrder.shippingFee === 0 ? 'FREE' : formatCurrency(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="pt-2 border-t border-[#242424] flex justify-between text-sm font-heading font-bold text-[#F5F4F2] uppercase">
                    <span>Grand Total:</span>
                    <span className="text-[#E11D2E] font-mono font-black">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Tracking Update Form */}
              <form onSubmit={handleSaveTracking} className="p-4 bg-[#111111] border border-[#242424] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#E11D2E] uppercase font-bold">
                    <Truck className="w-4 h-4" />
                    <span>Carrier & Dispatch Tracking</span>
                  </div>
                  {selectedOrder.tracking?.trackingNumber && (
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#2196F3]/10 border border-[#2196F3]/30 text-[#2196F3]">
                      Synced & Dispatched
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#8C8C8C] mb-1">Carrier Name</label>
                    <input
                      type="text"
                      value={trackingForm.carrier}
                      onChange={(e) => setTrackingForm({ ...trackingForm, carrier: e.target.value })}
                      placeholder="e.g. Delhivery, BlueDart, DTDC"
                      className="w-full bg-[#181818] border border-[#2C2C2C] px-3 py-1.5 text-xs text-[#F5F4F2] focus:border-[#E11D2E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#8C8C8C] mb-1">Tracking Number / AWB</label>
                    <input
                      type="text"
                      value={trackingForm.trackingNumber}
                      onChange={(e) => setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })}
                      placeholder="e.g. DEL-9876543210"
                      className="w-full bg-[#181818] border border-[#2C2C2C] px-3 py-1.5 text-xs text-[#F5F4F2] focus:border-[#E11D2E] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#8C8C8C] mb-1">Estimated Delivery</label>
                    <input
                      type="date"
                      value={trackingForm.estimatedDelivery}
                      onChange={(e) => setTrackingForm({ ...trackingForm, estimatedDelivery: e.target.value })}
                      className="w-full bg-[#181818] border border-[#2C2C2C] px-3 py-1.5 text-xs text-[#F5F4F2] focus:border-[#E11D2E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingTracking}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E11D2E] hover:bg-[#AC1721] text-xs font-heading uppercase tracking-wider text-[#F5F4F2] font-bold transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isUpdatingTracking ? 'Saving...' : 'Update Tracking'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-white text-black p-8 shadow-2xl relative max-h-[95vh] overflow-y-auto">
            {/* Action Bar for Print / Close */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-300 print:hidden">
              <span className="font-mono text-xs uppercase font-bold text-gray-500">Official Tax Invoice View</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-[#E11D2E] text-white font-mono text-xs uppercase font-bold hover:bg-[#AC1721]"
                >
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-800 font-mono text-xs uppercase hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Letterhead */}
            <div className="flex justify-between items-start pb-6 border-b border-gray-200">
              <div>
                <img 
                  src="/images/RK%20Nutrition%20Logo.png" 
                  alt="RK Nutrition" 
                  className="h-10 w-auto object-contain mb-1.5" 
                />
                <p className="text-xs text-gray-680 font-mono mt-0.5">High Performance Athletic Formulations</p>
                <p className="text-xs text-gray-500 font-mono mt-1">A12–16, Main Patpad Ganj Industrial Area, Delhi – 110092, India</p>
                <p className="text-xs text-gray-500 font-mono">Kuldeeprajput5262@gmail.com • +91 86306 63134 • +91 74520 13333</p>
              </div>
              <div className="text-right">
                <div className="text-base font-bold font-mono">INVOICE</div>
                <div className="text-xs font-mono text-gray-600">#{selectedOrder.id}</div>
                <div className="text-xs font-mono text-gray-500 mt-1">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 py-6 border-b border-gray-200 text-xs">
              <div>
                <span className="font-bold text-gray-500 uppercase block mb-1">Billed & Shipped To:</span>
                <p className="font-bold text-gray-900">{selectedOrder.customer?.name}</p>
                <p className="text-gray-600">{selectedOrder.customer?.address}</p>
                <p className="text-gray-600">{selectedOrder.customer?.city}, {selectedOrder.customer?.state} — {selectedOrder.customer?.pincode}</p>
                <p className="text-gray-600 mt-1">Phone: {selectedOrder.customer?.phone}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-500 uppercase block mb-1">Payment & Logistics:</span>
                <p className="text-gray-700">Method: <strong className="uppercase">{selectedOrder.paymentMethod}</strong></p>
                <p className="text-gray-700">Payment Status: <strong>{selectedOrder.paymentStatus}</strong></p>
                {selectedOrder.tracking?.trackingNumber && (
                  <p className="text-gray-700 mt-1">Carrier: {selectedOrder.tracking.carrier} ({selectedOrder.tracking.trackingNumber})</p>
                )}
              </div>
            </div>

            {/* Line Items */}
            <table className="w-full text-left text-xs my-6 border-collapse">
              <thead>
                <tr className="border-b border-gray-300 font-mono uppercase text-gray-600">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Variant</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedOrder.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-bold text-gray-800">{item.name}</td>
                    <td className="py-2.5 text-gray-600">{item.variant || 'Standard'}</td>
                    <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono">{formatCurrency(item.price)}</td>
                    <td className="py-2.5 text-right font-mono font-bold">{formatCurrency(item.itemTotal || (item.price * item.quantity))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations */}
            <div className="flex justify-end pt-4 border-t border-gray-300">
              <div className="w-64 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount:</span>
                    <span>-{formatCurrency(selectedOrder.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>{selectedOrder.shippingFee === 0 ? 'FREE' : formatCurrency(selectedOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-400">
                  <span>Total Payable:</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-200 text-center text-[11px] text-gray-500 font-mono">
              Thank you for choosing RK Nutrition. All formulations are genuine, verified, and manufactured under strict GMP compliance.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
