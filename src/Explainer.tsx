import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions } from "./Captions";
import { KineticHook } from "./KineticHook";
import { SceneView } from "./scenes/Scenes";
import { Sfx } from "./Sfx";
import { BRAND, C, FONT_MONO, H, SAFE, W } from "./theme";
import type { TimedVideo } from "./types";

const Fonts: React.FC = () => (
  <style>{`@font-face{font-family:'ArchivoDisplay';src:url('${staticFile("fonts/Archivo.ttf")}') format('truetype');font-weight:100 900;font-stretch:62% 125%;font-display:block}`}</style>
);

// Dunkler Grund mit weichem Akzent-Schein oben links, zweitem Schein unten rechts und Punktraster
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 40;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(700px 600px at ${260 + drift}px 260px, ${C.accent}2e, transparent 70%), radial-gradient(700px 700px at ${W - 120 - drift}px ${H - 360}px, ${C.alt}26, transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(#ffffff0d 2px, transparent 2px)`, backgroundSize: "44px 44px" }} />
    </AbsoluteFill>
  );
};

// Eck-Markierungen rund um den Inhaltsbereich
const Brackets: React.FC = () => {
  const s = 34;
  const box = { left: SAFE.left - 40, right: SAFE.right - 60, top: SAFE.top - 10, bottom: SAFE.bottom - 60 };
  const base: React.CSSProperties = { position: "absolute", width: s, height: s, borderColor: "#ffffff30", borderStyle: "solid", borderWidth: 0 };
  return (
    <AbsoluteFill>
      <div style={{ ...base, left: box.left, top: box.top, borderLeftWidth: 3, borderTopWidth: 3 }} />
      <div style={{ ...base, right: box.right, top: box.top, borderRightWidth: 3, borderTopWidth: 3 }} />
      <div style={{ ...base, left: box.left, bottom: box.bottom, borderLeftWidth: 3, borderBottomWidth: 3 }} />
      <div style={{ ...base, right: box.right, bottom: box.bottom, borderRightWidth: 3, borderBottomWidth: 3 }} />
    </AbsoluteFill>
  );
};

const TopBar: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames - 1], [0, 1]);
  return (
    <>
      <div style={{ position: "absolute", top: SAFE.top + 16, left: SAFE.left, right: SAFE.right, height: 4, background: "#ffffff1a", borderRadius: 2 }}>
        <div style={{ height: 4, width: `${p * 100}%`, background: C.accent, borderRadius: 2 }} />
      </div>
      <div style={{ position: "absolute", top: SAFE.top + 36, left: SAFE.left, right: SAFE.right, textAlign: "center", fontFamily: FONT_MONO, fontSize: 22, letterSpacing: 5, color: C.accent }}>{label.toUpperCase()}</div>
    </>
  );
};

// Folien-Übergang: Szene schiebt von rechts herein und nach links hinaus
const Slide: React.FC<{ frames: number; children: React.ReactNode }> = ({ frames, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if ((BRAND as { uebergang?: string }).uebergang !== "slide") return <>{children}</>;
  const inP = spring({ frame, fps, config: { damping: 22, stiffness: 190 } });
  const outP = interpolate(frame, [frames - 6, frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = (1 - inP) * 900 - outP * 500;
  return <AbsoluteFill style={{ transform: `translateX(${x}px)`, opacity: Math.min(1, inP * 1.4) * (1 - outP) }}>{children}</AbsoluteFill>;
};

export const Explainer: React.FC<{ video: TimedVideo }> = ({ video }) => {
  const { fps } = useVideoConfig();
  const stepTotal = video.scenes.filter((s) => s.type === "point" && !s.tag).length;
  const kinetic = video.kineticHook === true && video.scenes[0]?.type === "hook";
  // Keine Untertitel während Kapitelkarten (und während eines Kinetic-Hooks)
  const hidden = video.scenes.filter((s, i) => s.type === "chapter" || (kinetic && i === 0));
  const words = video.words.filter((w) => !hidden.some((s) => w.start >= s.start - 0.01 && w.start < s.end - 0.01));
  return (
    <AbsoluteFill>
      <Fonts />
      <Background />
      <Brackets />
      <TopBar label={video.series ?? `${BRAND.kicker} · ${video.id.replace(/\D/g, "")}`} />
      {video.scenes.map((s, i) => {
        const from = Math.round(s.start * fps);
        const to = Math.round(s.end * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)}>
            {i === 0 && kinetic ? (
              <KineticHook scene={s} words={video.words} />
            ) : i === 0 || s.type === "chapter" ? (
              <SceneView scene={s} stepTotal={stepTotal} />
            ) : (
              <Slide frames={Math.max(1, to - from)}>
                <SceneView scene={s} stepTotal={stepTotal} />
              </Slide>
            )}
            {i === 0 && <Sfx name="riser" at={0} />}
            {i > 0 && <Sfx name={s.type === "chapter" ? "impact" : "whoosh"} at={0} />}
            {s.type === "cta" && <Sfx name="ding" at={12} />}
            {s.type === "stat" && <Sfx name="ding" at={18} volume={0.6} />}
          </Sequence>
        );
      })}
      <Captions words={words} />
      {video.audio && <Audio src={staticFile(video.audio)} />}
    </AbsoluteFill>
  );
};
