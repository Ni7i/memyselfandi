"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";

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

/** How long the pointer has to rest on an entry before it opens. */
const HOVER_DELAY_MS = 90;
/** Length of the open/close animation; hover waits for it so the list never chases the pointer. */
const TRANSITION_MS = 550;

/** Clock for the hover timing; only ever read inside event handlers and timers. */
const now = () => performance.now();

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

/** Entries above the open one leave upwards, entries below wait underneath: the content flows with the list. */
function layerClass(base: string, index: number, active: number) {
  return `${base}${index === active ? " is-active" : index < active ? " is-before" : ""}`;
}

/**
 * The laptop or frame stays put; only what is on it changes.
 * Every entry is rendered once, stacked, and the open one fades and slides in.
 */
function Stage({ items, active, variant }: { items: ShowcaseItem[]; active: number; variant: ShowcaseVariant }) {
  if (variant === "laptop") {
    return (
      <figure className="laptop">
        <div className="laptop-lid">
          <div className="laptop-display">
            <div className="laptop-bar">
              <span key={items[active].id} className="laptop-address">{items[active].address}</span>
            </div>
            <div className="laptop-screen">
              {items.map((item, index) => (
                <div key={item.id} className={layerClass("screen-layer", index, active)}>
                  <Screen item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="laptop-base" />
      </figure>
    );
  }

  // Certificates: framed like a print, badges without a file get a printed sheet.
  return (
    <div className="print-stack">
      {items.map((item, index) => (
        <figure key={item.id} className={layerClass("print", index, active)}>
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
      ))}
    </div>
  );
}

/** Numbered list on the left; the open entry shows its details and the stage on the right shows it. */
export default function Showcase({ items, label, variant }: { items: ShowcaseItem[]; label: string; variant: ShowcaseVariant }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const pointer = useRef({ x: -1, y: -1 });
  const settledAt = useRef(0);
  const activeRef = useRef(active);

  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const open = (index: number) => {
    settledAt.current = now() + TRANSITION_MS;
    setActive(index);
  };

  // Only real pointer movement counts. When an entry opens, the list moves under a resting
  // pointer; the browser may report that as a move, but with unchanged coordinates.
  const onPointerMove = (event: PointerEvent<HTMLOListElement>) => {
    if (event.pointerType !== "mouse") return;
    if (event.clientX === pointer.current.x && event.clientY === pointer.current.y) return;
    pointer.current = { x: event.clientX, y: event.clientY };

    window.clearTimeout(timer.current);
    const wait = Math.max(HOVER_DELAY_MS, settledAt.current - now());
    timer.current = window.setTimeout(() => {
      // Ask what is under the pointer now, after any animation has settled.
      const target = document.elementFromPoint(pointer.current.x, pointer.current.y);
      const entry = target?.closest<HTMLElement>("[data-index]");
      if (!entry || !listRef.current?.contains(entry)) return;
      const index = Number(entry.dataset.index);
      if (index !== activeRef.current) open(index);
    }, wait);
  };

  if (!items[active]) return null;

  return (
    <div className="showcase">
      <ol
        ref={listRef}
        className="showcase-list"
        aria-label={label}
        onPointerMove={onPointerMove}
        onPointerLeave={() => window.clearTimeout(timer.current)}
      >
        {items.map((item, index) => {
          const isOpen = index === active;
          return (
            <li key={item.id} data-index={index} className={`showcase-item${isOpen ? " is-active" : ""}`}>
              <h3>
                <button type="button" aria-expanded={isOpen} onClick={() => open(index)}>
                  <span className="showcase-number">{String(index + 1).padStart(2, "0")}</span>
                  {item.title}
                </button>
              </h3>
              <div className="showcase-detail" inert={!isOpen}>
                <div className="showcase-detail-inner">
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
                    <Stage items={[item]} active={0} variant={variant} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="showcase-stage" aria-hidden="true">
        <Stage items={items} active={active} variant={variant} />
      </div>
    </div>
  );
}
