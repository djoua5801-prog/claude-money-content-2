// Datenmodell: ein Video = mehrere Szenen. Jede Szene hat einen gesprochenen Text (voice)
// und eine visuelle Darstellung (type + Felder).

export type SceneVisual =
  | { type: "hook"; headline: string; kicker?: string }
  | { type: "chapter"; num: number; label: string; alt?: boolean } // vollflächige Kapitelkarte
  | { type: "point"; num: number; headline: string; sub?: string; tag?: string } // tag ersetzt „Schritt n von N“ (z. B. „Das Problem“)
  | { type: "stat"; value: string; label: string }
  | { type: "terminal"; lines: string[]; title?: string }
  | { type: "list"; title?: string; items: string[] }
  | { type: "flow"; title?: string; steps: { icon: string; label: string }[] } // Ablauf in Bildern: Symbol → Symbol → Symbol
  | { type: "brauchst"; title?: string; items: { icon: string; label: string; note?: string }[] } // „Das brauchst du“ als Kacheln
  | { type: "vergleich"; left: { title: string; icon?: string; items: string[] }; right: { title: string; icon?: string; items: string[] } } // z. B. Vorher / Nachher
  | { type: "cta"; headline: string; sub?: string };

export type SceneSpec = SceneVisual & { voice: string };

export type VideoSpec = {
  id: string;
  title: string;
  pillar: string;
  series?: string; // z. B. "CLAUDE-CODE · 01" – steht klein über dem Video
  approved?: boolean; // erst wenn true, wird die Stimme erzeugt (Skript zuerst, dann Voice)
  post: {
    caption: string; // Text unter dem Video (ohne Hashtags)
    ziel: "Folgen" | "Kommentar" | "Gratis-PDF" | "E-Book"; // wohin das Video den Zuschauer führt
    verweis: string; // letzter Satz der Unterschrift: der konkrete Verweis
    pinnedComment: string; // erster, angepinnter Kommentar
  };
  hashtags: string[];
  problem?: string; // konkretes Problem der Zielgruppe
  infowert?: string; // was der Zuschauer danach kann
  tools?: string[]; // benötigte KI-Tools
  demo?: string; // praktische Demonstration oder "keine" mit Grund
  wirkung?: "Reichweite" | "Vertrauen" | "Monetarisierung";
  belege?: string; // eigener Test · belegte Tatsache · Vermutung
  zielSekunden?: number;
  ebookBezug?: string; // zu welchem E-Book / Angebot dieses Video hinführt
  hooks?: { text: string; bewertung: number; grund: string }[];
  kineticHook?: boolean; // true = Hook als Kinetic-Typografie; Standard: Wort-für-Wort-Überschrift
  scenes: SceneSpec[];
};

export type Word = { text: string; start: number; end: number }; // Sekunden

export type TimedScene = SceneSpec & { start: number; end: number; cues?: number[] }; // cues: Einblend-Zeitpunkte der Elemente in Sekunden ab Szenenbeginn

export type TimedVideo = Omit<VideoSpec, "scenes"> & {
  scenes: TimedScene[];
  words: Word[];
  duration: number; // Sekunden
  audio: string | null; // Pfad relativ zu public/
};
