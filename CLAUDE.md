# Anweisungen für Claude Code in diesem Repo

Projekt: automatisierte TikTok-Erklärvideos (Deutsch) zum Thema „Mit Claude Code Geld verdienen“, plus E-Books und Landingpage. Zwei Personen posten im selben Stil; die Videos sollen gleich aussehen und sich inhaltlich ergänzen.

## Ablauf – immer in dieser Reihenfolge
1. **Skript schreiben** (`content/videos/vNN.json`, `"approved": false`). Keine Stimme, kein Render.
2. **Freigabe durch den Nutzer.** Erst wenn er das Skript gelesen hat: `npm run freigeben -- vNN`.
3. **Stimme – genau eine Version pro Skript:** `npm run tts`. Vertont nur freigegebene Skripte, nie doppelt.
4. **Rendern:** `npm run videos` (vertont fehlende, rendert nur vertonte Videos).

Regeln dazu:
- Nie ein Skript vertonen, das der Nutzer nicht freigegeben hat. Nie `approved` selbst auf true setzen, außer der Nutzer sagt es ausdrücklich.
- Textänderungen gehören VOR die Freigabe. Ein vertontes Skript nicht mehr ändern. Wenn doch nötig: dem Nutzer sagen, dass das neu kostet, und nur auf sein Ja `npm run tts -- vNN --neu`.
- Keine Varianten derselben Stimme erzeugen, Stimme/Modell in `brand/brand.json` und `.env` nicht wechseln.
- Stand ansehen: `npm run skripte` (Entwurf / freigegeben / vertont / Text geändert, Länge, Zeichen).

## Skript-Regeln
- Länge: **mindestens 61 Sekunden**, Ziel 65–70 s. Das sind bei dieser Stimme ca. 1.080–1.150 Zeichen Sprechtext (≈ 16,5 Zeichen/Sekunde). `npm run skripte` zeigt die Zeichenzahl.
- Aufbau wie in v01–v10: `hook` → 3 Kapitel (`chapter` 01/02/03, abwechselnd `"alt": true`) mit je 1–2 Szenen → `cta`.
- Szene 1 ist immer `hook`: ein konkreter Satz; Akzent-Wörter in der `headline` mit `*Sternchen*`, letztes Akzent-Wort kurz (wird groß gezeigt).
- `point`-Szenen werden als „Schritt n von N“ gezeigt; `num` fortlaufend.
- Bildschirmtext kurz (max. ~8 Wörter); `voice` ausführlicher. Zahlen im `voice` ausschreiben.
- Du-Form. Keine Einkommensversprechen, keine erfundenen Ergebnisse, keine erfundenen Zahlen.
- Ideen aus `research/ideen-backlog.md`; erledigte abhaken. Mit dem Kollegen abgestimmte Themen dort eintragen, damit nichts doppelt entsteht.

## Stil (gemeinsam mit dem Kollegen)
Dunkler Grund, Amber als Akzent, Violett als Zweitfarbe, schmale fette Überschriften (Archivo), kleine Mono-Labels, Eck-Markierungen, Kapitelkarten vollflächig, Untertitel als dunkle Pille. Alles in `brand/brand.json`, `src/Explainer.tsx`, `src/scenes/Scenes.tsx`. Stil nicht ohne Rückfrage ändern.

## Weitere Bausteine
- Kinetic-Hook (`"kineticHook": true` pro Video) und Kinetic-Clips: `src/kinetic/`, Skill `kinetic-storytelling`. Recraft-Formen kosten Geld: nie `--force` ohne Rückfrage.
- Remotion Bits (npm `remotion-bits`) und offizielle Remotion-Skills in `.claude/skills/` (`remotion-best-practices` ist der Einstieg).
- Figur: eigener Roboterhund `src/Dog.tsx`, derzeit aus (`"mascot": false` in `brand/brand.json`). Nicht an fremde Maskottchen oder Produkte angleichen.
- Landingpage `site/` (statisch), Gratis-PDF aus `ebooks/lead-magnet/prompts.json` mit `npm run leadmagnet`. Keine erfundenen Bewertungen oder Zahlen.

## Marke
Keine Emojis im Video, kein Anthropic-Logo, „Claude“ nur beschreibend nennen.
