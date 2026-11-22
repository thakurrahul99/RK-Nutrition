import { Link } from 'react-router-dom';
import { brandConfig } from '../config/brandConfig';
import { useContent } from '../context/ContentContext';

export default function AnnouncementBar() {
  const { content } = useContent();
  const announcement = content?.announcement || brandConfig.announcement;

  if (!announcement || !announcement.enabled) return null;

  return (
    <aside 
      aria-label="Announcement"
      className="relative z-50 bg-[#161616] border-b border-[#242424] text-[#F5F4F2] h-8 flex items-center justify-center select-none overflow-hidden w-full max-w-full px-3"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center min-w-0 w-full text-[11px] font-mono uppercase tracking-wider">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E11D2E] shrink-0" aria-hidden="true" />
        <span className="font-semibold text-[#F5F4F2]/90 truncate">
          10% OFF above ₹1,999 • Code: RK10
        </span>
        {announcement.linkText && (
          <Link
            to={announcement.linkHref || "/products"}
            className="hidden sm:inline-flex items-center text-[#E11D2E] hover:text-[#F5F4F2] underline underline-offset-4 font-bold transition-colors ml-1.5 shrink-0"
          >
            {announcement.linkText}
          </Link>
        )}
      </div>
    </aside>
  );
}
