import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_DISPLAY, H, SAFE } from "./theme";
import type { Word } from "./types";

// TikTok-Untertitel: Gruppen von max. 3 Wörtern, aktives Wort in Akzentfarbe.
const groupWords = (words: Word[], max = 3) => {
  const groups: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    const endsSentence = /[.!?:,]$/.test(w.text);
    if (cur.length >= max || endsSentence) {
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
  const g = groups.find((grp) => t >= grp[0].start && t < (groups[groups.indexOf(grp) + 1]?.[0].start ?? grp[grp.length - 1].end + 0.3));
  if (!g) return null;
  return (
    <AbsoluteFill style={{ top: H - SAFE.bottom - 300, height: 260, alignItems: "center", justifyContent: "center", paddingLeft: SAFE.left, paddingRight: SAFE.right }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 68, textAlign: "center", lineHeight: 1.15, letterSpacing: -1 }}>
        {g.map((w, i) => {
          const active = t >= w.start && t < w.end + 0.05;
          return (
            <span
              key={i}
              style={{
                color: active ? C.accentInk : C.text,
                background: active ? C.accent : "transparent",
                borderRadius: 12,
                padding: "2px 12px",
                margin: "0 2px",
              }}
            >
              {w.text.replace(/\*/g, "")}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
