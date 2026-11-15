import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions } from "./Captions";
import { KineticHook } from "./KineticHook";
import { SceneView } from "./scenes/Scenes";
import { C, FONT_MONO, SAFE } from "./theme";
import type { TimedVideo } from "./types";

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = (frame * 0.4) % 80;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(#ffffff08 2px, transparent 2px), linear-gradient(90deg, #ffffff08 2px, transparent 2px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `0 ${shift}px`,
        }}
      />
    </AbsoluteFill>
  );
};

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames - 1], [0, 1]);
  return (
    <AbsoluteFill style={{ top: SAFE.top - 60, left: SAFE.left, right: SAFE.right, height: 6, width: "auto" }}>
      <div style={{ height: 6, background: "#ffffff14", borderRadius: 3 }}>
        <div style={{ height: 6, width: `${p * 100}%`, background: C.accent, borderRadius: 3 }} />
      </div>
    </AbsoluteFill>
  );
};

export const Explainer: React.FC<{ video: TimedVideo }> = ({ video }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background />

      {video.scenes.map((s, i) => {
        const from = Math.round(s.start * fps);
        const to = Math.round(s.end * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)}>
            {i === 0 && s.type === "hook" && video.kineticHook !== false ? (
              <KineticHook scene={s} words={video.words} />
            ) : (
              <SceneView scene={s} />
            )}
          </Sequence>
        );
      })}
      {/* Während des Kinetic-Hooks ist der Text selbst die Untertitelung */}
      <Captions
        words={
          video.kineticHook !== false && video.scenes[0]?.type === "hook"
            ? video.words.filter((w) => w.start >= video.scenes[0].end)
            : video.words
        }
      />
      <Progress />
      <AbsoluteFill style={{ top: SAFE.top - 30, left: SAFE.left, height: 40, fontFamily: FONT_MONO, fontSize: 26, color: C.muted, letterSpacing: 2 }}>
        {video.pillar.toUpperCase()}
      </AbsoluteFill>
      {video.audio && <Audio src={staticFile(video.audio)} />}
    </AbsoluteFill>
  );
};
