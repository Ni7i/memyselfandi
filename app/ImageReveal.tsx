"use client";

import { useEffect } from "react";

export default function ImageReveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const thumbs = Array.from(document.querySelectorAll<HTMLElement>(".thumb"));
    if (!thumbs.length) return;

    // Hide first (JS present), then reveal as each scrolls in.
    thumbs.forEach((el) => el.classList.add("reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    thumbs.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
