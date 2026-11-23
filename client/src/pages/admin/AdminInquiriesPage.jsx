import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { useConfirmation } from '../../context/ConfirmationContext';
import { 
  MessageSquare, 
  Search, 
  Mail, 
  RefreshCw, 
  X,
  ExternalLink,
  Trash2
} from 'lucide-react';

export default function AdminInquiriesPage() {
  const { showToast } = useContent();
  const { logActivity } = useAuth();
  const { confirm } = useConfirmation();

  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchInquiries = async () => {
    setIsLoading(true);
    const res = await apiRequest('/store/inquiries');
    if (res.success && Array.isArray(res.inquiries)) {
      setInquiries(res.inquiries);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleToggleResolved = async (inq) => {
    const newStatus = inq.status === 'resolved' ? 'new' : 'resolved';
    const res = await apiRequest(`/store/inquiries/${inq.id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    });

    if (res.success && res.inquiry) {
      setInquiries(inquiries.map((i) => (i.id === inq.id ? res.inquiry : i)));
      if (selectedInquiry?.id === inq.id) {
        setSelectedInquiry(res.inquiry);
      }
      showToast(`Inquiry marked ${newStatus === 'resolved' ? 'Resolved' : 'Pending'}.`, 'info');
      logActivity(`Toggled customer inquiry #${inq.id} to ${newStatus}`, 'support');
    }
  };

  const handleDeleteInquiry = async (inq) => {
    const confirmed = await confirm({
      title: 'Delete Customer Inquiry?',
      message: `Permanently delete inquiry message from "${inq.name}"? This record cannot be restored.`,
      confirmText: 'Delete Inquiry',
      cancelText: 'Keep Inquiry',
      variant: 'danger',
      icon: Trash2
    });
    if (!confirmed) return;
    const res = await apiRequest(`/store/inquiries/${inq.id}`, {
      method: 'DELETE'
    });

    if (res.success) {
      setInquiries((prev) => prev.filter((i) => i.id !== inq.id));
      if (selectedInquiry?.id === inq.id) {
        setSelectedInquiry(null);
      }
      showToast('Customer inquiry deleted permanently.', 'info');
      logActivity(`Deleted customer inquiry #${inq.id}`, 'support');
    } else {
      showToast(res.error || 'Failed to delete inquiry.', 'error');
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      inq.name?.toLowerCase().includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.subject?.toLowerCase().includes(q) ||
      inq.message?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E11D2E]">
            <MessageSquare className="w-4 h-4" />
            <span>Support & Communications</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F5F4F2] tracking-tight mt-1">
            Customer Inquiries
          </h1>
          <p className="text-xs text-[#8C8C8C] mt-1 font-body">
            Direct athlete correspondence and messages received through the official contact portal.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchInquiries}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-xs font-mono text-[#8C8C8C] hover:text-[#F5F4F2] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search inquiries by sender, email, subject, or message content..."
          className="w-full bg-[#141414] border border-[#242424] focus:border-[#E11D2E] focus:outline-none pl-9 pr-4 py-2 text-xs text-[#F5F4F2] placeholder-[#555555]"
        />
      </div>

      {/* Inquiries Table */}
      <div className="bg-[#141414] border border-[#242424] overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#242424] bg-[#111111] text-[#8C8C8C] font-mono uppercase text-[11px] tracking-wider">
              <th className="py-3 px-4">Sender & Contact</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Message Snippet</th>
              <th className="py-3 px-4">Received On</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#202020]">
            {filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-[#666666] font-mono">
                  No customer inquiries received yet.
                </td>
              </tr>
            ) : (
              filteredInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-[#181818] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-heading font-bold uppercase text-[#F5F4F2]">{inq.name}</div>
                    <div className="font-mono text-[10px] text-[#8C8C8C] mt-0.5">{inq.email}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-[#F5F4F2] uppercase">
                    {inq.subject || 'General Inquiry'}
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-[#A0A0A0] font-body">
                    {inq.message}
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-[#666666]">
                    {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Recent'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 border text-[10px] font-mono uppercase font-bold ${
                      inq.status === 'resolved'
                        ? 'bg-[#4CAF50]/10 border-[#4CAF50]/30 text-[#4CAF50]'
                        : 'bg-[#EAB308]/10 border-[#EAB308]/30 text-[#EAB308]'
                    }`}>
                      {inq.status === 'resolved' ? 'Resolved' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedInquiry(inq)}
                        className="px-3 py-1 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-xs font-mono text-[#F5F4F2]"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteInquiry(inq)}
                        title="Delete Inquiry"
                        className="p-1.5 bg-[#1C1C1C] hover:bg-[#E11D2E]/20 border border-[#2D2D2D] hover:border-[#E11D2E]/60 text-[#8C8C8C] hover:text-[#E11D2E] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-[#141414] border border-[#2E2E2E] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E11D2E]">
                <MessageSquare className="w-4 h-4" />
                <span>Message Details</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-1 text-[#8C8C8C] hover:text-[#F5F4F2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs font-body">
              <div>
                <span className="font-mono text-[10px] text-[#666666] uppercase block">Sender Name</span>
                <span className="font-heading font-bold text-sm text-[#F5F4F2] uppercase">{selectedInquiry.name}</span>
              </div>

              <div>
                <span className="font-mono text-[10px] text-[#666666] uppercase block">Contact Email</span>
                <a href={`mailto:${selectedInquiry.email}`} className="font-mono text-[#38BDF8] hover:underline flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{selectedInquiry.email}</span>
                </a>
              </div>

              <div>
                <span className="font-mono text-[10px] text-[#666666] uppercase block">Subject</span>
                <span className="font-mono text-xs text-[#F5F4F2] uppercase">{selectedInquiry.subject}</span>
              </div>

              <div>
                <span className="font-mono text-[10px] text-[#666666] uppercase block mb-1">Message Content</span>
                <div className="p-4 bg-[#111111] border border-[#242424] text-[#D5D5D5] leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#242424] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleResolved(selectedInquiry)}
                  className={`px-3 py-1.5 border text-xs font-mono uppercase tracking-wider transition-colors ${
                    selectedInquiry.status === 'resolved'
                      ? 'bg-[#EAB308]/10 border-[#EAB308]/30 text-[#EAB308]'
                      : 'bg-[#4CAF50]/10 border-[#4CAF50]/30 text-[#4CAF50]'
                  }`}
                >
                  {selectedInquiry.status === 'resolved' ? 'Mark as Pending' : 'Mark as Resolved'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteInquiry(selectedInquiry)}
                  className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#E11D2E]/20 border border-[#2D2D2D] hover:border-[#E11D2E]/60 text-xs font-mono uppercase text-[#E11D2E] inline-flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>

              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || 'RK Nutrition Inquiry')}`}
                className="px-4 py-1.5 bg-[#E11D2E] hover:bg-[#AC1721] text-[#F5F4F2] text-xs font-heading uppercase font-bold tracking-wider inline-flex items-center gap-1.5"
              >
                <span>Reply by Email</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
