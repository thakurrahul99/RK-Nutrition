import { useState } from 'react';
import { brandConfig } from '../../config/brandConfig';

export default function FloatingWhatsApp() {
  const [isHovered, setIsHovered] = useState(false);
  const { contact } = brandConfig;
  const whatsappUrl = contact?.whatsapp?.getChatUrl("Hi RK Nutrition, I have an inquiry about your supplements.") || 'https://wa.me/917452013333';

  return (
    <aside 
      id="floating-whatsapp-desk"
      aria-label="WhatsApp Support Desk" 
      className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 flex items-center gap-2 group"
    >
      {/* Tooltip / Label */}
      <div 
        className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-[#2E2E2E] shadow-xl text-xs font-mono uppercase tracking-wider text-[#F5F4F2] transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span>WhatsApp Support</span>
      </div>

      {/* Floating Action Button */}
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Chat with RK Nutrition Support on WhatsApp (7452013333)"
        className="relative w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#25D366]/40 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
      >
        {/* Subtle Ping Wave */}
        <span 
          aria-hidden="true" 
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" 
        />

        {/* WhatsApp Official Clean Vector SVG */}
        <svg 
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10" 
          viewBox="0 0 24 24" 
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.75 6.67C8.58 6.67 8.31 6.74 8.08 6.99C7.85 7.24 7.2 7.85 7.2 9.07C7.2 10.29 8.09 11.46 8.21 11.63C8.33 11.8 9.94 14.42 12.48 15.42C14.07 16.05 14.75 15.93 15.35 15.82C16.05 15.69 17.1 14.83 17.33 14.18C17.56 13.53 17.56 12.98 17.49 12.86C17.42 12.74 17.25 12.67 16.99 12.54C16.74 12.42 15.49 11.8 15.26 11.72C15.03 11.64 14.87 11.6 14.7 11.85C14.53 12.1 14.06 12.67 13.91 12.84C13.77 13.01 13.62 13.03 13.37 12.91C13.12 12.78 12.31 12.52 11.36 11.67C10.62 11.01 10.12 10.19 9.98 9.94C9.83 9.69 9.96 9.55 10.09 9.42C10.2 9.31 10.34 9.13 10.46 8.99C10.59 8.84 10.63 8.74 10.71 8.57C10.79 8.41 10.75 8.26 10.69 8.14C10.63 8.01 10.16 6.87 9.97 6.4C9.78 5.95 9.58 6.01 9.43 6C9.29 6 9.12 6 8.95 6C8.78 6 8.75 6.67 8.75 6.67Z"/>
        </svg>
      </a>
    </aside>
  );
}
