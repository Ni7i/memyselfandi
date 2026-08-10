"use client";

import { useEffect, useState } from "react";

const WORD = "enisshorra.ch";
const TYPE_MS = 95;
const DELETE_MS = 45;
const HOLD_FULL = 2600;
const HOLD_EMPTY = 550;

export default function TypedTitle() {
  const [text, setText] = useState("");
  const [dir, setDir] = useState<1 | -1>(1);

  useEffect(() => {
    if (dir === 1 && text.length === WORD.length) {
      const t = setTimeout(() => setDir(-1), HOLD_FULL);
      return () => clearTimeout(t);
    }
    if (dir === -1 && text.length === 0) {
      const t = setTimeout(() => setDir(1), HOLD_EMPTY);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setText(WORD.slice(0, text.length + dir)),
      dir === 1 ? TYPE_MS : DELETE_MS,
    );
    return () => clearTimeout(t);
  }, [text, dir]);

  const dotIndex = text.indexOf(".");
  const before = dotIndex === -1 ? text : text.slice(0, dotIndex);
  const after = dotIndex === -1 ? "" : text.slice(dotIndex);

  return (
    <h1 className="intro-title">
      <span className="typed">
        {before}
        <em>{after}</em>
      </span>
      <span className="caret" aria-hidden="true">|</span>
    </h1>
  );
}
