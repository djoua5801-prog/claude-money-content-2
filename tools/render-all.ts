// Rendert Videos + Cover nach out/.
// Nutzung: npm run render            → alle
//          npm run render -- v01 v03 → nur diese
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import videos from "../src/generated/videos.json";

const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const browser = process.env.REMOTION_BROWSER ? ["--browser-executable", process.env.REMOTION_BROWSER] : [];
fs.mkdirSync("out", { recursive: true });

for (const v of videos as { id: string; scenes: { start: number; end: number }[] }[]) {
  if (only.length && !only.includes(v.id)) continue;
  console.log(`▶ ${v.id}`);
  execFileSync("npx", ["remotion", "render", "src/index.ts", v.id, `out/${v.id}.mp4`, "--crf", "20", ...browser], { stdio: "inherit" });
  // Cover = Moment kurz nach dem Hook-Einstieg
  const coverFrame = Math.round(Math.min(1.2, v.scenes[0].end - 0.2) * 30);
  execFileSync("npx", ["remotion", "still", "src/index.ts", v.id, `out/${v.id}-cover.png`, `--frame=${coverFrame}`, ...browser], { stdio: "inherit" });
}
