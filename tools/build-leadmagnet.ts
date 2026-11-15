// Baut das Gratis-PDF aus ebooks/lead-magnet/prompts.json → site/downloads/15-prompts.pdf
// Nutzung: npm run leadmagnet
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import brand from "../brand/brand.json";

type P = { title: string; prompt: string; tip: string };
const data = JSON.parse(fs.readFileSync("ebooks/lead-magnet/prompts.json", "utf8")) as {
  title: string; subtitle: string; intro: string; outro: string;
  sections: { name: string; prompts: P[] }[];
};
const C = brand.colors;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const hl = (s: string) => esc(s).replace(/\[([^\]]+)\]/g, '<span class="var">[$1]</span>');
const font = (f: string) => "file://" + path.resolve("site/fonts", f);

let n = 0;
const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>${esc(data.title)}</title><style>
@font-face{font-family:SG;font-weight:500;src:url("${font("space-grotesk-latin-500-normal.woff2")}")}
@font-face{font-family:SG;font-weight:700;src:url("${font("space-grotesk-latin-700-normal.woff2")}")}
@font-face{font-family:JM;font-weight:500;src:url("${font("jetbrains-mono-latin-500-normal.woff2")}")}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0}
body{font-family:SG,sans-serif;font-weight:500;color:#16161c;font-size:11pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cover{height:297mm;background:${C.bg};color:${C.text};padding:28mm 22mm;display:flex;flex-direction:column;justify-content:space-between;page-break-after:always}
.cover .k{font-family:JM;font-size:10pt;letter-spacing:2px;color:${C.accent}}
.cover h1{font-size:44pt;line-height:1.02;letter-spacing:-1.5px;font-weight:700;text-wrap:balance}
.cover h1 b{color:${C.accent}}
.cover p{font-size:14pt;color:${C.muted};margin-top:10mm;max-width:130mm}
.cover .big{font-family:JM;font-size:120pt;color:${C.accent};line-height:.9}
.page{padding:15mm 22mm 0;page-break-after:always}
.page:last-child{page-break-after:auto}
.intro{font-size:11pt;max-width:160mm}
h2{font-size:24pt;letter-spacing:-.6px;font-weight:700;margin-bottom:6mm;padding-bottom:2.5mm;border-bottom:1.5pt solid #16161c}
h2 span{font-family:JM;font-size:10pt;color:#6b6b78;letter-spacing:1.5px;display:block;margin-bottom:2mm}
.p{margin-bottom:5mm;break-inside:avoid}
.p h3{font-size:13pt;font-weight:700;display:flex;gap:4mm;align-items:baseline;margin-bottom:2.5mm}
.p h3 i{font-family:JM;font-style:normal;font-size:10pt;background:${C.accent};padding:.5mm 2mm;border-radius:1.5mm}
.box{background:${C.bg};color:${C.text};font-family:JM;font-size:9pt;line-height:1.6;padding:3.5mm 4.5mm;border-radius:2.5mm}
.var{color:${C.accent}}
.tip{font-size:9.5pt;color:#4a4a55;margin-top:2.2mm;padding-left:4mm;border-left:1.5pt solid ${C.accent}}
.outro{margin-top:7mm;font-size:11.5pt;font-weight:700}
</style></head><body>
<section class="cover"><div><div class="k">GRATIS-PDF</div></div>
<div><div class="big">15</div><h1>Claude-Code-Prompts, mit denen du <b>Geld verdienen</b> kannst</h1><p>${esc(data.subtitle)}</p></div>
<div><p style="font-size:10.5pt;margin:0 0 8mm;max-width:150mm;color:${C.text}">${esc(data.intro)}</p><div class="k">${esc(brand.name.replace("Arbeitstitel: ", "").toUpperCase())}</div></div></section>
${data.sections.map((s, si) => `<section class="page">
<h2><span>TEIL ${si + 1}</span>${esc(s.name)}</h2>
${s.prompts.map((p) => `<div class="p"><h3><i>${String(++n).padStart(2, "0")}</i>${esc(p.title)}</h3><div class="box">${hl(p.prompt)}</div><div class="tip">${esc(p.tip)}</div></div>`).join("")}
${si === data.sections.length - 1 ? `<p class="outro">${esc(data.outro)}</p>` : ""}
</section>`).join("")}
</body></html>`;

fs.mkdirSync("site/downloads", { recursive: true });
const tmp = path.resolve("ebooks/lead-magnet/_build.html");
fs.writeFileSync(tmp, html);
const chrome = process.env.REMOTION_BROWSER || (process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "google-chrome");
execFileSync(chrome, ["--headless=new", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${path.resolve("site/downloads/15-prompts.pdf")}`, "file://" + tmp], { stdio: "inherit" });
fs.unlinkSync(tmp);
console.log("✓ site/downloads/15-prompts.pdf");
