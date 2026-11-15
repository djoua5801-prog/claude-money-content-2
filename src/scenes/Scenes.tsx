import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_DISPLAY, FONT_MONO, SAFE } from "../theme";
import type { TimedScene } from "../types";

// Gemeinsamer Ein-Effekt: von unten hereinschieben + einblenden
const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 140 } });
  return { opacity: s, transform: `translateY(${(1 - s) * 60}px)` };
};

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      paddingTop: SAFE.top,
      paddingLeft: SAFE.left,
      paddingRight: SAFE.right,
      paddingBottom: 700, // Platz für Untertitel + TikTok-UI
      justifyContent: "center",
      fontFamily: FONT_DISPLAY,
      color: C.text,
    }}
  >
    {children}
  </AbsoluteFill>
);

// Hebt *Wörter in Sternchen* in der Akzentfarbe hervor
const Rich: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(/(\*[^*]+\*)/g).map((part, i) =>
      part.startsWith("*") ? (
        <span key={i} style={{ color: C.accent }}>
          {part.slice(1, -1)}
        </span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
  </>
);

const Hook: React.FC<{ s: Extract<TimedScene, { type: "hook" }> }> = ({ s }) => {
  const a = useEnter(0);
  const b = useEnter(6);
  return (
    <Stage>
      {s.kicker && (
        <div style={{ ...a, fontFamily: FONT_MONO, fontSize: 34, color: C.accent, marginBottom: 36, letterSpacing: 2 }}>
          {s.kicker.toUpperCase()}
        </div>
      )}
      <div style={{ ...b, fontSize: 104, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, textWrap: "balance" }}>
        <Rich text={s.headline} />
      </div>
    </Stage>
  );
};

const Point: React.FC<{ s: Extract<TimedScene, { type: "point" }> }> = ({ s }) => {
  const a = useEnter(0);
  const b = useEnter(5);
  const c = useEnter(10);
  return (
    <Stage>
      <div style={{ ...a, fontFamily: FONT_MONO, fontSize: 180, fontWeight: 500, color: C.accent, lineHeight: 1 }}>
        {String(s.num).padStart(2, "0")}
      </div>
      <div style={{ ...b, fontSize: 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, marginTop: 30, textWrap: "balance" }}>
        <Rich text={s.headline} />
      </div>
      {s.sub && (
        <div style={{ ...c, fontSize: 44, fontWeight: 500, color: C.muted, marginTop: 30, lineHeight: 1.3 }}>
          <Rich text={s.sub} />
        </div>
      )}
    </Stage>
  );
};

const Stat: React.FC<{ s: Extract<TimedScene, { type: "stat" }> }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = useEnter(0);
  const b = useEnter(8);
  // Zahl hochzählen, falls der Wert eine Zahl enthält (z. B. "20 Min", "49 €")
  const m = s.value.match(/^(\D*)(\d+)(.*)$/);
  const p = spring({ frame, fps, config: { damping: 30, stiffness: 60 } });
  const shown = m ? `${m[1]}${Math.round(Number(m[2]) * p)}${m[3]}` : s.value;
  return (
    <Stage>
      <div style={{ ...a, fontSize: 260, fontWeight: 700, letterSpacing: -10, color: C.accent, lineHeight: 0.9 }}>{shown}</div>
      <div style={{ ...b, fontSize: 60, fontWeight: 500, marginTop: 40, lineHeight: 1.15, textWrap: "balance" }}>
        <Rich text={s.label} />
      </div>
    </Stage>
  );
};

const Terminal: React.FC<{ s: Extract<TimedScene, { type: "terminal" }> }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = useEnter(0);
  const totalChars = s.lines.join("").length;
  const sceneFrames = (s.end - s.start) * fps;
  // Tippen über 70 % der Szenendauer verteilen
  const typed = Math.floor(interpolate(frame, [6, sceneFrames * 0.7], [0, totalChars], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  let left = typed;
  const cursorOn = Math.floor(frame / 15) % 2 === 0;
  return (
    <Stage>
      <div style={{ ...a, background: C.surface, borderRadius: 28, border: `2px solid #26262f`, overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 14, padding: "26px 30px", borderBottom: "2px solid #26262f" }}>
          {["#3a3a46", "#3a3a46", "#3a3a46"].map((c, i) => (
            <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
          ))}
        </div>
        <div style={{ padding: "40px 40px 50px", fontFamily: FONT_MONO, fontSize: 38, lineHeight: 1.55 }}>
          {s.lines.map((line, i) => {
            const n = Math.max(0, Math.min(line.length, left));
            left -= line.length;
            if (n === 0 && i > 0) return null;
            const isPrompt = line.startsWith(">") || line.startsWith("$");
            const done = n === line.length;
            return (
              <div key={i} style={{ color: isPrompt ? C.accent : C.text, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {line.slice(0, n)}
                {!done && cursorOn && <span style={{ background: C.accent, color: C.accent }}>_</span>}
              </div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};

const List: React.FC<{ s: Extract<TimedScene, { type: "list" }> }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const sceneFrames = (s.end - s.start) * fps;
  const step = Math.min(14, (sceneFrames * 0.6) / Math.max(1, s.items.length));
  const t = useEnter(0);
  return (
    <Stage>
      {s.title && (
        <div style={{ ...t, fontSize: 70, fontWeight: 700, letterSpacing: -2, marginBottom: 50 }}>
          <Rich text={s.title} />
        </div>
      )}
      {s.items.map((it, i) => (
        <ListItem key={i} delay={6 + i * step} text={it} />
      ))}
    </Stage>
  );
};

const ListItem: React.FC<{ delay: number; text: string }> = ({ delay, text }) => {
  const a = useEnter(delay);
  return (
    <div style={{ ...a, display: "flex", alignItems: "baseline", gap: 28, fontSize: 54, fontWeight: 500, marginBottom: 30, lineHeight: 1.2 }}>
      <span style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 44 }}>→</span>
      <span>
        <Rich text={text} />
      </span>
    </div>
  );
};

const Cta: React.FC<{ s: Extract<TimedScene, { type: "cta" }> }> = ({ s }) => {
  const a = useEnter(0);
  const b = useEnter(8);
  return (
    <Stage>
      <div style={{ ...a, fontSize: 96, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, textWrap: "balance" }}>
        <Rich text={s.headline} />
      </div>
      {s.sub && (
        <div
          style={{
            ...b,
            alignSelf: "flex-start",
            marginTop: 50,
            background: C.accent,
            color: C.accentInk,
            fontSize: 46,
            fontWeight: 700,
            padding: "22px 34px",
            borderRadius: 18,
          }}
        >
          {s.sub}
        </div>
      )}
    </Stage>
  );
};

export const SceneView: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  switch (scene.type) {
    case "hook":
      return <Hook s={scene} />;
    case "point":
      return <Point s={scene} />;
    case "stat":
      return <Stat s={scene} />;
    case "terminal":
      return <Terminal s={scene} />;
    case "list":
      return <List s={scene} />;
    case "cta":
      return <Cta s={scene} />;
  }
};
