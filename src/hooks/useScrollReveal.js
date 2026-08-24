import { useEffect } from 'react';

/**
 * Adds `.visible` to every `.reveal` element when it enters the viewport.
 * Uses IntersectionObserver — no layout thrashing.
 */
export function useScrollReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const els = document.querySelectorAll('.reveal');

    if (reduced) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold:  0.05,            // Trigger much earlier (was 0.1)
        rootMargin: '0px 0px -20px 0px',  // Less bottom offset = triggers sooner (was -40px)
      }
    );

    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
