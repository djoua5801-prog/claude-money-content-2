// Skripte freigeben: erst danach wird die Stimme erzeugt.
// Nutzung: npm run freigeben -- v01 v02     (oder: npm run freigeben -- alle)
import fs from "node:fs";

const ids = process.argv.slice(2);
if (!ids.length) {
  console.error("Welche Skripte? z. B.: npm run freigeben -- v01 v02");
  process.exit(1);
}
for (const f of fs.readdirSync("content/videos").filter((x) => x.endsWith(".json")).sort()) {
  const p = `content/videos/${f}`;
  const spec = JSON.parse(fs.readFileSync(p, "utf8"));
  if (!ids.includes("alle") && !ids.includes(spec.id)) continue;
  spec.approved = true;
  fs.writeFileSync(p, JSON.stringify(spec, null, 1));
  const n = spec.scenes.map((s: { voice: string }) => s.voice.trim()).join(" ").length;
  console.log(`✓ ${spec.id} freigegeben (${n} Zeichen)`);
}
