"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";

const MOBILE_QUERY = "(max-width: 767px)";

const MOBILE_ANCHORS: Record<string, string> = {
  facts: "about",
  work: "archive",
  proof: "certificates",
  top: "mobile-main",
};

const DESKTOP_ANCHORS: Record<string, string> = {
  about: "facts",
  archive: "work",
  certificates: "proof",
  "mobile-main": "top",
};

function subscribe(onChange: () => void) {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

/** Mount only the experience for the current viewport, including its effects. */
export default function ResponsiveHome({ desktop, mobile, initialMobile }: {
  desktop: ReactNode;
  mobile: ReactNode;
  initialMobile: boolean;
}) {
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, () => initialMobile);
  const previousVariant = useRef(isMobile);

  useEffect(() => {
    const variantChanged = previousVariant.current !== isMobile;
    previousVariant.current = isMobile;
    const aliases = isMobile ? MOBILE_ANCHORS : DESKTOP_ANCHORS;
    let frame = 0;

    const alignHash = (variantChanged: boolean) => {
      cancelAnimationFrame(frame);
      let id: string;
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      if (!id) return;

      const mapped = Object.hasOwn(aliases, id) ? aliases[id] : undefined;
      const targetId = mapped ?? id;
      if (mapped) {
        const { pathname, search } = window.location;
        window.history.replaceState(window.history.state, "", `${pathname}${search}#${mapped}`);
      }

      // Leave normal anchor navigation and restored scroll positions to the browser.
      if (!mapped && !variantChanged) return;
      frame = requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ block: "start", behavior: "instant" });
      });
    };

    const onHashChange = () => alignHash(false);
    alignHash(variantChanged);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [isMobile]);

  return isMobile ? mobile : desktop;
}
