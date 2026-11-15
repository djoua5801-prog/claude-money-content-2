import React from "react";

// Einfache Linien-Symbole für Bild-Szenen. Name im Skript: "icon": "mikro" usw.
const P: Record<string, React.ReactNode> = {
  text: <path d="M14 10h20l6 6v22H14zM34 10v6h6M19 22h16M19 28h16M19 34h10" />,
  mikro: <path d="M24 8a5 5 0 0 1 5 5v9a5 5 0 0 1-10 0v-9a5 5 0 0 1 5-5zM14 22a10 10 0 0 0 20 0M24 32v8M18 40h12" />,
  video: <path d="M8 12h24v24H8zM32 20l9-5v18l-9-5M17 19l8 5-8 5z" />,
  bild: <path d="M8 10h32v28H8zM8 31l9-9 8 8 5-5 10 10M31 18a2.5 2.5 0 1 0 .1 0" />,
  web: <path d="M24 6a18 18 0 1 0 .1 0M6 24h36M24 6c-7 5-7 31 0 36M24 6c7 5 7 31 0 36" />,
  euro: <path d="M33 14a12 12 0 1 0 0 20M11 21h16M11 27h14" />,
  uhr: <path d="M24 6a18 18 0 1 0 .1 0M24 14v11l7 5" />,
  ordner: <path d="M6 12h13l4 5h19v21H6z" />,
  terminal: <path d="M6 9h36v30H6zM13 18l7 6-7 6M24 31h10" />,
  handy: <path d="M15 5h18v38H15zM22 37h4" />,
  kunde: <path d="M24 8a7 7 0 1 0 .1 0M9 41c1-10 7-14 15-14s14 4 15 14" />,
  rakete: <path d="M24 5c8 6 10 17 6 27H18c-4-10-2-21 6-27zM24 15a3 3 0 1 0 .1 0M18 28l-7 6 6 2M30 28l7 6-6 2M21 36v6M27 36v6" />,
  haken: <path d="M24 6a18 18 0 1 0 .1 0M15 24l7 7 12-13" />,
  kreuz: <path d="M24 6a18 18 0 1 0 .1 0M17 17l14 14M31 17L17 31" />,
  zahnrad: <path d="M24 16a8 8 0 1 0 .1 0M24 5v6M24 37v6M5 24h6M37 24h6M10.5 10.5l4.5 4.5M33 33l4.5 4.5M37.5 10.5L33 15M15 33l-4.5 4.5" />,
  stift: <path d="M9 39l3-11L32 8l8 8-20 20zM28 12l8 8" />,
  kalender: <path d="M8 11h32v28H8zM8 19h32M16 6v9M32 6v9M15 26h5M24 26h5M15 32h5" />,
  mail: <path d="M6 11h36v26H6zM6 13l18 14 18-14" />,
  buch: <path d="M24 12c-5-4-12-4-17-2v27c5-2 12-2 17 2 5-4 12-4 17-2V10c-5-2-12-2-17 2zM24 12v27" />,
  lupe: <path d="M21 7a14 14 0 1 0 .1 0M31 31l11 11" />,
};
export const ICONS = Object.keys(P);

export const Icon: React.FC<{ name: string; size?: number; color: string }> = ({ name, size = 96, color }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
    {P[name] ?? P.haken}
  </svg>
);
