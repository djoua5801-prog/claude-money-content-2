# Landingpage

Statische Seite, keine Build-Schritte. Lokal ansehen: `npx serve site`.

Vor dem Livegang:
1. `index.html`: `FORMULAR_URL_HIER_EINTRAGEN` durch die Formular-URL deines E-Mail-Tools ersetzen (Double-Opt-in aktivieren, Weiterleitung auf `danke.html`).
2. `impressum.html` und `datenschutz.html` ausfüllen.
3. Veröffentlichen: `npx vercel site --prod`.

Das PDF liegt unter `downloads/15-prompts.pdf` (neu bauen: `npm run leadmagnet`). Verschickt wird es per Link in der Bestätigungs-Mail.
