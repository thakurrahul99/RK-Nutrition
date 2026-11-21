import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ProductAccordion({ items = [] }) {
  const [openIndices, setOpenIndices] = useState([0]); // First item open by default

  const toggleIndex = (index) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="border-t border-[#262626] divide-y divide-[#262626]">
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);

        return (
          <div key={item.title} className="py-4">
            <button
              type="button"
              onClick={() => toggleIndex(idx)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between text-left font-heading text-lg sm:text-xl text-[#F5F4F2] uppercase tracking-wide group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C8202B]"
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#C8202B]" />
                <span className="group-hover:text-[#C8202B] transition-colors">{item.title}</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#8C8C8C] transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-[#C8202B]' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="pt-3 pb-1 text-sm text-[#8C8C8C] leading-relaxed font-body">
                {typeof item.content === 'string' ? (
                  <p>{item.content}</p>
                ) : (
                  item.content
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
