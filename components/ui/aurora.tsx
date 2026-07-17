/* ══════════════════════════════════════════════════════
   Ambient backdrop: drifting colour fields, a hairline grid, floating craft
   icons, twinkling motes and slow light beams.

   Everything here is decorative — fixed, behind all content, inert to the
   pointer and hidden from assistive tech. All motion is CSS transform/opacity
   so it stays on the compositor, and every position is a hard-coded constant
   rather than Math.random(), so server and client render identical markup.
   ══════════════════════════════════════════════════════ */

/** 24×24 stroke glyphs — the tools of the trade, scattered like debris. */
const GLYPHS = {
  code: "m8.5 8.5-3.5 3.5 3.5 3.5M15.5 8.5l3.5 3.5-3.5 3.5M13.5 5.5l-3 13",
  pen: "M4 16.5V19a1 1 0 0 0 1 1h2.5L18 9.5a2.5 2.5 0 0 0-3.5-3.5L4 16.5ZM13 7l4 4",
  cursor: "m5 3 14 8-6 1.5L10 19 5 3Z",
  sparkle:
    "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18",
  browser: "M3 6h18v12H3zM3 10h18M6 8h.01M8.5 8h.01",
  layers: "m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5",
  droplet: "M12 3s6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 6-10 6-10Z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  bolt: "M13 3 5 13h6l-1 8 8-10h-6l1-8Z",
  type: "M5 6h14M12 6v13M9 19h6",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  link: "M10 14a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1",
} as const;

type Floater = {
  glyph: keyof typeof GLYPHS;
  /** viewport percentages */
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  /** negative, so each starts mid-cycle instead of all together */
  delay: number;
  tilt: number;
  /** dropped below `sm` to keep small screens calm and cheap */
  desktopOnly?: boolean;
};

const FLOATERS: Floater[] = [
  { glyph: "code", x: 8, y: 18, size: 34, opacity: 0.24, duration: 24, delay: 0, tilt: -12 },
  { glyph: "sparkle", x: 22, y: 62, size: 22, opacity: 0.195, duration: 30, delay: -6, tilt: 8 },
  { glyph: "bolt", x: 78, y: 20, size: 26, opacity: 0.21, duration: 28, delay: -21, tilt: -14 },
  { glyph: "cursor", x: 88, y: 56, size: 24, opacity: 0.225, duration: 25, delay: -4, tilt: 12 },
  { glyph: "pen", x: 15, y: 84, size: 28, opacity: 0.15, duration: 27, delay: -12, tilt: 14, desktopOnly: true },
  { glyph: "browser", x: 34, y: 12, size: 30, opacity: 0.135, duration: 32, delay: -18, tilt: -6, desktopOnly: true },
  { glyph: "grid", x: 46, y: 74, size: 26, opacity: 0.12, duration: 26, delay: -3, tilt: 10, desktopOnly: true },
  { glyph: "droplet", x: 58, y: 30, size: 24, opacity: 0.18, duration: 29, delay: -15, tilt: -9, desktopOnly: true },
  { glyph: "layers", x: 68, y: 88, size: 32, opacity: 0.15, duration: 23, delay: -8, tilt: 6, desktopOnly: true },
  { glyph: "type", x: 92, y: 86, size: 28, opacity: 0.135, duration: 31, delay: -17, tilt: -7, desktopOnly: true },
  { glyph: "target", x: 5, y: 46, size: 30, opacity: 0.12, duration: 33, delay: -10, tilt: 4, desktopOnly: true },
  { glyph: "link", x: 72, y: 46, size: 22, opacity: 0.15, duration: 22, delay: -13, tilt: -11, desktopOnly: true },
];

/** [x%, y%, size px, delay s, duration s] — hand-picked to look scattered. */
const MOTES: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [4, 9, 2, 0, 5], [12, 27, 3, -2, 6], [19, 8, 2, -4, 5.5], [27, 44, 2, -1, 7],
  [31, 15, 3, -3, 5], [38, 68, 2, -5, 6.5], [44, 25, 2, -2.5, 5], [49, 90, 3, -6, 7],
  [54, 11, 2, -1.5, 6], [61, 55, 2, -4.5, 5], [66, 33, 3, -3.5, 6.5], [71, 77, 2, -0.5, 5.5],
  [76, 14, 2, -5.5, 6], [82, 41, 3, -2, 7], [86, 70, 2, -4, 5], [91, 22, 2, -6.5, 6],
  [95, 52, 3, -1, 5.5], [9, 66, 2, -3, 6], [24, 92, 2, -5, 5], [41, 5, 3, -2, 6.5],
  [57, 79, 2, -6, 5], [64, 18, 2, -0.5, 7], [80, 95, 3, -4.5, 6], [97, 8, 2, -3.5, 5.5],
];

/** Vertical light streaks that sweep down every few seconds. */
const BEAMS = [
  { x: 18, delay: 0, duration: 11 },
  { x: 52, delay: -4, duration: 14 },
  { x: 84, delay: -8, duration: 12 },
];

export function Aurora() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Colour fields */}
      <div className="bg-neon-pink/20 animate-aurora absolute -top-52 right-[-12%] h-[38rem] w-[38rem] rounded-full blur-[140px]" />
      <div className="bg-neon-violet/20 animate-aurora absolute top-[18%] left-[-18%] h-[34rem] w-[34rem] rounded-full blur-[140px] [animation-delay:-6s]" />
      <div className="bg-neon-indigo/15 animate-aurora absolute right-[15%] bottom-[-25%] h-[32rem] w-[32rem] rounded-full blur-[140px] [animation-delay:-12s]" />

      {/* Hairline grid, faded out toward the edges */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
        }}
      />

      {/* Motes */}
      {MOTES.map(([x, y, size, delay, duration], i) => (
        <span
          key={`mote-${i}`}
          className="animate-twinkle absolute rounded-full bg-white"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      ))}

      {/* Beams */}
      {BEAMS.map((beam, i) => (
        <span
          key={`beam-${i}`}
          className="animate-beam via-neon-pink/25 absolute top-0 hidden h-[45vh] w-px bg-gradient-to-b from-transparent to-transparent sm:block"
          style={{
            left: `${beam.x}%`,
            animationDelay: `${beam.delay}s`,
            animationDuration: `${beam.duration}s`,
          }}
        />
      ))}

      {/* Craft icons */}
      {FLOATERS.map((f, i) => (
        <span
          key={`floater-${i}`}
          className={`animate-drift text-neon-rose absolute ${f.desktopOnly ? "hidden sm:block" : ""}`}
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            opacity: f.opacity,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
          }}
        >
          <svg
            width={f.size}
            height={f.size}
            viewBox="0 0 24 24"
            fill="none"
            style={{ transform: `rotate(${f.tilt}deg)` }}
          >
            <path
              d={GLYPHS[f.glyph]}
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ))}

      {/* Vignette — sits last so it tones everything above it down */}
      <div className="from-void via-void/20 to-void absolute inset-0 bg-gradient-to-b" />
    </div>
  );
}
