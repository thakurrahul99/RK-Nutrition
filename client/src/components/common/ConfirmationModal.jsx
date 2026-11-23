import { useEffect } from 'react';
import { AlertTriangle, AlertCircle, LogOut, Trash2, X, Loader2 } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Please Confirm',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'info'
  icon = null,
  isLoading = false
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  // Choose icon based on variant or custom icon
  const IconComponent = icon || (variant === 'danger' ? AlertTriangle : AlertCircle);

  // Variant themes
  const variantStyles = {
    danger: {
      accentBar: 'bg-[#E11D2E]',
      iconBg: 'bg-[#E11D2E]/10 border-[#E11D2E]/30 text-[#E11D2E]',
      confirmBtn: 'bg-[#E11D2E] hover:bg-[#C81A27] text-white shadow-lg shadow-[#E11D2E]/20',
      badge: 'border-[#E11D2E]/40 text-[#E11D2E]'
    },
    warning: {
      accentBar: 'bg-amber-500',
      iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      confirmBtn: 'bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/20',
      badge: 'border-amber-500/40 text-amber-400'
    },
    info: {
      accentBar: 'bg-sky-500',
      iconBg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
      confirmBtn: 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20',
      badge: 'border-sky-500/40 text-sky-400'
    }
  };

  const theme = variantStyles[variant] || variantStyles.danger;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
      onClick={() => {
        if (!isLoading) onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-[#141414] border border-[#282828] shadow-2xl relative overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top colored accent indicator */}
        <div className={`h-1 w-full ${theme.accentBar}`} />

        {/* Modal Header & Close */}
        <div className="p-5 sm:p-6 pb-0 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 shrink-0 border flex items-center justify-center ${theme.iconBg}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-[10px] font-mono uppercase tracking-widest block font-bold ${theme.badge}`}>
                Confirmation Required
              </span>
              <h2
                id="confirmation-modal-title"
                className="font-heading text-lg sm:text-xl uppercase font-black tracking-wider text-[#F5F4F2] mt-0.5"
              >
                {title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close confirmation dialog"
            className="p-1 text-[#8C8C8C] hover:text-[#F5F4F2] hover:bg-[#1E1E1E] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Message */}
        <div className="p-5 sm:p-6 pt-3">
          <p
            id="confirmation-modal-description"
            className="font-body text-xs sm:text-sm text-[#A0A0A0] leading-relaxed"
          >
            {message}
          </p>
        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="px-5 sm:px-6 py-4 bg-[#111111] border-t border-[#242424] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2E2E2E] text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer ${theme.confirmBtn}`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export { AlertTriangle, AlertCircle, LogOut, Trash2 };
