"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
      sizes="(max-width: 900px) 100vw, 45vw"
    />
  ) : (
    <pre className="screen-fallback">
      {item.fallback.map((line, index) => <span key={index}>{line}</span>)}
    </pre>
  );
}

/** Layers above the open one leave upwards, layers below wait underneath. */
function layerClass(base: string, index: number, active: number) {
  return `${base}${index === active ? " is-active" : index < active ? " is-before" : ""}`;
}

/** The laptop or frame stays put; every entry is a stacked layer and only the open one shows. */
function Visual({ items, active, variant }: { items: ShowcaseItem[]; active: number; variant: ShowcaseVariant }) {
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

  // Certificates hang in a frame; badges without a file get a printed sheet.
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

function Info({ item }: { item: ShowcaseItem }) {
  return (
    <>
      <p className="info-text">{item.text}</p>
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
    </>
  );
}

/**
 * Titles on the left, preview and details on the right. Pointing at a title shows it at once:
 * the list itself never changes height on desktop, so nothing moves under the pointer.
 * On phones the stage is hidden and the open entry unfolds in place instead.
 */
export default function Showcase({ items, label, variant }: { items: ShowcaseItem[]; label: string; variant: ShowcaseVariant }) {
  const [active, setActive] = useState(0);
  if (!items[active]) return null;

  return (
    <div className={`showcase showcase-${variant}`}>
      <ul className="showcase-list" aria-label={label}>
        {items.map((item, index) => {
          const isOpen = index === active;
          return (
            <li key={item.id} className={`showcase-item${isOpen ? " is-active" : ""}`}>
              <h3>
                <button
                  type="button"
                  className="showcase-title"
                  aria-expanded={isOpen}
                  onPointerEnter={(event) => event.pointerType === "mouse" && setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                >
                  {item.title}
                </button>
              </h3>
              <div className="showcase-inline" inert={!isOpen}>
                <div className="showcase-inline-inner">
                  <Visual items={[item]} active={0} variant={variant} />
                  <Info item={item} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="showcase-stage">
        <div aria-hidden="true">
          <Visual items={items} active={active} variant={variant} />
        </div>
        <div className="showcase-infos">
          {items.map((item, index) => (
            <div key={item.id} className={`showcase-info${index === active ? " is-active" : ""}`} inert={index !== active}>
              <Info item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
