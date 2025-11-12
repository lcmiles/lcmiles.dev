'use client';

import { useEffect, useRef } from 'react';

type StarfieldProps = {
  className?: string;
  /** Approximate number of stars per 10,000 pixels of area */
  density?: number;
  /** Base horizontal drift speed in pixels per second */
  driftSpeed?: number;
  /** Twinkle speed multiplier (higher = faster) */
  twinkleSpeed?: number;
  /** Possible star colors (rgba or css color). Will be randomly picked per star. */
  colors?: string[];
  /** Maximum radius in pixels */
  maxRadius?: number;
  /** Minimum radius in pixels */
  minRadius?: number;
  /** Average number of shooting stars per minute */
  shootingRatePerMin?: number;
  /** Shooting star speed in px/sec */
  shootingSpeed?: number;
  /** Shooting star tail length in px */
  tailLength?: number;
};

/**
 * Starfield canvas background with lightweight twinkle and subtle drift.
 * Uses refs and requestAnimationFrame for high performance and avoids re-renders.
 */
export default function Starfield({
  className,
  density = 0.12, // stars per 10k px^2 -> ~250 stars at 1920x1080
  driftSpeed = 0, // drift disabled; kept for backward compatibility
  twinkleSpeed = 1,
  colors = [
    'rgba(163, 230, 255, 1)', // cyan-200
    'rgba(96, 165, 250, 1)',  // blue-400
    'rgba(192, 132, 252, 1)', // purple-400
    'rgba(226, 232, 240, 1)', // slate-200 (neutral)
  ],
  minRadius = 0.6,
  maxRadius = 1.8,
  shootingRatePerMin = 8,
  shootingSpeed = 900,
  tailLength = 160,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Keep star data and canvas sizing in refs so we never re-render
  const starsRef = useRef<
    Array<{
      x: number;
      y: number;
      r: number;
      baseAlpha: number;
      twinkleOffset: number;
      color: string;
      vx: number; // kept for compatibility; zeroed to disable drift
    }>
  >([]);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const shootersRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number; // px/sec
      vy: number; // px/sec
      life: number; // seconds
      maxLife: number; // seconds
      color: string;
      width: number;
    }>
  >([]);
  // Removed sparks for a more realistic, non-explosive meteor look

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const { innerWidth: w, innerHeight: h } = window;
      sizeRef.current = { width: w, height: h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Recompute stars only on resize
      const area = w * h;
      const count = Math.max(80, Math.floor((area / 10000) * density));
      const stars = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (minRadius + Math.random() * (maxRadius - minRadius)) * 1.2, // slightly larger
        baseAlpha: 0.55 + Math.random() * 0.4, // brighter baseline
        twinkleOffset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: 0, // drift disabled
      }));
      starsRef.current = stars;
    };

    resize();
    window.addEventListener('resize', resize);

    let last = performance.now();
    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); // clamp delta
      last = now;

      const { width: w, height: h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);
      // Use additive blending for a soft glow accumulation
      ctx.globalCompositeOperation = 'lighter';

      for (const s of starsRef.current) {
        // drift disabled

        // twinkle
  const alpha = s.baseAlpha * (0.7 + 0.3 * Math.sin(s.twinkleOffset + now * 0.0018 * twinkleSpeed));

        ctx.globalAlpha = Math.max(0.05, Math.min(1, alpha));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        // slightly soft circle
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // subtle glow
  ctx.globalAlpha = Math.max(0.04, alpha * 0.35);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Occasionally spawn shooting stars
      const ratePerSec = shootingRatePerMin / 60;
      if (Math.random() < ratePerSec * dt && shootersRef.current.length < 3) {
        // Spawn near top-left quadrant heading down-right
        const startX = Math.random() * (w * 0.4) - w * 0.1; // a little off-screen sometimes
        const startY = Math.random() * (h * 0.35) - h * 0.15;
        const angle = (20 + Math.random() * 25) * (Math.PI / 180);
        const speed = shootingSpeed * (0.8 + Math.random() * 0.4); // px/sec
        const color = 'rgba(255, 255, 255, 0.95)';
        shootersRef.current.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 0.9 + Math.random() * 0.6,
          color,
          width: 1.2 + Math.random() * 0.8,
        });
      }

      // Update and draw shooting stars
      for (let i = shootersRef.current.length - 1; i >= 0; i--) {
        const sh = shootersRef.current[i];
        sh.life += dt;
        sh.x += sh.vx * dt;
        sh.y += sh.vy * dt;
        // Progress and fade window (single definition used below)
        const progress = sh.life / sh.maxLife;
        const fadeWindow = 0.4; // last 40% of lifetime fades
        const fadeScale = progress < 1 - fadeWindow ? 1 : 1 - (progress - (1 - fadeWindow)) / fadeWindow;

        // Remove cleanly when finished
        const shouldRemove = (
          sh.life > sh.maxLife ||
          sh.x < -tailLength ||
          sh.y < -tailLength ||
          sh.x > w + tailLength ||
          sh.y > h + tailLength
        );
        if (shouldRemove) { shootersRef.current.splice(i, 1); continue; }

        // Compute tail endpoint opposite motion
    const mag = Math.hypot(sh.vx, sh.vy) || 1;
    const ux = sh.vx / mag;
    const uy = sh.vy / mag;
    // Tail shortens as the meteor fades
    const tail = tailLength * (0.6 + 0.4 * fadeScale);
    const tx = sh.x - ux * tail;
    const ty = sh.y - uy * tail;

        // Gradient tail
        const grad = ctx.createLinearGradient(tx, ty, sh.x, sh.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(0.15, `rgba(180,220,255,${(0.2 * fadeScale).toFixed(3)})`);
  grad.addColorStop(0.65, `rgba(160,200,255,${(0.45 * fadeScale).toFixed(3)})`);
  grad.addColorStop(1, `rgba(255,255,255,${(0.9 * fadeScale).toFixed(3)})`);

  ctx.lineWidth = sh.width * (0.6 + 0.4 * fadeScale);
        ctx.strokeStyle = grad as unknown as string;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(sh.x, sh.y);
        ctx.stroke();

        // bright head
        ctx.fillStyle = `rgba(255,255,255,${(0.9 * fadeScale).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, 1.6 * (0.85 + 0.15 * fadeScale), 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [colors, density, driftSpeed, maxRadius, minRadius, twinkleSpeed]);

  return <canvas ref={canvasRef} className={className} />;
}
