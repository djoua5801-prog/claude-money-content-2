import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, DISPLAY, H, SAFE } from "./theme";
import type { Word } from "./types";

// Untertitel als dunkle Pille: kurze Wortgruppen, aktives Wort in Akzentfarbe.
const groupWords = (words: Word[], max = 4) => {
  const groups: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    const gap = cur.length ? w.start - cur[cur.length - 1].end : 0;
    if (cur.length && gap > 0.6) {
      groups.push(cur);
      cur = [];
    }
    cur.push(w);
    const endsSentence = /[.!?:]$/.test(w.text);
    if (cur.length >= max || endsSentence || cur.map((x) => x.text).join(" ").length > 20) {
      groups.push(cur);
      cur = [];
    }
  }
  if (cur.length) groups.push(cur);
  return groups;
};

export const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const groups = React.useMemo(() => groupWords(words), [words]);
  const idx = groups.findIndex((grp, i) => t >= grp[0].start - 0.05 && t < Math.min(groups[i + 1]?.[0].start ?? Infinity, grp[grp.length - 1].end + 0.5));
  if (idx < 0) return null;
  const g = groups[idx];
  return (
    <AbsoluteFill style={{ top: H - SAFE.bottom - 250, height: 170, alignItems: "center", justifyContent: "center", paddingLeft: SAFE.left, paddingRight: SAFE.right }}>
      <div style={{ ...DISPLAY, fontWeight: 700, fontSize: 54, lineHeight: 1.15, textAlign: "center", background: C.surface, border: `2px solid ${C.line}`, borderRadius: 18, padding: "16px 34px", boxShadow: "0 20px 50px #00000066" }}>
        {g.map((w, i) => {
          const spoken = t >= w.start - 0.03;
          const active = spoken && t < w.end + 0.08;
          return (
            <span key={i} style={{ color: active ? C.accent : C.text, opacity: spoken ? 1 : 0.35, marginRight: i < g.length - 1 ? 14 : 0 }}>
              {w.text.replace(/\*/g, "")}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
