"use client";

import { useEffect, useState } from "react";

const WORD = "enisshorra.ch";
const TYPE_MS = 95;
const DELETE_MS = 45;
const HOLD_EMPTY_MS = 450;
const REPEAT_MS = 15_000;

type Phase = "waiting" | "deleting" | "typing";

export default function TypedTitle() {
  const [text, setText] = useState(WORD);
  const [phase, setPhase] = useState<Phase>("waiting");

  useEffect(() => {
    if (phase === "waiting") {
      const timer = window.setTimeout(() => setPhase("deleting"), REPEAT_MS);
      return () => window.clearTimeout(timer);
    }

    if (phase === "deleting") {
      if (text.length > 0) {
        const timer = window.setTimeout(() => setText((value) => value.slice(0, -1)), DELETE_MS);
        return () => window.clearTimeout(timer);
      }
      const timer = window.setTimeout(() => setPhase("typing"), HOLD_EMPTY_MS);
      return () => window.clearTimeout(timer);
    }

    if (text.length < WORD.length) {
      const timer = window.setTimeout(() => setText(WORD.slice(0, text.length + 1)), TYPE_MS);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => setPhase("waiting"), 0);
    return () => window.clearTimeout(timer);
  }, [phase, text]);

  const dotIndex = text.indexOf(".");
  const before = dotIndex === -1 ? text : text.slice(0, dotIndex);
  const after = dotIndex === -1 ? "" : text.slice(dotIndex);

  return (
    <h1 className="intro-title" aria-label={WORD}>
      <span className="typed" aria-hidden="true">{before}<em>{after}</em></span>
      <span className={`caret ${phase === "waiting" ? "caret-idle" : ""}`} aria-hidden="true">|</span>
    </h1>
  );
}
