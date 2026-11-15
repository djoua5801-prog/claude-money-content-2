# Content-Maschine: Claude Code → TikTok-Erklärvideos

Skript (JSON) → ElevenLabs-Stimme mit Wort-Zeitmarken → Remotion-Animation mit Untertiteln → fertige 9:16-MP4 + Cover.

## Einrichten (einmalig)

```bash
npm install
cp .env.example .env      # ELEVENLABS_API_KEY + ELEVENLABS_VOICE_ID eintragen
```

## Täglicher Ablauf

| Befehl | Was passiert |
|---|---|
| `npm run preview` | Stumme Vorschau aller Videos (geschätztes Timing, ohne ElevenLabs) |
| `npm run tts` | Voiceover für alle Skripte ohne Audio holen |
| `npm run videos` | Voiceover → Daten → Rendern, alles in einem |
| `npm run render -- v03` | Nur ein Video neu rendern |
| `npm run studio` | Remotion Studio im Browser zum Anschauen/Feintunen |

Fertige Dateien landen in `out/` (`v01.mp4`, `v01-cover.png`).

## Ordner

```
content/videos/   ← ein JSON pro Video (Skript + Szenen + Posting-Text)
content/timing/   ← Wort-Zeitmarken von ElevenLabs (automatisch)
brand/brand.json  ← Farben, Schriften, Stimme, Tonalität
src/              ← Remotion-Vorlage (Szenen, Untertitel)
tools/            ← tts.ts, build-data.ts, render-all.ts
research/         ← Ideen-Backlog
ebooks/  site/    ← E-Books und Landingpage (folgen)
```

## Szenentypen

`hook` · `point` · `stat` · `terminal` · `list` · `cta` – siehe `src/types.ts`.
`*Wort*` in Texten wird in der Akzentfarbe hervorgehoben.
