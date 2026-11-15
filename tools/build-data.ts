// Verbindet Skripte (content/videos) mit Zeitmarken (content/timing) → src/generated/videos.json
// Ohne ElevenLabs-Timing wird die Sprechdauer geschätzt (stummes Vorschau-Video).
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { TimedVideo, VideoSpec, Word } from "../src/types";

// Geschätztes Timing für stumme Vorschauen: ca. 16,5 Zeichen pro Sekunde (an der gewählten Stimme gemessen)
const estimate = (text: string): Word[] => {
  let t = 0.3;
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const d = (w.length + 1) / 18.5;
      const word = { text: w, start: t, end: t + d * 0.9 };
      t += d + (/[.!?]$/.test(w) ? 0.22 : /[,:;]$/.test(w) ? 0.1 : 0);
      return word;
    });
};

// Regie-Anweisungen in eckigen Klammern gehören nicht zum sichtbaren Text
const clean = (t: string) => t.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();

const out: TimedVideo[] = [];
const dir = "content/videos";
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
  const spec: VideoSpec = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const timingPath = `content/timing/${spec.id}.json`;
  const audioFile = `audio/${spec.id}.mp3`;
  const fullText = spec.scenes.map((s) => s.voice.trim()).join(" ");
  const hash = createHash("sha1").update(fullText).digest("hex");
  const timing = fs.existsSync(timingPath) && fs.existsSync(`public/${audioFile}`) ? JSON.parse(fs.readFileSync(timingPath, "utf8")) : null;
  // Die Stimme wird nur benutzt, wenn sie zum aktuellen Skripttext gehört
  const hasAudio = !!timing && timing.hash === hash;
  const words: Word[] = hasAudio ? timing.words : estimate(clean(fullText));
  const status = hasAudio ? "♪ vertont      " : timing ? "! Text geändert" : spec.approved ? "✓ freigegeben  " : "✎ Entwurf      ";

  // Szenen über Wortanzahl auf die Wortliste abbilden
  const counts = spec.scenes.map((s) => clean(s.voice).split(/\s+/).filter(Boolean).length);
  const total = counts.reduce((a, b) => a + b, 0);
  const scale = words.length / total; // falls ElevenLabs anders trennt
  let idx = 0;
  const firstIdx = counts.map((c) => {
    const i = Math.min(words.length - 1, Math.round(idx * scale));
    idx += c;
    return i;
  });
  const duration = words[words.length - 1].end + 0.4;
  const scenes = spec.scenes.map((s, i) => ({
    ...s,
    start: i === 0 ? 0 : words[firstIdx[i]].start - 0.08,
    end: i === spec.scenes.length - 1 ? duration + 0.6 : words[firstIdx[i + 1]].start - 0.08,
  }));
  out.push({ ...spec, scenes, words, duration, audio: hasAudio ? audioFile : null });
  console.log(`${status} ${spec.id}  ${hasAudio ? "" : "~"}${duration.toFixed(0)} s  ${fullText.length} Zeichen  ${spec.title}`);
}
fs.mkdirSync("src/generated", { recursive: true });
fs.writeFileSync("src/generated/videos.json", JSON.stringify(out));
