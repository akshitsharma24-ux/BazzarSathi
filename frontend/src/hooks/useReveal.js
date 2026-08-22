import { useEffect, useRef, useState } from "react";

// Fires once when the element first scrolls into view. The old approach
// (CSS animate-* classes on mount) only ever plays for whatever's already
// on screen at load -- anything below the fold has already "finished"
// animating before a user scrolls down to it, so scrolling itself felt
// completely static. This drives the animation off actual scroll position.
export function useReveal({ threshold = 0.15, rootMargin = "0px 0px -80px 0px" } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion users by just showing content immediately.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, visible];
}
