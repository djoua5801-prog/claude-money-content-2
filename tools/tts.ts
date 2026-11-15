// ElevenLabs-Voiceover mit Wort-Zeitmarken erzeugen.
// Nutzung:  npm run tts            → alle Videos ohne vorhandenes Audio
//           npm run tts -- v01 v02 → nur diese IDs
//           npm run tts -- --force → alles neu
import "dotenv/config";
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
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));

const dir = "content/videos";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

const toWords = (chars: string[], starts: number[], ends: number[]): Word[] => {
  const words: Word[] = [];
  let cur = "";
  let s = 0;
  let e = 0;
  chars.forEach((ch, i) => {
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

for (const f of files) {
  const spec: VideoSpec = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  if (only.length && !only.includes(spec.id)) continue;
  const audioPath = `public/audio/${spec.id}.mp3`;
  const timingPath = `content/timing/${spec.id}.json`;
  if (!force && fs.existsSync(audioPath) && fs.existsSync(timingPath)) {
    console.log(`= ${spec.id} (vorhanden)`);
    continue;
  }
  const text = spec.scenes.map((s) => s.voice.trim()).join(" ");
  console.log(`→ ${spec.id}: ${text.split(/\s+/).length} Wörter`);
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: brand.voice.model,
        language_code: "de",
        voice_settings: brand.voice.settings,
      }),
    },
  );
  if (!res.ok) {
    const body = await res.text();
    console.error(`✗ ${spec.id}: ${res.status} ${body}`);
    if (body.includes("voice_not_found")) console.error("  → ELEVENLABS_VOICE_ID in .env ist keine gültige Voice-ID (ca. 20 Zeichen, in ElevenLabs unter Voices → ⋯ → Copy voice ID).");
    if (res.status === 401) console.error("  → ELEVENLABS_API_KEY in .env ist ungültig.");
    console.error("Abbruch: Es wird nichts gerendert, solange die Stimme fehlt.");
    process.exit(1);
  }
  const data = (await res.json()) as {
    audio_base64: string;
    alignment: { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] };
  };
  fs.mkdirSync("public/audio", { recursive: true });
  fs.mkdirSync("content/timing", { recursive: true });
  fs.writeFileSync(audioPath, Buffer.from(data.audio_base64, "base64"));
  const a = data.alignment;
  const words = toWords(a.characters, a.character_start_times_seconds, a.character_end_times_seconds);
  fs.writeFileSync(timingPath, JSON.stringify({ words }, null, 1));
  console.log(`✓ ${spec.id}: ${words.length} Wörter, ${words.at(-1)?.end.toFixed(1)} s`);
}
