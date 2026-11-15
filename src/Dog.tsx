import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./theme";

// Eigene Figur: Roboterhund in Weiß-Blau. Animiert: wippt, blinzelt, wedelt, Ohren federn.
// mood: "neutral" | "happy". size = Breite in px (Höhe = size * 7/6).
const W = "#FFFFFF";
const SH = "#DCE7FF";

export const Dog: React.FC<{ size?: number; mood?: "neutral" | "happy"; talking?: boolean }> = ({ size = 360, mood = "neutral", talking = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const AC = C.accent;
  const NV = C.bg;
  const bob = Math.sin(t * 2.6) * 6;
  const wag = Math.sin(t * (mood === "happy" ? 14 : 7)) * (mood === "happy" ? 16 : 8);
  const ear = Math.sin(t * 2.6 + 0.6) * 4;
  const blink = frame % 96 < 5; // alle ~3 s kurz blinzeln
  const mouthOpen = talking ? Math.abs(Math.sin(t * 11)) * 16 : 0;

  const eye = (x: number, y: number) =>
    blink ? (
      <rect x={x - 22} y={y - 5} width={44} height={10} rx={5} fill={NV} />
    ) : mood === "happy" ? (
      <path d={`M${x - 22},${y + 10} Q${x},${y - 26} ${x + 22},${y + 10}`} fill="none" stroke={NV} strokeWidth={12} strokeLinecap="round" />
    ) : (
      <>
        <circle cx={x} cy={y} r={21} fill={NV} />
        <circle cx={x + 7} cy={y - 7} r={6} fill={W} />
      </>
    );

  return (
    <svg viewBox="0 0 600 700" width={size} height={(size * 7) / 6} style={{ overflow: "visible" }}>
      <g transform={`rotate(${wag} 408 540)`}>
        <path d="M408,540 Q500,520 478,430" fill="none" stroke={AC} strokeWidth={24} strokeLinecap="round" />
        <circle cx={478} cy={424} r={20} fill={W} />
      </g>
      <rect x={205} y={520} width={64} height={110} rx={28} fill={SH} />
      <rect x={331} y={520} width={64} height={110} rx={28} fill={SH} />
      <rect x={205} y={596} width={64} height={34} rx={17} fill={AC} />
      <rect x={331} y={596} width={64} height={34} rx={17} fill={AC} />
      <g transform={`translate(0 ${bob * 0.5})`}>
        <rect x={188} y={380} width={224} height={210} rx={76} fill={W} />
        <rect x={248} y={452} width={104} height={66} rx={16} fill={NV} />
        <path d="M268,470 L286,485 L268,500" fill="none" stroke={AC} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        {Math.floor(frame / 15) % 2 === 0 && <rect x={298} y={494} width={34} height={9} rx={4.5} fill={AC} />}
      </g>
      <g transform={`translate(0 ${bob})`}>
        <rect x={118} y={130} width={78} height={170} rx={39} fill={AC} transform={`rotate(${14 + ear} 157 150)`} />
        <rect x={404} y={130} width={78} height={170} rx={39} fill={AC} transform={`rotate(${-14 - ear} 443 150)`} />
        <rect x={150} y={110} width={300} height={262} rx={100} fill={W} />
        <ellipse cx={300} cy={306} rx={78} ry={52} fill={SH} />
        <rect x={278} y={268} width={44} height={30} rx={15} fill={NV} />
        {mouthOpen > 3 ? (
          <ellipse cx={300} cy={326} rx={16} ry={mouthOpen / 2 + 3} fill={NV} />
        ) : mood === "happy" ? (
          <path d="M272,318 Q300,348 328,318" fill="none" stroke={NV} strokeWidth={9} strokeLinecap="round" />
        ) : (
          <path d="M282,322 Q300,334 318,322" fill="none" stroke={NV} strokeWidth={9} strokeLinecap="round" />
        )}
        {eye(238, 222)}
        {eye(362, 222)}
        <rect x={226} y={366} width={148} height={30} rx={15} fill={AC} />
        <circle cx={300} cy={402} r={15} fill={NV} stroke={AC} strokeWidth={6} />
      </g>
    </svg>
  );
};
