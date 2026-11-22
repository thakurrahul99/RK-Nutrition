import { useEffect, useRef } from 'react';

/**
 * Performant hook using IntersectionObserver to trigger smooth entrance
 * animations when elements enter the viewport.
 * Automatically unobserves elements once revealed to save GPU/CPU cycles.
 * Respects prefers-reduced-motion settings.
 */
export function useScrollReveal(options = {}) {
  const containerRef = useRef(null);
  const { threshold = 0.12, rootMargin = '0px 0px -40px 0px' } = options;

  useEffect(() => {
    // Respect reduced motion preferences
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (containerRef.current) {
        const elements = containerRef.current.querySelectorAll('.reveal-init');
        elements.forEach((el) => el.classList.add('is-revealed'));
      }
      return;
    }

    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    const elements = containerRef.current.querySelectorAll('.reveal-init');
    elements.forEach((el) => observer.observe(el));

    // Also observe the container itself if it has reveal-init
    if (containerRef.current.classList.contains('reveal-init')) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return containerRef;
}

export default useScrollReveal;
