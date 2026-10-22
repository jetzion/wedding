/** Leaflets along a quadratic stem from (0,0) through (cx,cy) to (ex,ey). */
function Frond({ cx, cy, ex, ey, leaves = 16, reach = 46 }: { cx: number; cy: number; ex: number; ey: number; leaves?: number; reach?: number }) {
  const at = (t: number) => {
    const u = 1 - t;
    const x = 2 * u * t * cx + t * t * ex;
    const y = 2 * u * t * cy + t * t * ey;
    const angle = (Math.atan2(2 * u * cy + 2 * t * (ey - cy), 2 * u * cx + 2 * t * (ex - cx)) * 180) / Math.PI;
    return { x, y, angle };
  };
  const leaflets = Array.from({ length: leaves }, (_, i) => {
    const t = 0.12 + (0.86 * i) / leaves;
    const { x, y, angle } = at(t);
    const length = reach * (1 - t * 0.65);
    const leaf = `M0 0 Q${length / 2} -${length / 9} ${length} 0 Q${length / 2} ${length / 14} 0 0Z`;
    return [50, -50].map((side) => (
      <path key={`${i}${side}`} d={leaf} transform={`translate(${x} ${y}) rotate(${angle + side})`} />
    ));
  });
  return (
    <g>
      <path d={`M0 0 Q${cx} ${cy} ${ex} ${ey}`} fill="none" stroke="currentColor" strokeWidth="1.6" />
      <g fill="currentColor">{leaflets}</g>
    </g>
  );
}

/**
 * Soft tropical watercolor background for the invitation card: an ocean wash
 * at the top, a white-sand wash at the bottom, palm fronds in two corners, and
 * a thin gold frame. Purely decorative; it sits behind the card's content.
 */
export function InvitationDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
      <div className="absolute -top-24 left-1/2 h-56 w-[130%] -translate-x-1/2 rounded-[50%] bg-shallows opacity-90 blur-2xl" />
      <div className="absolute -top-16 left-1/4 h-28 w-2/3 rounded-[50%] bg-seafoam/25 blur-2xl" />
      <div className="absolute -bottom-24 left-1/2 h-56 w-[130%] -translate-x-1/2 rounded-[50%] bg-sand-deep opacity-80 blur-2xl" />
      <svg className="absolute -top-6 -left-6 w-44 text-sea opacity-25 sm:w-56" viewBox="0 0 200 200">
        <defs>
          <filter id="watercolor">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="7" />
            <feGaussianBlur stdDeviation="0.7" />
          </filter>
        </defs>
        <g filter="url(#watercolor)">
          <Frond cx={70} cy={10} ex={190} ey={110} />
          <g className="text-seafoam">
            <Frond cx={10} cy={80} ex={100} ey={190} leaves={12} reach={38} />
          </g>
        </g>
      </svg>
      <svg className="absolute -right-6 -bottom-6 w-44 rotate-180 text-sea opacity-25 sm:w-56" viewBox="0 0 200 200">
        <g filter="url(#watercolor)">
          <Frond cx={80} cy={5} ex={195} ey={95} />
          <g className="text-seafoam">
            <Frond cx={15} cy={70} ex={90} ey={185} leaves={12} reach={38} />
          </g>
        </g>
      </svg>
      <div className="absolute inset-3 rounded-[1.25rem] border border-gold/50" />
    </div>
  );
}

/** A thin gold rule with a small diamond in the middle. */
export function GoldDivider() {
  return (
    <div aria-hidden className="flex items-center gap-2">
      <span className="h-px w-12 bg-linear-to-r from-transparent to-gold" />
      <span className="size-1.5 rotate-45 bg-gold" />
      <span className="h-px w-12 bg-linear-to-l from-transparent to-gold" />
    </div>
  );
}
