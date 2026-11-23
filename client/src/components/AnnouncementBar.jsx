import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { brandConfig } from '../config/brandConfig';
import { useContent } from '../context/ContentContext';

export default function AnnouncementBar() {
  const { content, announcement: contextAnnouncement } = useContent();
  const [isDismissed, setIsDismissed] = useState(false);

  // Normalize announcement configuration with safe fallbacks
  const rawAnnouncement = 
    contextAnnouncement ||
    content?.homepage?.banner ||
    content?.announcement ||
    content?.settings?.announcement ||
    brandConfig?.announcement ||
    {};

  const isEnabled = 
    rawAnnouncement.enabled !== undefined 
      ? Boolean(rawAnnouncement.enabled)
      : (rawAnnouncement.isActive !== undefined 
          ? Boolean(rawAnnouncement.isActive) 
          : true);

  const text = 
    rawAnnouncement.text || 
    rawAnnouncement.heading || 
    brandConfig.announcement?.text || 
    'OFFICIAL LAUNCH • 10% OFF ORDERS ABOVE ₹1,999 WITH CODE RK10 • FREE NATIONWIDE SHIPPING';

  const linkHref = 
    rawAnnouncement.linkHref || 
    rawAnnouncement.link || 
    rawAnnouncement.ctaHref || 
    '/products';

  const linkText = 
    rawAnnouncement.linkText || 
    rawAnnouncement.ctaText || 
    'SHOP NOW';

  // Session-based dismiss tracking with text fingerprinting so new announcements reappear
  useEffect(() => {
    try {
      const dismissedText = sessionStorage.getItem('rk_announcement_dismissed_text');
      if (dismissedText === text) {
        setIsDismissed(true);
      } else {
        setIsDismissed(false);
      }
    } catch {
      // ignore storage errors
    }
  }, [text]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('rk_announcement_dismissed_text', text);
    } catch {
      // ignore storage errors
    }
  };

  if (!isEnabled || isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Promotional Announcement"
      className="relative z-50 bg-[#121212] border-b border-[#242424] text-[#F5F4F2] py-2 px-3 sm:px-6 w-full select-none transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 min-w-0">
        
        {/* Centered Message Content */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center min-w-0 overflow-hidden">
          {/* Pulsing indicator */}
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D2E] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D2E]" />
          </span>

          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#F5F4F2]/95 font-medium truncate">
            {text}
          </span>

          {linkHref && (
            <Link
              to={linkHref}
              className="group shrink-0 inline-flex items-center gap-1 text-[11px] sm:text-xs font-heading uppercase font-bold text-[#E11D2E] hover:text-white transition-colors underline underline-offset-4 ml-1"
            >
              <span>{linkText}</span>
              <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement banner"
          className="shrink-0 p-1 text-[#8C8C8C] hover:text-white transition-colors cursor-pointer rounded-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E11D2E]"
        >
          <X className="w-3.5 h-3.5" />
        </button>

      </div>
    </aside>
  );
}
