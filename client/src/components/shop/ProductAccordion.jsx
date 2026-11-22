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
    <div className="border-t border-[#262626] divide-y divide-[#222222]">
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);

        return (
          <div key={item.title} className="py-4">
            <button
              type="button"
              onClick={() => toggleIndex(idx)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between text-left font-heading text-lg sm:text-xl text-[#F5F4F2] uppercase tracking-wide group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E11D2E] cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <span className={`w-1.5 h-1.5 transition-colors duration-300 ${isOpen ? 'bg-[#E11D2E]' : 'bg-[#444444]'}`} />
                <span className="group-hover:text-[#E11D2E] transition-colors">{item.title}</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#8C8C8C] transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-[#E11D2E]' : ''
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden text-sm text-[#8C8C8C] leading-relaxed font-body">
                {typeof item.content === 'string' ? (
                  <p className="pb-1">{item.content}</p>
                ) : (
                  <div className="pb-1">{item.content}</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
