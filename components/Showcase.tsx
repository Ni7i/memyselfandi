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

function Preview({ item }: { item: ShowcaseItem }) {
  return (
    <figure className="frame">
      <div className="frame-bar">{item.address}</div>
      <div className="frame-body">
        {item.image ? (
          <Image
            src={item.image.src}
            width={item.image.width}
            height={item.image.height}
            alt={item.image.alt}
            sizes="(max-width: 1080px) 100vw, 45vw"
          />
        ) : (
          <pre className="frame-fallback">
            {item.fallback.map((line, index) => <span key={index}>{line}</span>)}
          </pre>
        )}
      </div>
    </figure>
  );
}

/** Numbered list on the left; the open entry shows its details and a preview on the right. */
export default function Showcase({ items, label }: { items: ShowcaseItem[]; label: string }) {
  const [active, setActive] = useState(0);
  const current = items[active];
  if (!current) return null;

  return (
    <div className="showcase">
      <ol className="showcase-list" aria-label={label}>
        {items.map((item, index) => {
          const open = index === active;
          return (
            <li key={item.id} className={`showcase-item${open ? " is-active" : ""}`}>
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
                  <Preview item={item} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="showcase-stage" aria-hidden="true">
        <Preview key={current.id} item={current} />
      </div>
    </div>
  );
}
