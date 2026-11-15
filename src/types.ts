// Datenmodell: ein Video = mehrere Szenen. Jede Szene hat einen gesprochenen Text (voice)
// und eine visuelle Darstellung (type + Felder).

export type SceneVisual =
  | { type: "hook"; headline: string; kicker?: string }
  | { type: "chapter"; num: number; label: string; alt?: boolean } // vollflächige Kapitelkarte
  | { type: "point"; num: number; headline: string; sub?: string }
  | { type: "stat"; value: string; label: string }
  | { type: "terminal"; lines: string[]; title?: string }
  | { type: "list"; title?: string; items: string[] }
  | { type: "cta"; headline: string; sub?: string };

export type SceneSpec = SceneVisual & { voice: string };

export type VideoSpec = {
  id: string;
  title: string;
  pillar: string;
  series?: string; // z. B. "CLAUDE-CODE · 01" – steht klein über dem Video
  approved?: boolean; // erst wenn true, wird die Stimme erzeugt (Skript zuerst, dann Voice)
  caption: string; // Posting-Text für TikTok
  hashtags: string[];
  kineticHook?: boolean; // true = Hook als Kinetic-Typografie; Standard: Wort-für-Wort-Überschrift
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
