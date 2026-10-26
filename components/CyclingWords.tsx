"use client";

import { useEffect, useState } from "react";

/** Cycles through a list of short thoughts, one visible at a time, behind the name. */
export default function CyclingWords({ words, className }: { words: string[]; className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % words.length), 2600);
    return () => window.clearInterval(timer);
  }, [words.length]);

  return (
    <span className={className} aria-hidden="true" data-cycle={words.join("|")}>
      {words.map((word, i) => (
        <span key={word} className={i === index ? "is-on" : undefined}>{word}</span>
      ))}
    </span>
  );
}
