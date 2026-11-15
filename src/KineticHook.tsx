import React from "react";
import { KineticStory } from "./kinetic/KineticStory";
import { storySchema, type Story } from "./kinetic/schema";
import { C } from "./theme";
import type { TimedScene, Word } from "./types";

// Baut aus den gesprochenen Wörtern der Hook-Szene eine Kinetic-Story:
// jedes Wort (bzw. jede kurze Wortgruppe) erscheint genau dann, wenn es gesprochen wird.

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");

// Wörter in *Sternchen* aus der Headline = Akzent-Wörter
const accentSet = (headline: string) =>
  new Set(
    (headline.match(/\*([^*]+)\*/g) ?? [])
      .flatMap((m) => m.slice(1, -1).split(/\s+/))
      .map(norm),
  );

type Chunk = { text: string; start: number; end: number; accent: boolean };

const chunkWords = (words: Word[], accents: Set<string>): Chunk[] => {
  const chunks: Chunk[] = [];
  for (const w of words) {
    const accent = accents.has(norm(w.text));
    const prev = chunks[chunks.length - 1];
    // Kurze Füllwörter an das vorige Wort hängen, solange das Stück kurz bleibt
    const tooShort = prev && prev.end - prev.start < 0.38;
    const fits = prev && (prev.text + " " + w.text).length <= 12 && !prev.text.match(/[.!?,:]$/);
    if (prev && (tooShort || (w.text.length <= 3 && fits)) && fits && !(accent && !prev.accent)) {
      prev.text += " " + w.text;
      prev.end = w.end;
      prev.accent = prev.accent || accent;
    } else {
      chunks.push({ text: w.text, start: w.start, end: w.end, accent });
    }
  }
  return chunks;
};

const ENTER = ["up", "left", "vertical-roll", "down", "scale", "right"] as const;
const EXIT = ["drop", "blur", "rotate", "zoom", "scatter", "echo"] as const;

export const buildHookStory = (scene: TimedScene, words: Word[]): Story => {
  const own = words.filter((w) => w.start >= scene.start - 0.01 && w.start < scene.end - 0.01);
  const headline = "headline" in scene ? scene.headline : "";
  const chunks = chunkWords(own, accentSet(headline));
  const beats = chunks.map((c, i) => {
    const start = i === 0 ? 0 : c.start - scene.start - 0.04;
    const next = chunks[i + 1];
    const end = next ? next.start - scene.start - 0.04 : scene.end - scene.start;
    const dur = Math.max(0.3, end - start);
    const isLast = i === chunks.length - 1;
    const clean = c.text.replace(/\*/g, "");
    const kind = c.accent ? (isLast && clean.length <= 9 ? "cinema" : "oscillate") : "reveal";
    return {
      text: clean,
      kind,
      startSeconds: start,
      durationInSeconds: dur,
      animateInPortion: Math.min(0.6, 0.25 / dur + 0.15),
      animateOutPortion: isLast ? 0.08 : 0.15,
      easing: c.accent ? "back.out" : "power4.out",
      enterDirection: ENTER[i % ENTER.length],
      exitKind: isLast ? "none" : EXIT[i % EXIT.length],
      dynamics: c.accent ? 0.85 : 0.6,
      staggerSeconds: 0.025,
      fontFamily: "RobotoFlex",
      ...(c.accent ? { color: C.accent } : {}),
    };
  });
  return storySchema.parse({
    fontSize: 170,
    fontFamily: "RobotoFlex",
    bgColor: C.bg,
    bgColor2: C.surface,
    textColor: C.text,
    accentColor: C.accent,
    accent2Color: C.muted,
    glowIntensity: 0.35,
    background: { kind: "gradient", shaderStyle: "aurora", motion: 0.4, grain: 0 },
    durationInSeconds: scene.end - scene.start,
    beats,
  });
};

export const KineticHook: React.FC<{ scene: TimedScene; words: Word[] }> = ({ scene, words }) => {
  const story = React.useMemo(() => buildHookStory(scene, words), [scene, words]);
  return <KineticStory {...story} />;
};
