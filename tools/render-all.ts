// Rendert Videos + Cover nach out/.
// Nutzung: npm run render            → alle
//          npm run render -- v01 v03 → nur diese
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import videos from "../src/generated/videos.json";

// Remotion direkt über Node starten (funktioniert auch unter Windows, wo "npx" eine .cmd-Datei ist)
const remotion = (args: string[]) => execFileSync(process.execPath, ["node_modules/@remotion/cli/remotion-cli.js", ...args], { stdio: "inherit" });
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const voicedOnly = process.argv.includes("--nur-vertont");
const browser = process.env.REMOTION_BROWSER ? ["--browser-executable", process.env.REMOTION_BROWSER] : [];
fs.mkdirSync("out", { recursive: true });

for (const v of videos as { id: string; audio: string | null; scenes: { start: number; end: number }[] }[]) {
  if (only.length && !only.includes(v.id)) continue;
  if (voicedOnly && !v.audio) continue;
  if (voicedOnly && fs.existsSync(`out/${v.id}.mp4`) && fs.statSync(`out/${v.id}.mp4`).mtimeMs > fs.statSync(`public/${v.audio}`).mtimeMs && !only.length) {
    console.log(`= ${v.id} ist schon gerendert`);
    continue;
  }
  console.log(`▶ ${v.id}`);
  remotion(["render", "src/index.ts", v.id, `out/${v.id}.mp4`, "--crf", "20", ...browser]);
  // Cover = Moment kurz nach dem Hook-Einstieg
  const coverFrame = Math.round(Math.max(0.5, v.scenes[0].end - 0.3) * 30);
  remotion(["still", "src/index.ts", v.id, `out/${v.id}-cover.png`, `--frame=${coverFrame}`, ...browser]);
}
