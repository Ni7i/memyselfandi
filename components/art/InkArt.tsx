"use client";

import { useEffect, useRef } from "react";
import { ART, type ArtName } from "./manifest";

/** Where a drawing lives; the version lets the browser keep the file for good. */
export const artUrl = (name: ArtName) => `/art/${name}.svg?v=${ART[name].v}`;

const loading = new Map<string, Promise<string>>();

/** The strokes of a drawing as markup, fetched once per page. */
function strokes(name: ArtName) {
  const url = artUrl(name);
  let request = loading.get(url);
  if (!request) {
    request = fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`${url}: ${response.status}`);
        return response.text();
      })
      .then((text) => {
        const open = text.indexOf(">", text.indexOf("<g data-art=")) + 1;
        return text.slice(open, text.lastIndexOf("</g>"));
      });
    request.catch(() => loading.delete(url));
    loading.set(url, request);
  }
  return request;
}

/**
 * Places a drawing from public/art inside the surrounding <svg>. It loads when its scene comes
 * within a screen or so of the reader (or at once with `eager`), then fires a bubbling "ink"
 * event so whatever animates it can take over before the next paint.
 */
export default function InkArt({ name, eager = false }: { name: ArtName; eager?: boolean }) {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const group = ref.current!;
    let cancelled = false;
    const load = () =>
      strokes(name)
        .then((markup) => {
          if (cancelled || group.hasAttribute("data-inked")) return;
          group.innerHTML = markup;
          group.setAttribute("data-inked", "");
          group.dispatchEvent(new CustomEvent("ink", { bubbles: true }));
        })
        .catch(() => {});
    if (eager) {
      load();
      return () => {
        cancelled = true;
      };
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        load();
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(group.ownerSVGElement ?? group);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [name, eager]);

  return <g ref={ref} data-ink={name} />;
}

/** Resolves once the drawing inside `el` is on the page. */
export function inked(el: Element): Promise<void> {
  if (el.querySelector("[data-inked]") || el.hasAttribute("data-inked")) return Promise.resolve();
  return new Promise((resolve) => el.addEventListener("ink", () => resolve(), { once: true }));
}
