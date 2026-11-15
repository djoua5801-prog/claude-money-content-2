# PROJECT_STATUS

Stand: 15.11.2026, 18:35 Uhr · Auftrag und Arbeitsweise: `docs/MASTER-PROMPT.md`

## Aktuelle Phase
Bestandsaufnahme abgeschlossen. Als Nächstes: Phase 1 (Viral Research) und Phase 2 (Hook Engine), danach zweiter Videolauf.

## Bestandsaufnahme (Ist-Zustand, geprüft)

| Phase laut Master-Prompt | Stand | Geprüft wie |
|---|---|---|
| 1 Viral Research Agent | **fehlt** – nur `research/ideen-backlog.md` | Dateien |
| 2 Viral Hook Engine | **fehlt** – Hooks bisher ohne 5er-Auswahl und Bewertung | Skripte |
| 3 Skript-Generator | **teilweise** – 10 Skripte (Entwurf, ~65–69 s, Kapitel-Aufbau); Dramaturgie Problem/Beweis noch nicht durchgängig | `npm run skripte` |
| 4 ElevenLabs Voiceover | **läuft** – Stimme + Wort-Zeitmarken, eine Version pro Skript, nur nach Freigabe; Sprechregie (Pausen, Betonung) fehlt | 10 Stimmen auf dem PC erzeugt |
| 5 Assets / echte Terminal-Demos | **fehlt** – Terminal-Szenen sind nachgebaut, keine echten Aufnahmen | Code |
| 6 Remotion Video Engine | **läuft** – Hook, Kapitel, Schritt, Zahl, Terminal, Liste, CTA; Kinetic-Typo; Stil wie Kollege | 10 Videos auf dem PC gerendert (altes Design), neues Design hier gerendert |
| 7 Untertitel | **läuft** über ElevenLabs-Zeitmarken (Whisper nicht nötig) | Render |
| 8 Premiere Pro | **nicht angebunden** – Remotion ist der Weg | – |
| 9 Cover und Karussells | **teilweise** – Cover-PNG pro Video automatisch; Karussells fehlen | `out/*-cover.png` |
| 10 Content-Freigabe | **teilweise** – Skript-Freigabe vorhanden; Video-Freigabe (Status nach dem Rendern) fehlt | Code |
| 11 Verteilung | **fehlt** – kein Posting-Tool, keine Konten angebunden | – |
| 12 Verkaufsfunnel | **teilweise** – Landingpage + Gratis-PDF gebaut, nicht online; E-Mail-Tool, Impressum, E-Books, Verkauf fehlen | Dateien |
| 13 Performance-Analyse | **fehlt** | – |
| 18 Session-Management | **neu angelegt** (diese Datei) | – |

## Umgebung
- GitHub: `djoua5801-prog/claude-money-content-2` (öffentlich – auf privat stellen steht aus), Schreibzugriff funktioniert.
- PC (Windows): Projekt in `C:\Users\Djoua\Claude 15.11.2026\claude-money-content-2`, Node.js 24.15 + npm funktionieren, `npm install` gelaufen, Rendern funktioniert.
- Nicht geprüft auf dem PC: Git, ffmpeg, OBS/VHS, Claude Code selbst.
- APIs: ElevenLabs verbunden (Key + Voice-ID in `.env`, kostenloser Tarif; für kommerzielle Nutzung ist ein bezahlter Tarif nötig – vom Nutzer zu prüfen). Sonst nichts verbunden.
- Fehlende Zugänge: E-Mail-Tool (Brevo/Kit), Vercel, Posting-Tool, Verkaufsplattform, TikTok/Instagram/YouTube-Konten.

## Offene Entscheidungen des Nutzers
1. **Videolänge:** Master-Prompt sagt 30–45 s, die letzte Ansage war „ab 60 Sekunden“. Aktuell gebaut: ≥ 61 s.
2. Seriennamen und Themenaufteilung mit dem Kollegen.

## Bekannte Probleme
- Die 10 Videos in `out/` auf dem PC sind alte Versionen (kurz, altes Design); ihre Stimmen passen nicht mehr zu den neuen Skripten.
- ElevenLabs-Guthaben: ca. 4.600 von 10.000 Credits verbraucht; ein langes Video kostet ca. 1.100.

## Roadmap (priorisiert)
1. Videolänge klären (Nutzer).
2. Phase 1: Research-Dateien anlegen, erste Recherche zu viralen Videos und Hooks, wöchentliche geplante Aufgabe.
3. Phase 2: Hook Engine – je Skript fünf Hooks mit Bewertung; v01–v10 überarbeiten.
4. Zweiter Lauf: Nutzer gibt Skripte frei → Stimme → Videos; Kontrolle am echten Ton.
5. Phase 4/5: Sprechregie für ElevenLabs, echte Terminal-Aufnahmen.
6. Phase 10: Video-Freigabe mit Status.
7. Phase 12: Funnel online (E-Mail-Tool, Impressum, Vercel), E-Book 1.
8. Phase 11: Posting-Tool, 13: Wochen-Report.

## Nächster Arbeitsschritt
Antwort des Nutzers zur Videolänge abwarten, dann Phase 1 starten.
