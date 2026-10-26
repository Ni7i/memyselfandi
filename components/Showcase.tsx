"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export interface ShowcaseLink {
  label: string;
  href: string;
  external: boolean;
}

export interface ShowcaseItem {
  id: string;
  title: string;
  text: string;
  tags: string[];
  links: ShowcaseLink[];
  /** Shown in the preview's address bar. */
  address: string;
  image?: { src: string; width: number; height: number; alt: string };
  /** Lines shown in the preview when there is no image; the first one reads like a command. */
  fallback: string[];
}

export type ShowcaseVariant = "laptop" | "frame";

function Screen({ item }: { item: ShowcaseItem }) {
  return item.image ? (
    <Image
      src={item.image.src}
      width={item.image.width}
      height={item.image.height}
      alt={item.image.alt}
      sizes="(max-width: 1080px) 100vw, 45vw"
    />
  ) : (
    <pre className="screen-fallback">
      {item.fallback.map((line, index) => <span key={index}>{line}</span>)}
    </pre>
  );
}

function Preview({ item, variant }: { item: ShowcaseItem; variant: ShowcaseVariant }) {
  if (variant === "laptop") {
    return (
      <figure className="laptop">
        <div className="laptop-lid">
          <div className="laptop-display">
            <div className="laptop-bar">{item.address}</div>
            <div className="laptop-screen"><Screen item={item} /></div>
          </div>
        </div>
        <div className="laptop-base" />
      </figure>
    );
  }

  // Certificates: framed like a print on the wall; badges without a file get a printed sheet.
  return (
    <figure className="print">
      <div className="print-mat">
        {item.image ? (
          <Screen item={item} />
        ) : (
          <div className="print-sheet">
            <span className="print-kicker">Certificate</span>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
            <span className="print-seal">{item.fallback[0]}</span>
          </div>
        )}
      </div>
    </figure>
  );
}

/** Opening on hover waits a moment, so the list doesn't flicker while the pointer passes over it. */
const HOVER_DELAY_MS = 140;

/** Numbered list on the left; the open entry shows its details and a preview on the right. */
export default function Showcase({ items, label, variant }: { items: ShowcaseItem[]; label: string; variant: ShowcaseVariant }) {
  const [active, setActive] = useState(0);
  const hoverTimer = useRef<number | undefined>(undefined);
  const current = items[active];

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const openOnHover = (index: number) => {
    window.clearTimeout(hoverTimer.current);
    if (!window.matchMedia("(hover: hover)").matches) return;
    hoverTimer.current = window.setTimeout(() => setActive(index), HOVER_DELAY_MS);
  };
  if (!current) return null;

  return (
    <div className="showcase">
      <ol className="showcase-list" aria-label={label}>
        {items.map((item, index) => {
          const open = index === active;
          return (
            <li
              key={item.id}
              className={`showcase-item${open ? " is-active" : ""}`}
              onMouseEnter={() => openOnHover(index)}
              onMouseLeave={() => window.clearTimeout(hoverTimer.current)}
            >
              <h3>
                <button type="button" aria-expanded={open} onClick={() => setActive(index)}>
                  <span className="showcase-number">{String(index + 1).padStart(2, "0")}</span>
                  {item.title}
                </button>
              </h3>
              <div className="showcase-detail" hidden={!open}>
                <p>{item.text}</p>
                {item.tags.length > 0 && (
                  <ul className="showcase-tags">
                    {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                )}
                <div className="showcase-links">
                  {item.links.map((link) => link.external ? (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>
                  ) : (
                    <Link key={link.href} href={link.href}>{link.label} →</Link>
                  ))}
                </div>
                <div className="showcase-inline">
                  <Preview item={item} variant={variant} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="showcase-stage" aria-hidden="true">
        <Preview key={current.id} item={current} variant={variant} />
      </div>
    </div>
  );
}
