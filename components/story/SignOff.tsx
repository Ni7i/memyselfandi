"use client";

import { useEffect, useRef } from "react";
import ArtFallback from "@/components/art/ArtFallback";
import { Breeze } from "@/components/art/breeze";
import InkArt, { inked } from "@/components/art/InkArt";

/** What the thread writes at the end, one after the other, again and again. */
const WORDS = ["reliable.", "clean code.", "curious.", "tested.", "self-starter.", "Enis Shorra."];
/** Where the thread ends and the writing begins, in drawing units (art/scene-sign.svg). */
const PEN = { x: 84, y: 336 };

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/**
 * The last picture: Enis on the bench again, and the thread from his hand writing big words across
 * the page, which change every few seconds. The drawing itself arrives with the scroll (see
 * StoryMotion); the writing runs on its own while the picture is on screen, the way his hair moves.
 */
export default function SignOff() {
  const sceneRef = useRef<SVGGElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const wordRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const svg = svgRef.current!;
    const clip = clipRef.current!;
    const word = wordRef.current!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // On a phone the empty middle of the picture is cropped away, so the words can be read
    const narrow = matchMedia("(max-width: 700px)");
    // The words are set larger there, so their width is measured again
    let measure = () => {};
    const frameIt = () => {
      svg.setAttribute("viewBox", narrow.matches ? "0 70 1360 520" : "0 0 1600 600");
      measure();
    };
    frameIt();
    narrow.addEventListener("change", frameIt);
    let breeze: Breeze | null = null;
    let visible = false;
    let frame = 0;
    let cancelled = false;

    inked(sceneRef.current!).then(() => {
      if (cancelled) return;
      breeze = new Breeze(sceneRef.current!);
      if (visible && !still) breeze.play();
    });

    // With reduced motion the first word stands, written out
    if (still) {
      clip.setAttribute("width", "1600");
      return () => {
        cancelled = true;
        narrow.removeEventListener("change", frameIt);
      };
    }

    let index = 0;
    let started = 0;
    let width = 1;
    measure = () => (width = word.getComputedTextLength() + 40);
    const show = (i: number) => {
      index = i % WORDS.length;
      word.textContent = WORDS[index];
      measure();
    };
    show(0);

    // Write (the pen moves at a hand's pace), hold, take it back quickly, next word
    const tick = (now: number) => {
      if (!started) started = now;
      const t = now - started;
      const write = 260 + WORDS[index].length * 95;
      const hold = 1500;
      const erase = 380;
      let shown: number;
      if (t < write) shown = ease(t / write);
      else if (t < write + hold) shown = 1;
      else if (t < write + hold + erase) shown = 1 - ease((t - write - hold) / erase);
      else {
        show(index + 1);
        started = now;
        shown = 0;
      }
      clip.setAttribute("width", (PEN.x - 30 + shown * width).toFixed(1));
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        if (!frame) {
          started = 0;
          frame = requestAnimationFrame(tick);
        }
        breeze?.play();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
        breeze?.pause();
      }
    });
    observer.observe(svg);
    // The script face changes the width of the words once it has loaded
    document.fonts?.ready.then(measure);

    return () => {
      cancelled = true;
      narrow.removeEventListener("change", frameIt);
      observer.disconnect();
      cancelAnimationFrame(frame);
      breeze?.pause();
    };
  }, []);

  return (
    <div className="sign">
      <svg ref={svgRef} className="sign-art ink-host" viewBox="0 0 1600 600" role="img" aria-labelledby="sign-desc">
        <desc id="sign-desc">
          Illustration: Enis on the bench from the beginning, the wind in his hair. The red thread runs from his hand along
          the ground and writes words across the page: reliable, clean code, curious, tested, self-starter, Enis Shorra.
        </desc>
        <defs>
          <clipPath id="sign-clip">
            <rect ref={clipRef} x="0" y="0" width="0" height="600" />
          </clipPath>
        </defs>
        <g ref={sceneRef} data-drawing="0 0.8" data-own>
          <InkArt name="scene-sign" />
        </g>
        <text ref={wordRef} className="sign-word" x={PEN.x} y={PEN.y} clipPath="url(#sign-clip)">
          {WORDS[0]}
        </text>
      </svg>
      <ArtFallback name="scene-sign" className="sign-art" alt="Enis on the bench from the beginning, the red thread running from his hand." />
    </div>
  );
}
