import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

/* ── Abstract 4-quadrant curve mark ──────────────────────────────────────── */
export function LogoMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M 0 128 C 70.692 128 128 185.308 128 256 L 64 256 C 64 220.654 35.346 192 0 192 Z M 256 192 C 220.654 192 192 220.654 192 256 L 128 256 C 128 185.308 185.308 128 256 128 Z M 128 0 C 128 70.692 70.692 128 0 128 L 0 64 C 35.346 64 64 35.346 64 0 Z M 192 0 C 192 35.346 220.654 64 256 64 L 256 128 C 185.308 128 128 70.692 128 0 Z" />
    </svg>
  );
}

/* ── Small section eyebrow (editorial: line + uppercase label) ───────────── */
export function SectionEyebrow({
  label,
  tag,
  center = false,
}: {
  label: string;
  tag?: string;
  center?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${
        center ? "justify-center" : ""
      }`}
    >
      {!center && <span className="eyebrow-line shrink-0" aria-hidden="true" />}
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--aura-mist)]">
        {label}
      </span>
      {tag && (
        <span className="px-2 py-0.5 rounded-full border border-white/10 text-white/45 text-[10px] uppercase tracking-[0.18em]">
          {tag}
        </span>
      )}
    </div>
  );
}

/* ── Pure-white-to-cyan accent gradient for headline words (hero + 2027) ──── */
export const gradientStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(100deg, #ffffff 0%, #ffffff 45%, #ffffff 100%)",
  backgroundSize: "200% auto",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
  filter: "url(#c3-noise)",
};

/* ══════════════════════════════════════════════════════════════════════════
   Premium motion primitives — 3D tilt, magnetic hover, counters.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── 3D tilt card: rotates toward the cursor with a spotlight sheen ──────── */
export function TiltCard({
  children,
  className = "",
  max = 8,
  scale = 1.01,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const s = useMotionValue(1);
  const springRx = useSpring(rx, { stiffness: 160, damping: 18 });
  const springRy = useSpring(ry, { stiffness: 160, damping: 18 });
  const springS = useSpring(s, { stiffness: 200, damping: 20 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * max);
    rx.set(-py * max);
    el.style.setProperty("--spot-x", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--spot-y", `${(py + 0.5) * 100}%`);
  }
  function onMouseLeave() {
    rx.set(0);
    ry.set(0);
    s.set(1);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => s.set(scale)}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX: springRx,
        rotateY: springRy,
        scale: springS,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
      <span
        className="tilt-spotlight pointer-events-none absolute inset-0 rounded-[inherit]"
        aria-hidden="true"
      />
    </motion.div>
  );
}

/* ── Magnetic wrapper: element is gently pulled toward the cursor ────────── */
export function Magnetic({
  children,
  className = "",
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 16 });
  const springY = useSpring(y, { stiffness: 200, damping: 16 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  }
  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated counter: counts up from 0 when it scrolls into view ────────── */
export function Counter({
  value,
  duration = 1.6,
  className = "",
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, value, duration, mv]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
