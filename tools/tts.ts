// ElevenLabs-Voiceover mit Wort-Zeitmarken erzeugen.
// Regel: erst Skript, dann Stimme – und pro Skript genau EINE Stimm-Version.
//   - Vertont werden nur Skripte mit "approved": true (freigeben: npm run freigeben -- v01).
//   - Ein vertontes Skript wird nie automatisch neu vertont.
//   - Wurde der Text danach geändert, muss das bewusst passieren: npm run tts -- v03 --neu
import "dotenv/config";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import brand from "../brand/brand.json";
import type { VideoSpec, Word } from "../src/types";

const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE = process.env.ELEVENLABS_VOICE_ID;
if (!KEY || !VOICE) {
  console.error("ELEVENLABS_API_KEY und ELEVENLABS_VOICE_ID in .env setzen (siehe .env.example).");
  process.exit(1);
}

const args = process.argv.slice(2);
const redo = args.includes("--neu");
const only = args.filter((a) => !a.startsWith("--"));
if (redo && !only.length) {
  console.error("--neu braucht die Video-IDs, z. B.: npm run tts -- v03 --neu");
  process.exit(1);
}

const dir = "content/videos";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();

const toWords = (chars: string[], starts: number[], ends: number[]): Word[] => {
  const words: Word[] = [];
  let cur = "";
  let s = 0;
  let e = 0;
  let inTag = false; // Regie-Anweisungen wie [begeistert] nicht als Wörter übernehmen
  chars.forEach((ch, i) => {
    if (ch === "[") inTag = true;
    if (inTag) {
      if (ch === "]") inTag = false;
      return;
    }
    if (/\s/.test(ch)) {
      if (cur) words.push({ text: cur, start: s, end: e });
      cur = "";
      return;
    }
    if (!cur) s = starts[i];
    cur += ch;
    e = ends[i];
  });
  if (cur) words.push({ text: cur, start: s, end: e });
  return words;
};

let chars = 0;
for (const f of files) {
  const spec: VideoSpec = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  if (only.length && !only.includes(spec.id)) continue;
  const audioPath = `public/audio/${spec.id}.mp3`;
  const timingPath = `content/timing/${spec.id}.json`;
  // "|" sind Einblend-Marker fürs Bild und werden nie gesprochen
  const raw = spec.scenes.map((s) => s.voice.trim()).join(" ").replace(/\s*\|\s*/g, " ").replace(/\s+/g, " ").trim();
  // Regie-Anweisungen in [Klammern] versteht nur Eleven v3; bei anderen Modellen vor dem Senden entfernen
  // Pro Video kann ein eigenes Modell samt Einstellungen gesetzt werden ("stimme" im Skript), sonst gilt brand.json
  const model = spec.stimme?.model ?? brand.voice.model;
  const settings = spec.stimme?.settings ?? brand.voice.settings;
  const text = model === "eleven_v3" ? raw : raw.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();
  const hash = createHash("sha1").update(raw).digest("hex");
  if (!spec.approved) {
    console.log(`· ${spec.id} wartet auf Freigabe (npm run freigeben -- ${spec.id})`);
    continue;
  }
  if (fs.existsSync(audioPath) && fs.existsSync(timingPath)) {
    const old = JSON.parse(fs.readFileSync(timingPath, "utf8"));
    if (old.hash === hash) {
      console.log(`= ${spec.id} ist vertont`);
      continue;
    }
    // Stimmen aus der Zeit vor der Text-Prüfsumme gehören zu alten Skripten und dürfen ersetzt werden
    if (!redo && old.hash) {
      console.log(`! ${spec.id}: Text wurde nach dem Vertonen geändert. Die alte Stimme bleibt liegen und wird nicht benutzt.`);
      console.log(`  Bewusst neu vertonen (kostet ${text.length} Zeichen): npm run tts -- ${spec.id} --neu`);
      continue;
    }
  }
  console.log(`→ ${spec.id}: ${text.length} Zeichen`);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text, model_id: model, language_code: "de", voice_settings: settings }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`✗ ${spec.id}: ${res.status} ${body}`);
    if (body.includes("voice_not_found")) console.error("  → ELEVENLABS_VOICE_ID in .env ist keine gültige Voice-ID (ca. 20 Zeichen, in ElevenLabs unter Voices → ⋯ → Copy voice ID).");
    if (res.status === 401) console.error("  → ELEVENLABS_API_KEY in .env ist ungültig oder das Guthaben ist aufgebraucht.");
    console.error("Abbruch.");
    process.exit(1);
  }
  const data = (await res.json()) as {
    audio_base64: string;
    alignment: { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] };
  };
  fs.mkdirSync("public/audio", { recursive: true });
  fs.mkdirSync("content/timing", { recursive: true });
  const a = data.alignment;
  const words = a ? toWords(a.characters, a.character_start_times_seconds, a.character_end_times_seconds) : [];
  if (!words.length) {
    console.error(`✗ ${spec.id}: Keine Zeitmarken erhalten (Modell ${model}). Audio nicht übernommen. Bitte diese Meldung weitergeben.`);
    process.exit(1);
  }
  fs.writeFileSync(audioPath, Buffer.from(data.audio_base64, "base64"));
  fs.writeFileSync(timingPath, JSON.stringify({ hash, voiceId: VOICE, model, words }, null, 1));
  chars += text.length;
  const secs = words.at(-1)?.end ?? 0;
  console.log(`✓ ${spec.id}: ${secs.toFixed(1)} s${secs < 61 ? "  (unter 61 s – Skript etwas verlängern, falls über 1 Minute nötig)" : ""}`);
}
if (chars) console.log(`Verbraucht in diesem Lauf: ${chars} Zeichen.`);
