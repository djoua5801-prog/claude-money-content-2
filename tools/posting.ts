// Schreibt für jedes Video die fertige Unterschrift mit Verweis, Hashtags und angepinntem Kommentar.
// Nutzung: npm run posting   → out/posting/vNN.txt
import fs from "node:fs";
import type { VideoSpec } from "../src/types";

fs.mkdirSync("out/posting", { recursive: true });
for (const f of fs.readdirSync("content/videos").filter((x) => x.endsWith(".json")).sort()) {
  const v: VideoSpec = JSON.parse(fs.readFileSync(`content/videos/${f}`, "utf8"));
  if (!v.post) {
    console.log(`! ${v.id}: keine Unterschrift hinterlegt`);
    continue;
  }
  const tags = v.hashtags.map((t) => "#" + t).join(" ");
  const text = [`UNTERSCHRIFT (${v.id} – ${v.title})`, "", v.post.caption, "", v.post.verweis, "", tags, "", "ANGEPINNTER KOMMENTAR", "", v.post.pinnedComment, "", `Ziel dieses Videos: ${v.post.ziel}`, ""].join("\n");
  fs.writeFileSync(`out/posting/${v.id}.txt`, text);
  console.log(`✓ ${v.id}  → ${v.post.ziel}`);
}
