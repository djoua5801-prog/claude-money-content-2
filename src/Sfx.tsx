import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { BRAND } from "./theme";

// Kurze Effekt-Töne (selbst erzeugt, liegen in public/sfx). An/aus und Lautstärke in brand/brand.json unter "sfx".
export type SfxName = "whoosh" | "pop" | "impact" | "ding" | "riser";
const BASE: Record<SfxName, number> = { whoosh: 0.5, pop: 0.45, impact: 0.8, ding: 0.5, riser: 0.35 };

export const Sfx: React.FC<{ name: SfxName; at?: number; volume?: number }> = ({ name, at = 0, volume = 1 }) => {
  const cfg = (BRAND as { sfx?: { enabled: boolean; volume: number } }).sfx;
  if (!cfg?.enabled) return null;
  return (
    <Sequence from={Math.max(0, Math.round(at))} durationInFrames={45} layout="none">
      <Audio src={staticFile(`sfx/${name}.mp3`)} volume={BASE[name] * cfg.volume * volume} />
    </Sequence>
  );
};
