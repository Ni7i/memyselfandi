import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ART } from "@/components/art/manifest";

describe("art manifest", () => {
  it("matches the drawings in public/art, so a cached file is never stale", () => {
    for (const [name, { width, height, v }] of Object.entries(ART)) {
      const text = readFileSync(join(process.cwd(), "public", "art", `${name}.svg`), "utf8");
      expect(createHash("sha256").update(text).digest("hex").slice(0, 10), name).toBe(v);
      expect(text).toContain(`viewBox="0 0 ${width} ${height}"`);
      expect(text).toContain(`<g data-art="${name}">`);
    }
  });
});
