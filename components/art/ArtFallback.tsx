import { ART, type ArtName } from "./manifest";

/**
 * Without JavaScript the drawings cannot be placed inline, so the finished file is shown as an
 * image where the <svg> would be (html:not(.js) hides the empty svg; see story.css).
 */
export default function ArtFallback({ name, className, alt = "" }: { name: ArtName; className?: string; alt?: string }) {
  const { width, height, v } = ART[name];
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element -- a plain image is the point here */}
      <img className={`art-fallback ${className ?? ""}`} src={`/art/${name}.svg?v=${v}`} width={width} height={height} alt={alt} />
    </noscript>
  );
}
