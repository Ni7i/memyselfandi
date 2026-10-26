import type { ArtData } from "./types";

/**
 * Renders a drawing as SVG paths, complete, so it reads without JavaScript.
 * Strokes carry their centerline and timing as data attributes; the page's
 * drawing controller uses them to draw the line on as the reader scrolls.
 */
export default function Art({ data, className }: { data: ArtData; className?: string }) {
  return (
    <g className={className} data-art={data.name}>
      {data.items.map((item, i) => {
        if (item[0] === "b") {
          const [, tone, outline, center, , maskWidth, t0, t1, sway] = item;
          return <path key={i} className={`a-b t-${tone}`} d={outline} data-c={center} data-w={maskWidth} data-t={`${t0} ${t1}`} data-sway={sway} />;
        }
        if (item[0] === "f") {
          const [, tone, shape, t0, t1] = item;
          return <path key={i} className={`a-f t-${tone}`} d={shape} data-t={`${t0} ${t1}`} />;
        }
        const [, tone, center, , width, t0, t1] = item;
        return <path key={i} className={`a-t t-${tone}`} d={center} pathLength={1} strokeWidth={width} data-t={`${t0} ${t1}`} />;
      })}
    </g>
  );
}

/** The filters soft shadows and washes refer to (url(#art-soft), url(#art-wet)). Render once per page. */
export function ArtFilters() {
  return (
    <svg className="art-filters" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter id="art-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <filter id="art-wet" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="5" />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>
    </svg>
  );
}
