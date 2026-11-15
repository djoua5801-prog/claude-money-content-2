# Content-Maschine: Claude Code → TikTok-Erklärvideos

Skript (JSON) → ElevenLabs-Stimme mit Wort-Zeitmarken → Remotion-Animation mit Untertiteln → fertige 9:16-MP4 + Cover.

## Einrichten (einmalig)

```bash
npm install
cp .env.example .env      # ELEVENLABS_API_KEY + ELEVENLABS_VOICE_ID eintragen
```

## Ablauf: erst Skript, dann Stimme

| Schritt | Befehl | Was passiert |
|---|---|---|
| 1 | `npm run skripte` | Zeigt alle Skripte mit Status, Länge und Zeichenzahl |
| 2 | `npm run preview -- v01` | Stumme Vorschau eines Skripts (kostet nichts) |
| 3 | `npm run freigeben -- v01 v02` | Skripte freigeben – erst danach gibt es eine Stimme |
| 4 | `npm run videos` | Vertont freigegebene Skripte **einmal** und rendert sie nach `out/` |

Ein vertontes Skript wird nie automatisch neu vertont. Nach einer Textänderung bewusst: `npm run tts -- v03 --neu`.
Weitere Befehle: `npm run studio` (Vorschau im Browser), `npm run leadmagnet` (Gratis-PDF).

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

## Animations-Pakete

- **Kinetic Typography** – aus [tombrewsviews/BYOA](https://github.com/tombrewsviews/BYOA) (MIT). Story in `story.json`, Render: `npx remotion render src/index.ts KineticStory out/kinetic.mp4`. Formen-Generator: `npm run kinetic shapes` (Recraft-API-Key nötig für neue Formen). Original-Beispiel: `content/kinetic-beispiel-byoa.json`.
- **Remotion Bits** – [av/remotion-bits](https://github.com/av/remotion-bits) (MIT), als npm-Paket installiert. Beispiele finden: `npx remotion-bits find "typewriter terminal"`.

Beide Skills liegen in `.claude/skills/` und werden von Claude Code in diesem Ordner automatisch erkannt.

## Kinetic-Hook

Die erste Szene (`hook`) jedes Videos wird automatisch als Kinetic-Typografie gezeigt, wortgenau zur Stimme. Wörter in `*Sternchen*` in der Headline werden zu Akzent-Wörtern. Abschalten pro Video: `"kineticHook": false`.

## Landingpage + Gratis-PDF

Siehe `site/README.md`. Inhalte des PDFs: `ebooks/lead-magnet/prompts.json`.

## Szenentypen

`hook` · `point` · `stat` · `terminal` · `list` · `cta` – siehe `src/types.ts`.
`*Wort*` in Texten wird in der Akzentfarbe hervorgehoben.
