import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND, C, DISPLAY, FONT_BODY, FONT_MONO, SAFE } from "../theme";
import type { TimedScene } from "../types";
import { Dog } from "../Dog";
import { Sfx } from "../Sfx";
import { Icon } from "./Icons";

// Gemeinsamer Ein-Effekt: von unten hereinschieben + einblenden
const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 140 } });
  return { opacity: s, transform: `translateY(${(1 - s) * 50}px)` };
};

const Stage: React.FC<{ children: React.ReactNode; center?: boolean }> = ({ children, center }) => (
  <AbsoluteFill
    style={{
      paddingTop: SAFE.top + 90,
      paddingLeft: SAFE.left,
      paddingRight: SAFE.right,
      paddingBottom: 640, // Platz für Untertitel + TikTok-UI
      justifyContent: center ? "center" : "flex-start",
      fontFamily: FONT_BODY,
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

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: FONT_MONO, fontSize: 24, letterSpacing: 4, color: C.accent, textTransform: "uppercase" }}>{children}</div>
);

// Dunkle Karte mit Titelzeile – wie ein App-Fenster
const Panel: React.FC<{ title: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ title, children, style }) => (
  <div style={{ background: C.surface, border: `2px solid ${C.line}`, borderRadius: 22, boxShadow: "0 30px 80px #00000066", ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 26px 0", fontFamily: FONT_MONO, fontSize: 20, letterSpacing: 3, color: C.muted }}>
      <span style={{ width: 12, height: 12, borderRadius: 6, background: C.alt }} />
      {title.toUpperCase()}
    </div>
    <div style={{ padding: "22px 26px 30px" }}>{children}</div>
  </div>
);

// Überschrift, die Wort für Wort erscheint; Akzent-Wörter farbig, letztes Akzent-Wort groß
const Hook: React.FC<{ s: Extract<TimedScene, { type: "hook" }> }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tokens: { w: string; accent: boolean }[] = [];
  s.headline.split(/(\*[^*]+\*)/g).forEach((part) => {
    const accent = part.startsWith("*");
    (accent ? part.slice(1, -1) : part)
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => tokens.push({ w, accent }));
  });
  const span = Math.min((s.end - s.start) * 0.55, 2.4) * fps;
  const lastAccent = tokens.map((t) => t.accent).lastIndexOf(true);
  const bigLast = lastAccent === tokens.length - 1 && tokens[lastAccent].w.length <= 10;
  return (
    <Stage>
      <div style={{ ...DISPLAY, fontSize: 104, lineHeight: 1.04, textAlign: "center", display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 22 }}>
        {tokens.map((t, i) => {
          const at = 4 + (i / tokens.length) * span;
          const p = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 180 } });
          const big = bigLast && i === lastAccent;
          return (
            <span
              key={i}
              style={{
                opacity: p,
                transform: `translateY(${(1 - p) * 30}px) scale(${0.9 + p * 0.1})`,
                color: t.accent ? C.accent : C.text,
                ...(big ? { flexBasis: "100%", fontSize: 150, marginTop: 6, textShadow: `0 0 60px ${C.accent}55` } : {}),
              }}
            >
              {t.w}
            </span>
          );
        })}
      </div>
    </Stage>
  );
};

const Chapter: React.FC<{ s: Extract<TimedScene, { type: "chapter" }> }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 20, stiffness: 160 } });
  const dur = (s.end - s.start) * fps;
  const out = interpolate(frame, [dur - 5, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: s.alt ? C.alt : C.accent, alignItems: "center", justifyContent: "center", paddingBottom: 260, opacity: out, clipPath: `inset(0 0 ${(1 - p) * 100}% 0)` }}>
      <div style={{ ...DISPLAY, fontWeight: 900, fontSize: 330, lineHeight: 0.9, color: C.accentInk, transform: `scale(${0.8 + p * 0.2})` }}>{String(s.num).padStart(2, "0")}</div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 34, letterSpacing: 12, color: C.accentInk, marginTop: 34, textTransform: "uppercase", maxWidth: 800, textAlign: "center" }}>{s.label}</div>
    </AbsoluteFill>
  );
};

const StepHead: React.FC<{ num: number; total: number; headline: string; tag?: string }> = ({ num, total, headline, tag }) => {
  const a = useEnter(0);
  return (
    <div style={{ ...a, display: "flex", gap: 26, alignItems: "flex-start" }}>
      {!tag && (
        <div style={{ ...DISPLAY, flex: "none", width: 84, height: 84, borderRadius: 18, background: C.accent, color: C.accentInk, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 8 }}>
          {num}
        </div>
      )}
      <div>
        <Label>{tag ?? `Schritt ${num} von ${total}`}</Label>
        <div style={{ ...DISPLAY, fontSize: 70, lineHeight: 1.05, marginTop: 8 }}>
          <Rich text={headline} />
        </div>
      </div>
    </div>
  );
};

const Point: React.FC<{ s: Extract<TimedScene, { type: "point" }>; total: number }> = ({ s, total }) => {
  const b = useEnter(8);
  return (
    <Stage>
      <StepHead num={s.num} total={total} headline={s.headline} tag={s.tag} />
      {s.sub && (
        <Panel title="Kurz gesagt" style={{ ...b, marginTop: 50 }}>
          <div style={{ fontSize: 44, lineHeight: 1.3, fontWeight: 500 }}>
            <Rich text={s.sub} />
          </div>
        </Panel>
      )}
    </Stage>
  );
};

const Stat: React.FC<{ s: Extract<TimedScene, { type: "stat" }> }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = useEnter(0);
  const b = useEnter(8);
  // Zahl hochzählen, falls der Wert mit einer Zahl beginnt (z. B. "20 Min", "49 €")
  const m = s.value.match(/^(\D*)(\d+)(.*)$/);
  const p = spring({ frame, fps, config: { damping: 30, stiffness: 60 } });
  const shown = m ? `${m[1]}${Math.round(Number(m[2]) * p)}${m[3]}` : s.value;
  return (
    <Stage center>
      <div style={{ ...a, ...DISPLAY, fontWeight: 900, fontSize: 230, color: C.accent, lineHeight: 0.92, textShadow: `0 0 80px ${C.accent}44` }}>{shown}</div>
      <div style={{ ...b, ...DISPLAY, fontSize: 64, marginTop: 30, lineHeight: 1.1 }}>
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
  // Tippen über 65 % der Szenendauer verteilen
  const typed = Math.floor(interpolate(frame, [6, sceneFrames * 0.65], [0, totalChars], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  let left = typed;
  const cursorOn = Math.floor(frame / 15) % 2 === 0;
  return (
    <Stage>
      <Panel title={s.title ?? "Claude Code"} style={a}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 36, lineHeight: 1.55, minHeight: 300 }}>
          {s.lines.map((line, i) => {
            const n = Math.max(0, Math.min(line.length, left));
            left -= line.length;
            if (n === 0 && i > 0) return null;
            const isPrompt = line.startsWith(">") || line.startsWith("$");
            const isOk = line.startsWith("✓");
            const done = n === line.length;
            return (
              <div key={i} style={{ color: isPrompt ? C.accent : isOk ? C.text : C.muted, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {line.slice(0, n)}
                {!done && cursorOn && <span style={{ background: C.accent, color: C.accent }}>_</span>}
              </div>
            );
          })}
        </div>
      </Panel>
    </Stage>
  );
};

const List: React.FC<{ s: Extract<TimedScene, { type: "list" }> }> = ({ s }) => {
  const { fps } = useVideoConfig();
  const sceneFrames = (s.end - s.start) * fps;
  const step = Math.min(22, (sceneFrames * 0.6) / Math.max(1, s.items.length));
  const t = useEnter(0);
  const p = useEnter(4);
  return (
    <Stage>
      {s.title && (
        <div style={{ ...t, ...DISPLAY, fontSize: 70, lineHeight: 1.05, marginBottom: 40 }}>
          <Rich text={s.title} />
        </div>
      )}
      <Panel title="Checkliste" style={p}>
        {s.items.map((it, i) => (
          <React.Fragment key={i}>
            <Sfx name="pop" at={10 + i * step} />
            <ListItem delay={10 + i * step} text={it} />
          </React.Fragment>
        ))}
      </Panel>
    </Stage>
  );
};

const ListItem: React.FC<{ delay: number; text: string }> = ({ delay, text }) => {
  const a = useEnter(delay);
  return (
    <div style={{ ...a, display: "flex", alignItems: "center", gap: 22, fontSize: 42, fontWeight: 500, lineHeight: 1.2, border: `2px solid ${C.line}`, borderRadius: 14, padding: "18px 22px", marginTop: 14 }}>
      <svg width={36} height={36} viewBox="0 0 36 36" style={{ flex: "none" }}>
        <circle cx={18} cy={18} r={18} fill={C.accent} />
        <path d="M10 18.5l5.5 5.5L26 13" fill="none" stroke={C.accentInk} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>
        <Rich text={text} />
      </span>
    </div>
  );
};

// Ablauf in Bildern: Kacheln mit Symbol, die nacheinander aufleuchten
const Flow: React.FC<{ s: Extract<TimedScene, { type: "flow" }> }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = (s.end - s.start) * fps;
  const t = useEnter(0);
  const per = (dur * 0.8) / s.steps.length;
  return (
    <Stage>
      {s.title && (
        <div style={{ ...t, ...DISPLAY, fontSize: 70, lineHeight: 1.05, marginBottom: 44 }}>
          <Rich text={s.title} />
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {s.steps.map((st, i) => {
          const p = spring({ frame: frame - (6 + i * per), fps, config: { damping: 16, stiffness: 150 } });
          const active = frame >= 6 + i * per && (i === s.steps.length - 1 || frame < 6 + (i + 1) * per);
          return (
            <React.Fragment key={i}>
              <Sfx name="pop" at={6 + i * per} />
              {i > 0 && <div style={{ width: 4, height: 34, marginLeft: 78, background: p > 0.5 ? C.accent : C.line }} />}
              <div style={{ opacity: p, transform: `translateX(${(1 - p) * -60}px)`, display: "flex", alignItems: "center", gap: 30, background: C.surface, border: `3px solid ${active ? C.accent : C.line}`, borderRadius: 24, padding: "22px 28px", boxShadow: active ? `0 0 50px ${C.accent}33` : "none" }}>
                <div style={{ flex: "none", width: 104, height: 104, borderRadius: 22, background: active ? C.accent : "#ffffff0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={st.icon} size={70} color={active ? C.accentInk : C.text} />
                </div>
                <div style={{ ...DISPLAY, fontSize: 54, lineHeight: 1.1 }}>
                  <Rich text={st.label} />
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </Stage>
  );
};

// „Das brauchst du“: Kacheln im Raster
const Brauchst: React.FC<{ s: Extract<TimedScene, { type: "brauchst" }> }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = (s.end - s.start) * fps;
  const t = useEnter(0);
  const per = Math.min(20, (dur * 0.6) / s.items.length);
  return (
    <Stage>
      <div style={{ ...t, ...DISPLAY, fontSize: 70, lineHeight: 1.05, marginBottom: 40 }}>
        <Rich text={s.title ?? "Das brauchst du:"} />
      </div>
      {s.items.map((_, i) => (
        <Sfx key={i} name="pop" at={8 + i * per} />
      ))}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {s.items.map((it, i) => {
          const p = spring({ frame: frame - (8 + i * per), fps, config: { damping: 14, stiffness: 160 } });
          return (
            <div key={i} style={{ opacity: p, transform: `scale(${0.8 + p * 0.2})`, background: C.surface, border: `2px solid ${C.line}`, borderRadius: 24, padding: "30px 26px", minHeight: 250 }}>
              <Icon name={it.icon} size={84} color={C.accent} />
              <div style={{ ...DISPLAY, fontSize: 46, lineHeight: 1.1, marginTop: 18 }}>
                <Rich text={it.label} />
              </div>
              {it.note && <div style={{ fontSize: 30, color: C.muted, marginTop: 8, lineHeight: 1.25 }}>{it.note}</div>}
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// Zwei Spalten gegeneinander, die rechte hervorgehoben
const Vergleich: React.FC<{ s: Extract<TimedScene, { type: "vergleich" }> }> = ({ s }) => {
  const a = useEnter(0);
  const b = useEnter(Math.round(((s.end - s.start) * 30) / 2.4));
  const col = (side: typeof s.left, good: boolean, st: React.CSSProperties) => (
    <div style={{ ...st, flex: 1, background: C.surface, border: `3px solid ${good ? C.accent : C.line}`, borderRadius: 24, padding: "28px 24px", boxShadow: good ? `0 0 60px ${C.accent}33` : "none" }}>
      <Icon name={side.icon ?? (good ? "haken" : "kreuz")} size={76} color={good ? C.accent : C.muted} />
      <div style={{ ...DISPLAY, fontSize: 50, lineHeight: 1.05, margin: "14px 0 18px", color: good ? C.accent : C.text }}>{side.title}</div>
      {side.items.map((it, i) => (
        <div key={i} style={{ fontSize: 34, lineHeight: 1.25, color: good ? C.text : C.muted, padding: "12px 0", borderTop: `2px solid ${C.line}` }}>
          <Rich text={it} />
        </div>
      ))}
    </div>
  );
  return (
    <Stage>
      <div style={{ display: "flex", gap: 22, alignItems: "stretch" }}>
        {col(s.left, false, a)}
        {col(s.right, true, b)}
      </div>
    </Stage>
  );
};

const Cta: React.FC<{ s: Extract<TimedScene, { type: "cta" }> }> = ({ s }) => {
  const frame = useCurrentFrame();
  const a = useEnter(0);
  const b = useEnter(10);
  const dog = useEnter(14);
  const pulse = 1 + Math.sin(frame / 7) * 0.02;
  return (
    <Stage>
      <div style={{ ...a, ...DISPLAY, fontSize: 92, lineHeight: 1.05, textAlign: "center" }}>
        <Rich text={s.headline} />
      </div>
      {s.sub && (
        <div style={{ ...b, alignSelf: "center", marginTop: 60 }}>
          <div style={{ ...DISPLAY, transform: `scale(${pulse})`, background: C.accent, color: C.accentInk, fontSize: 46, padding: "22px 56px", borderRadius: 60, boxShadow: `0 0 70px ${C.accent}55` }}>{s.sub}</div>
        </div>
      )}
      {BRAND.mascot && (
        <div style={{ ...dog, alignSelf: "center", marginTop: 30 }}>
          <Dog size={300} mood="happy" />
        </div>
      )}
    </Stage>
  );
};

export const SceneView: React.FC<{ scene: TimedScene; stepTotal: number }> = ({ scene, stepTotal }) => {
  switch (scene.type) {
    case "hook":
      return <Hook s={scene} />;
    case "chapter":
      return <Chapter s={scene} />;
    case "point":
      return <Point s={scene} total={stepTotal} />;
    case "stat":
      return <Stat s={scene} />;
    case "terminal":
      return <Terminal s={scene} />;
    case "list":
      return <List s={scene} />;
    case "flow":
      return <Flow s={scene} />;
    case "brauchst":
      return <Brauchst s={scene} />;
    case "vergleich":
      return <Vergleich s={scene} />;
    case "cta":
      return <Cta s={scene} />;
  }
};
