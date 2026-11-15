# PROJECT_STATUS

Stand: 15.11.2026, 18:35 Uhr · Auftrag und Arbeitsweise: `docs/MASTER-PROMPT.md`

## Aktuelle Phase
Bestandsaufnahme abgeschlossen. Als Nächstes: Phase 1 (Viral Research) und Phase 2 (Hook Engine), danach zweiter Videolauf.

## Bestandsaufnahme (Ist-Zustand, geprüft)

| Phase laut Master-Prompt | Stand | Geprüft wie |
|---|---|---|
| 1 Viral Research Agent | **erste Runde erledigt** (15.11.) – vier Research-Dateien mit Quellen; wöchentliche Automatik fehlt noch | Dateien |
| 2 Viral Hook Engine | **für v01–v05 erledigt** – je 5 Hooks bewertet, stärkster gewählt; v06–v10 offen | Skripte |
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
1. **Videolänge:** wird vor jeder Erstellung erfragt (Regel vom 15.11.). Für v01–v10 noch offen; Entwürfe haben ~65–69 s.
2. Seriennamen und Themenaufteilung mit dem Kollegen.

## Bekannte Probleme
- v01–v05 haben noch kein vollständiges Themenblatt (Problem, Infowert, Tools, Demo, Wirkung fehlen als Felder); nachtragen, sobald Lauf 2 durch ist, ohne den Sprechtext zu ändern.
- Die Recherche deckt bisher nur Claude Code ab; die neun weiteren Themenfelder sind noch nicht recherchiert.
- ElevenLabs-Sprechfassung mit Betonungen/Pausen/Emotionen ist noch nicht umgesetzt.
- Die 10 Videos in `out/` auf dem PC sind alte Versionen (kurz, altes Design); ihre Stimmen passen nicht mehr zu den neuen Skripten.
- ElevenLabs-Guthaben: ca. 4.600 von 10.000 Credits verbraucht; ein langes Video kostet ca. 1.100.

## Festlegungen des Nutzers (15.11., 18:34)
- Vor jeder Erstellung nach der Durchschnittslänge fragen.
- Jedes Video braucht Unterschrift, Verweis und angepinnten Kommentar, die Zuschauer zu Leads aufwärmen → Feld `post`, für v01–v10 angelegt.
- **Zweiter Lauf erst auf ausdrückliches Startsignal.**
- (18:47) Geldbeträge, die der Nutzer nennt, sind seine echten Ergebnisse und werden ohne Rückfrage in Hooks übernommen. Ansagen umsetzen, nicht hinterfragen.

- (18:51) Vor jedem Lauf fragen: Länge, Anzahl, kommerziell oder informativ. E-Books immer mitdenken (`ebookBezug`). Hooks reißerisch (Thema + Claude Code, „ist tot, wenn …“, konkreter Betrag), danach gut informieren. Ton wie v03.

- (18:58) Content-Strategie vorgegeben: `docs/CONTENT-STRATEGIE.md`. Kanal wird breiter als Claude Code: zehn Themenfelder rund um KI-Creator, Social Media und Online-Einkommen. Jedes neue Thema bekommt ein Themenblatt (Problem, Infowert, Tools, Demo, Wirkung).

## Roadmap (priorisiert)
1. Länge für v01–v10 erfragen (Nutzer).
2. Phase 1: Research-Dateien anlegen, erste Recherche zu viralen Videos und Hooks, wöchentliche geplante Aufgabe.
3. Phase 2: Hook Engine – je Skript fünf Hooks mit Bewertung; v01–v10 überarbeiten.
4. Zweiter Lauf: Nutzer gibt Skripte frei → Stimme → Videos; Kontrolle am echten Ton.
5. Phase 4/5: Sprechregie für ElevenLabs, echte Terminal-Aufnahmen.
6. Phase 10: Video-Freigabe mit Status.
7. Phase 12: Funnel online (E-Mail-Tool, Impressum, Vercel), E-Book 1.
8. Phase 11: Posting-Tool, 13: Wochen-Report.

## Lauf 2 – gestartet vom Nutzer am 15.11., 18:54
Antworten auf die drei Fragen: **45 Sekunden · 5 Videos · gemischt** (v01, v02, v04 informativ; v03, v05 mit Verweis auf das Gratis-PDF). Skripte v01–v05 passen ohne Änderung. Offen: Nutzer führt Freigabe + `npm run videos` auf dem PC aus.

## Testlauf (vom Nutzer am 15.11. angesetzt)
5 Videos, Ziel 45 s, Hooks am 15.11. 18:51 auf reißerisch umgestellt (v02 mit „2.000 Euro pro Woche“ laut Nutzer). Ausrichtung kommerziell/informativ noch offen. v01–v05 neu geschrieben (700–750 Zeichen, zusammen ca. 3.600 Zeichen). Lesefassung: `content/TESTLAUF-5-SKRIPTE.md`. Wartet auf Freigabe durch den Nutzer: `npm run freigeben -- v01 v02 v03 v04 v05`, dann `npm run videos`. v06–v10 sind noch die langen Entwürfe und nicht Teil des Testlaufs.

## Nächster Arbeitsschritt
Nutzer liest die 5 Skripte und startet den Testlauf. Danach: Kontrolle am echten Ton, dann wöchentliche Recherche automatisieren.
