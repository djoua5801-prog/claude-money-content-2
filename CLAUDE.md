# Anweisungen für Claude Code in diesem Repo

Projekt: automatisierte TikTok-Erklärvideos (Deutsch) zum Thema „Mit Claude Code Geld verdienen“, plus E-Books und Landingpage.

## Neue Videos erstellen
Wenn der Nutzer z. B. „mach 10 neue Videos“ sagt:
1. Ideen aus `research/ideen-backlog.md` nehmen (erledigte abhaken) oder neue vorschlagen.
2. Pro Video eine Datei `content/videos/vNN.json` im Format von `src/types.ts` anlegen (fortlaufende Nummer).
3. Regeln für Skripte:
   - 30–45 Sekunden, ca. 80–110 gesprochene Wörter, Du-Form, Deutsch.
   - Szene 1 ist immer `hook`: provokanter, konkreter Satz in den ersten 2 Sekunden.
   - Letzte Szene ist immer `cta`.
   - Bildschirmtext kurz (max. ~8 Wörter pro Headline); der gesprochene Text (`voice`) darf ausführlicher sein.
   - Zahlen im `voice`-Feld ausschreiben („zehn“ statt „10“), damit die Stimme sie richtig spricht.
   - Keine Einkommensversprechen, keine erfundenen Ergebnisse. Echte Demos statt Hype.
4. `npm run videos` ausführen, dann Cover in `out/` prüfen.

## Marke
Farben/Schriften/Stimme in `brand/brand.json`. Keine Emojis im Video, kein Anthropic-Logo, „Claude“ nur beschreibend nennen.
