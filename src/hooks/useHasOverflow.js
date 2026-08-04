import { useEffect, useState } from 'react';

/**
 * True when a horizontal scroll container actually has somewhere to scroll.
 *
 * Both homepage rails size their cards off the viewport, so whether the row
 * overflows depends on the window width and the number of items — which is
 * why this measures rather than counting cards. Arrows that can't move
 * anything are worse than no arrows, so callers hide them on `false`.
 */
export function useHasOverflow(ref, deps = []) {
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // A few px of slack. Both rails size their cards with
    // `calc((100% - n * gap) / n)`, and the browser rounds each used width
    // independently — so a row that fits exactly still reports a scrollWidth
    // a pixel or two over. Real overflow is always most of a card wide, so
    // there's no risk of swallowing a genuine one here.
    const measure = () => setHasOverflow(el.scrollWidth - el.clientWidth > 4);
    measure();

    // Observe the children too — the container's own box can hold still
    // while a breakpoint changes each card's flex-basis underneath it.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    for (const child of el.children) observer.observe(child);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);

  return hasOverflow;
}
