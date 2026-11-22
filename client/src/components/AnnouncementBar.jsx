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
      className="relative z-50 bg-[#161616] border-b border-[#262626] text-[#F5F4F2] text-[10px] min-[360px]:text-xs uppercase tracking-wider py-1.5 sm:py-2 px-3 sm:px-4 select-none overflow-hidden w-full max-w-full"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 text-center min-w-0 w-full">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C8202B] animate-pulse shrink-0" aria-hidden="true" />
        <span className="font-semibold tracking-wider sm:tracking-widest text-[#F5F4F2]/90 leading-tight truncate">
          {announcement.text}
        </span>
        {announcement.linkText && (
          <Link
            to={announcement.linkHref || "/about"}
            className="hidden sm:inline-flex items-center text-[#C8202B] hover:text-[#F5F4F2] underline underline-offset-4 font-bold transition-colors ml-2 shrink-0"
          >
            {announcement.linkText}
          </Link>
        )}
      </div>
    </aside>
  );
}
