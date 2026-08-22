import { useEffect, useRef, useState } from "react";

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Animates a displayed number from its previous value to `target`
// whenever `target` changes -- used for the big hero numbers (Survival
// Stock, forecast, savings) so a risk-mode switch or a fresh simulation
// feels like something happened, not just a value snapping in place.
export function useCountUp(target, { duration = 700, decimals = 0 } = {}) {
  const [display, setDisplay] = useState(target);
  const frameRef = useRef();
  const fromRef = useRef(target);

  useEffect(() => {
    if (typeof target !== "number" || Number.isNaN(target)) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      fromRef.current = target;
      return;
    }

    const from = fromRef.current;
    const start = performance.now();

    cancelAnimationFrame(frameRef.current);
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutExpo(progress);
      const value = from + (target - from) * eased;
      setDisplay(value);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return decimals > 0 ? Number(display.toFixed(decimals)) : Math.round(display);
}
