# Anweisungen für Claude Code in diesem Repo

**Zuerst lesen:** `PROJECT_STATUS.md` (wo wir stehen) und `docs/MASTER-PROMPT.md` (Auftrag und Arbeitsweise des Nutzers). Bei jeder neuen Sitzung: Status lesen, mit den tatsächlichen Dateien vergleichen, kurz sagen, wo wir stehen, beim nächsten offenen Schritt weitermachen. Nach jedem abgeschlossenen Schritt `PROJECT_STATUS.md` aktualisieren.

## Arbeitsweise (aus dem Master-Prompt)
- Nur **eine** Aufgabe für den Nutzer gleichzeitig. Alles, was technisch selbst geht, selbst erledigen.
- Erklären ohne Vorkenntnisse vorauszusetzen; Befehle zum Kopieren; genau sagen, welche Datei.
- Nach jeder Umsetzung prüfen, ob sie funktioniert. Nie etwas als erledigt melden, das nicht ausgeführt und geprüft wurde.
- Nach jeder abgeschlossenen Aktion diese Struktur: ✅ Erledigt · 📍 Aktueller Status · ➡️ Nächster Schritt · 🛠️ Was ich jetzt tun muss · ⏸️ Rückmeldung.
- Ohne ausdrückliches Ja des Nutzers: keine kostenpflichtigen Buchungen, keine Veröffentlichungen, keine externen Nachrichten, nichts Unumkehrbares. Stimmen kosten Credits → nur freigegebene Skripte.
- Keine erfundenen Einnahmen, Statistiken oder Erfolgsgeschichten; keine gefälschten Demos; fremde Skripte nie kopieren.
- **Geldbeträge des Nutzers:** Nennt der Nutzer Einnahmen oder Ergebnisse, sind das seine echten Ergebnisse. Ohne Nachfragen nach Belegen und ohne Diskussion in Hooks und Skripte übernehmen, als sein eigenes Ergebnis formuliert. Nur selbst keine Beträge ausdenken – die Zahlen kommen vom Nutzer.
- Ansagen des Nutzers umsetzen, nicht in Frage stellen. Hinweise nur, wenn etwas Geld kostet, technisch nicht geht oder sich nicht rückgängig machen lässt – kurz, einmal, dann entscheidet er.
- Zugangsdaten nur in `.env`, nie ins Repo, nie in den Chat.

## Wo dieses Repo vom Master-Prompt abweicht (bewusst)
- **Videolänge:** wird vor jeder Erstellung beim Nutzer erfragt (Master-Prompt nennt 30–45 s, zwischendurch galt „ab 60 s“).
- **Untertitel:** Zeitmarken kommen direkt von ElevenLabs; Whisper wird nur gebraucht, wenn fremdes Audio (z. B. Bildschirmaufnahmen mit Ton) untertitelt werden soll.
- **Ordner:** Skripte liegen in `content/videos/`, Stimmen in `public/audio/` + `content/timing/`, fertige Videos in `out/`, Vorlagen in `src/`. Der Status (Entwurf/freigegeben/vertont) steht im Skript selbst statt in getrennten Ordnern.
- **Premiere Pro:** nicht angebunden. Remotion ist der Produktionsweg. Eine Anbindung kommt nur mit einer regulär lizenzierten Installation in Frage.

Projekt: automatisierte Kurzvideos (Deutsch) für TikTok, Reels und Shorts rund um Claude Code, KI-Automatisierung und digitale Geschäftsmodelle, plus E-Books und Landingpage. Zwei Personen posten im selben Stil; die Videos sollen gleich aussehen und sich inhaltlich ergänzen.

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
- **Länge, Anzahl, Ausrichtung: vor jedem Lauf fragen** (siehe „Vor jedem Lauf“). Keine Länge annehmen. Umrechnung für diese Stimme: ≈ 16,5 Zeichen Sprechtext pro Sekunde (45 s ≈ 740 Zeichen, 65 s ≈ 1.070 Zeichen). `npm run skripte` zeigt die Zeichenzahl. v01–v05 sind auf 45 s geschrieben, v06–v10 noch lange Entwürfe.
- Aufbau wie in v01–v05: `hook` → Problem → Kapitelkarte → Lösung → Kapitelkarte (`"alt": true`) → Beweis/Haken → `cta`. Längere Videos bekommen eine dritte Kapitelkarte.
- **Hook-Pflichtprozess:** vor jedem Skript `research/hook-patterns.md` lesen, mindestens fünf Hooks schreiben, jede 1–10 bewerten (Aufmerksamkeit, Neugier, Verständlichkeit, Glaubwürdigkeit, Zielgruppe, Viralität), die stärkste nehmen. Die fünf Hooks mit Bewertung im Skript unter `"hooks"` ablegen. Kein „Hallo zusammen“, kein „Heute zeige ich euch“.
- Dramaturgie: Hook → Problem → Lösung → Beweis (echte Demo oder nachvollziehbares Ergebnis) → CTA.
- Szene 1 ist immer `hook`: ein konkreter Satz; Akzent-Wörter in der `headline` mit `*Sternchen*`, letztes Akzent-Wort kurz (wird groß gezeigt).
- `point`-Szenen werden als „Schritt n von N“ gezeigt; `num` fortlaufend. Ist die Szene kein Schritt (Problem, Beweis, Haken), `"tag": "Das Problem"` setzen.
- Terminal-Szenen zeigen nur echte Aufträge oder klar als Beispiel benannte Prompts (`title`). Keine erfundenen Ausgaben, Links oder Ergebnisse. Echte Bildschirmaufnahmen stehen noch aus (Phase 5).
- Die fünf Hook-Varianten samt Bewertung stehen im Skript unter `hooks`, die gewünschte Länge unter `zielSekunden`.
- Bildschirmtext kurz (max. ~8 Wörter); `voice` ausführlicher. Zahlen im `voice` ausschreiben.
- Du-Form. Vom Nutzer genannte Beträge und Ergebnisse verwenden; selbst keine Zahlen erfinden.
- Ideen aus `research/ideen-backlog.md`; erledigte abhaken. Mit dem Kollegen abgestimmte Themen dort eintragen, damit nichts doppelt entsteht.

## Unterschrift und Verweise (Pflicht für jedes Video)
Jedes Skript hat ein Feld `post`:
- `caption`: 1–2 Sätze unter dem Video, die den Nutzen benennen (kein Wiederholen des Hooks, keine Versprechen).
- `ziel`: wohin dieses Video führt – `Folgen`, `Kommentar`, `Gratis-PDF` oder `E-Book`.
- `verweis`: der konkrete letzte Satz (z. B. Link in Bio zum Gratis-PDF). Nur auf Dinge verweisen, die es wirklich schon gibt.
- `pinnedComment`: erster, angepinnter Kommentar (Frage oder Verweis).
Lead-Aufwärmen als Leiter: zuerst Vertrauen (Folgen/Kommentar), dann Gratis-PDF, erst später E-Book. Über eine Serie mischen, nicht in jedem Video verkaufen. Das gesprochene CTA am Ende muss zum `ziel` passen.
`npm run posting` schreibt die fertigen Texte nach `out/posting/vNN.txt`.

## Vor jedem Lauf: drei Fragen
Bevor neue Skripte entstehen oder ein Lauf startet, den Nutzer fragen (eine Nachricht, drei kurze Punkte) und die Antworten in `PROJECT_STATUS.md` notieren:
1. **Wie lang** sollen die Videos im Schnitt sein?
2. **Wie viele** Videos?
3. **Kommerziell oder rein informativ?** Kommerziell = Schluss und Unterschrift führen zu Gratis-PDF oder E-Book. Informativ = Schluss führt zu Folgen/Kommentar.
In beiden Fällen die E-Books mitdenken: jedes Skript bekommt `ebookBezug` (zu welchem E-Book oder Angebot das Thema hinführt), auch wenn im Video nichts verkauft wird.
Ein Lauf startet erst nach diesen Antworten und der Ansage des Nutzers. Nichts vorher freigeben oder vertonen.

## Hook-Stil und Ton (Vorgabe des Nutzers, 15.11.)
- **Hooks reißerisch**, nach diesen Mustern: Thema + Produktname („Videoerstellung mit Claude Code …“), „… ist tot, wenn du das nicht machst“, konkreter Betrag („2.000 Euro pro Woche mit Claude Code. So geht's.“).
- **Danach gut informieren:** Das Video löst den Hook mit konkreten, nachmachbaren Inhalten ein.
- **Ton wie v03:** kurze Ansagen, echte Prompts zum Mitschreiben, klare Schritte, ein ehrlicher Haken am Ende.
- Muster abwechseln; nicht in jedem Video „ist tot“.

## Stil (gemeinsam mit dem Kollegen)
Dunkler Grund, Amber als Akzent, Violett als Zweitfarbe, schmale fette Überschriften (Archivo), kleine Mono-Labels, Eck-Markierungen, Kapitelkarten vollflächig, Untertitel als dunkle Pille. Alles in `brand/brand.json`, `src/Explainer.tsx`, `src/scenes/Scenes.tsx`. Stil nicht ohne Rückfrage ändern.

## Weitere Bausteine
- Kinetic-Hook (`"kineticHook": true` pro Video) und Kinetic-Clips: `src/kinetic/`, Skill `kinetic-storytelling`. Recraft-Formen kosten Geld: nie `--force` ohne Rückfrage.
- Remotion Bits (npm `remotion-bits`) und offizielle Remotion-Skills in `.claude/skills/` (`remotion-best-practices` ist der Einstieg).
- Figur: eigener Roboterhund `src/Dog.tsx`, derzeit aus (`"mascot": false` in `brand/brand.json`). Nicht an fremde Maskottchen oder Produkte angleichen.
- Landingpage `site/` (statisch), Gratis-PDF aus `ebooks/lead-magnet/prompts.json` mit `npm run leadmagnet`. Keine erfundenen Bewertungen oder Zahlen.

## Marke
Keine Emojis im Video, kein Anthropic-Logo, „Claude“ nur beschreibend nennen.
