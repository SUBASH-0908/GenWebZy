import { useEffect, useRef } from 'react';
import './SignatureLine.css';

/**
 * A thin 2px blue vertical line on the left edge of the viewport
 * that fills from top to bottom as the user scrolls.
 * This is Genwebzy's one unique design signature.
 */
export default function SignatureLine() {
  const fillRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? Math.min((window.scrollY / total) * 100, 100) : 0;
      if (fillRef.current) fillRef.current.style.height = `${pct}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="sig-track" aria-hidden="true">
      <div className="sig-fill" ref={fillRef} />
    </div>
  );
}
