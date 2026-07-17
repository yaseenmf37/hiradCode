import { TECH_STACK } from "@/lib/site-config";

/**
 * Seamless infinite ticker.
 *
 * Three things have to hold at once, and breaking any one of them shows up as
 * the strip "running out" mid-loop:
 *
 * 1. The fade mask lives on the viewport-width container, NOT on the w-max
 *    track wrapper. Percentage mask stops resolve against the element's own
 *    width, so putting it on the ~6000px track would place the fades thousands
 *    of pixels off-screen and dissolve content as it travelled left.
 * 2. dir="ltr" sits on the CONTAINER, not on the w-max child. A block wider
 *    than its parent is placed by the *parent's* direction: under RTL its right
 *    edge pins to the right and it overflows leftwards, starting around
 *    x = -4500. translateX then drags it further left, off the end of its own
 *    content, and the strip empties out. Making the container LTR pins the
 *    track's left edge at x = 0 where the animation expects it.
 * 3. REPEATS is even, and half the copies must be at least as wide as the
 *    widest viewport. The animation shifts by exactly -50%; if that half is
 *    narrower than the screen, the tail runs out and a gap opens before the
 *    reset. Two copies measure ~1400px — already short of a 1440px laptop —
 *    so four are used, giving ~2800px of runway.
 *
 * The -50% shift lands on a whole number of copies only because the trailing
 * `pe-12` matches `gap-12`. Keep them in sync or a seam appears.
 */
const REPEATS = 4;

const FADE =
  "linear-gradient(to right, transparent, black 12%, black 88%, transparent)";

export function Marquee() {
  const items = Array.from({ length: REPEATS }, () => TECH_STACK).flat();

  return (
    <div
      dir="ltr"
      className="relative overflow-hidden py-10"
      style={{ maskImage: FADE, WebkitMaskImage: FADE }}
    >
      <div className="flex w-max">
        <div className="animate-marquee-track flex shrink-0 items-center gap-12 pe-12">
          {items.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              // Only the first copy is real content; the rest are visual filler.
              aria-hidden={i >= TECH_STACK.length}
              className="text-fog-600 hover:text-neon-rose text-xl font-bold tracking-tight whitespace-nowrap transition-colors sm:text-2xl"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
