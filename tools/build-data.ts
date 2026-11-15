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
const clean = (t: string) => t.replace(/\[[^\]]*\]/g, " ").replace(/\|/g, " ").replace(/\s+/g, " ").trim();
const noTags = (t: string) => t.replace(/\[[^\]]*\]/g, " ");
const norm = (w: string) => w.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");

// Was in einer Szene nacheinander eingeblendet wird
const labelsOf = (s: VideoSpec["scenes"][number]): string[] => {
  switch (s.type) {
    case "list":
      return s.items;
    case "flow":
      return s.steps.map((x) => x.label);
    case "brauchst":
      return s.items.map((x) => x.label);
    case "vergleich":
      return [s.left.title, s.right.title];
    case "hook":
      return s.headline.replace(/\*/g, "").split(/\s+/).filter(Boolean);
    default:
      return [];
  }
};

// Einblend-Zeitpunkte (Sekunden ab Szenenbeginn), damit jedes Element erscheint, wenn die Stimme es nennt.
// 1) Marker "|" im Sprechtext vor dem Wort, bei dem das nächste Element kommen soll (genau so viele wie Elemente)
// 2) sonst automatisch: erstes passendes Stichwort des Elements im gesprochenen Text
// 3) was nicht gefunden wird, wird gleichmäßig dazwischen verteilt
const cuesFor = (s: VideoSpec["scenes"][number], sw: Word[], sceneStart: number, sceneEnd: number): number[] | undefined => {
  const labels = labelsOf(s);
  if (!labels.length || !sw.length) return undefined;
  const at = (i: number) => Math.max(0, sw[Math.max(0, Math.min(sw.length - 1, i))].start - sceneStart - 0.12);
  const parts = noTags(s.voice).split("|");
  if (parts.length - 1 === labels.length) {
    const total = parts.join(" ").split(/\s+/).filter(Boolean).length;
    let n = 0;
    return parts.slice(0, -1).map((part) => {
      n += part.split(/\s+/).filter(Boolean).length;
      return at(Math.round((n * sw.length) / total));
    });
  }
  const firstNow = s.type === "vergleich" || s.type === "hook"; // erstes Element sofort zeigen
  const isHook = s.type === "hook";
  const found: (number | undefined)[] = [];
  let j = 0;
  for (const label of labels) {
    const tokens = label.replace(/\*/g, "").split(/\s+/).map(norm).filter((t) => (isHook ? t.length > 0 : t.length >= 4));
    let hit = -1;
    for (let k = j; k < sw.length && hit < 0; k++) {
      const w = norm(sw[k].text);
      if (tokens.some((t) => (isHook ? w === t : w.startsWith(t.slice(0, 5)) || t.startsWith(w.slice(0, 5)) && w.length >= 4))) hit = k;
    }
    if (hit < 0) {
      found.push(undefined);
      continue;
    }
    // Bei Listen: zum Anfang des Satzteils zurückgehen, in dem das Stichwort fällt
    let begin = hit;
    if (!isHook) while (begin > j && !/[.,!?:;–-]$/.test(sw[begin - 1].text) && !["und", "oder"].includes(norm(sw[begin - 1].text))) begin--;
    found.push(at(begin));
    j = hit + 1;
  }
  // Lücken gleichmäßig füllen
  const len = sceneEnd - sceneStart;
  if (firstNow) found[0] = 0;
  return found.map((c, i) => {
    if (c !== undefined) return c;
    let a = i - 1;
    while (a >= 0 && found[a] === undefined) a--;
    let b = i + 1;
    while (b < found.length && found[b] === undefined) b++;
    const ta = a >= 0 ? (found[a] as number) : 0.15;
    const tb = b < found.length ? (found[b] as number) : len * 0.8;
    return ta + ((tb - ta) * (i - a)) / (b - a);
  });
};

const out: TimedVideo[] = [];
const dir = "content/videos";
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
  const spec: VideoSpec = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const timingPath = `content/timing/${spec.id}.json`;
  const audioFile = `audio/${spec.id}.mp3`;
  const fullText = spec.scenes.map((s) => s.voice.trim()).join(" ").replace(/\s*\|\s*/g, " ").replace(/\s+/g, " ").trim();
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
  const scenes = spec.scenes.map((s, i) => {
    const start = i === 0 ? 0 : words[firstIdx[i]].start - 0.08;
    const end = i === spec.scenes.length - 1 ? duration + 0.6 : words[firstIdx[i + 1]].start - 0.08;
    const sw = words.slice(firstIdx[i], i === spec.scenes.length - 1 ? words.length : firstIdx[i + 1]);
    return { ...s, voice: clean(s.voice), start, end, cues: cuesFor(s, sw, start, end) };
  });
  out.push({ ...spec, scenes, words, duration, audio: hasAudio ? audioFile : null });
  console.log(`${status} ${spec.id}  ${hasAudio ? "" : "~"}${duration.toFixed(0)} s  ${clean(fullText).length} Zeichen  ${spec.title}`);
}
fs.mkdirSync("src/generated", { recursive: true });
fs.writeFileSync("src/generated/videos.json", JSON.stringify(out));
