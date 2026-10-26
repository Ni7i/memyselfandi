/** The filters soft shadows and washes refer to (url(#art-soft), url(#art-wet)). Render once per page. */
export default function ArtFilters() {
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
