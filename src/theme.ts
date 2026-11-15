import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/500.css";
import brand from "../brand/brand.json";

export const C = brand.colors;
export const FONT_DISPLAY = `"Space Grotesk", sans-serif`;
export const FONT_MONO = `"JetBrains Mono", monospace`;

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// TikTok-Safe-Zone: oben ~ 220px (Suche/Tabs), unten ~ 420px (Caption/Buttons), rechts ~ 140px (Like-Leiste)
export const SAFE = { top: 240, bottom: 440, left: 80, right: 160 };
