// Datenmodell: ein Video = mehrere Szenen. Jede Szene hat einen gesprochenen Text (voice)
// und eine visuelle Darstellung (type + Felder).

export type SceneVisual =
  | { type: "hook"; headline: string; kicker?: string }
  | { type: "point"; num: number; headline: string; sub?: string }
  | { type: "stat"; value: string; label: string }
  | { type: "terminal"; lines: string[] }
  | { type: "list"; title?: string; items: string[] }
  | { type: "cta"; headline: string; sub?: string };

export type SceneSpec = SceneVisual & { voice: string };

export type VideoSpec = {
  id: string;
  title: string;
  pillar: string;
  caption: string; // Posting-Text für TikTok
  hashtags: string[];
  kineticHook?: boolean; // Standard: an. false = klassische Hook-Szene
  scenes: SceneSpec[];
};

export type Word = { text: string; start: number; end: number }; // Sekunden

export type TimedScene = SceneSpec & { start: number; end: number };

export type TimedVideo = Omit<VideoSpec, "scenes"> & {
  scenes: TimedScene[];
  words: Word[];
  duration: number; // Sekunden
  audio: string | null; // Pfad relativ zu public/
};
