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
      className="relative z-50 bg-[#161616] border-b border-[#262626] text-[#F5F4F2] text-xs uppercase tracking-widest py-2 px-4 select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C8202B] animate-pulse" aria-hidden="true" />
        <span className="font-semibold text-xs tracking-wider sm:tracking-widest text-[#F5F4F2]/90">
          {announcement.text}
        </span>
        {announcement.linkText && (
          <Link
            to={announcement.linkHref || "/about"}
            className="hidden sm:inline-flex items-center text-[#C8202B] hover:text-[#F5F4F2] underline underline-offset-4 font-bold transition-colors ml-2"
          >
            {announcement.linkText}
          </Link>
        )}
      </div>
    </aside>
  );
}
