"use client";

import { useEffect, useRef } from "react";

/**
 * Fluted-glass hero backdrop, generated entirely in code (no video asset).
 *
 * An offscreen canvas paints a deep-blue field with slow-drifting light
 * blobs; the visible canvas re-samples it in narrow vertical columns, each
 * shifted and brightened sinusoidally — the classic refraction look of
 * ribbed glass. Light positions breathe over time so the panel feels alive.
 */
export function HeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d")!;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const RIB = 26; // rib width in CSS px

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * DPR);
      canvas.height = Math.round(h * DPR);
      // the offscreen field can be low-res: it gets stretched and blurred anyway
      off.width = Math.max(2, Math.round(w / 3));
      off.height = Math.max(2, Math.round(h / 3));
    };

    type Blob = { x: number; y: number; r: number; hue: string; dx: number; dy: number; ph: number };
    const blobs: Blob[] = [
      { x: 0.5, y: 0.3, r: 0.55, hue: "rgba(140,180,235,.85)", dx: 0.05, dy: 0.04, ph: 0.0 },
      { x: 0.25, y: 0.45, r: 0.4, hue: "rgba(74,130,208,.8)", dx: 0.08, dy: 0.05, ph: 1.7 },
      { x: 0.75, y: 0.5, r: 0.42, hue: "rgba(74,130,208,.75)", dx: 0.07, dy: 0.06, ph: 3.1 },
      { x: 0.5, y: 0.75, r: 0.5, hue: "rgba(30,77,153,.9)", dx: 0.05, dy: 0.04, ph: 4.4 },
      { x: 0.15, y: 0.15, r: 0.3, hue: "rgba(170,200,245,.55)", dx: 0.09, dy: 0.07, ph: 5.6 },
      { x: 0.85, y: 0.2, r: 0.3, hue: "rgba(170,200,245,.5)", dx: 0.08, dy: 0.06, ph: 2.3 },
    ];

    const paintField = (t: number) => {
      const ow = off.width;
      const oh = off.height;
      const base = offCtx.createLinearGradient(0, 0, 0, oh);
      base.addColorStop(0, "#041737");
      base.addColorStop(0.45, "#0a2c63");
      base.addColorStop(1, "#082558");
      offCtx.globalCompositeOperation = "source-over";
      offCtx.fillStyle = base;
      offCtx.fillRect(0, 0, ow, oh);

      offCtx.globalCompositeOperation = "screen";
      for (const b of blobs) {
        const bx = (b.x + Math.sin(t * b.dx + b.ph) * 0.08) * ow;
        const by = (b.y + Math.cos(t * b.dy + b.ph) * 0.06) * oh;
        const br = b.r * Math.min(ow, oh) * (1 + 0.08 * Math.sin(t * 0.11 + b.ph));
        const g = offCtx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, b.hue);
        g.addColorStop(1, "rgba(4,23,55,0)");
        offCtx.fillStyle = g;
        offCtx.fillRect(0, 0, ow, oh);
      }
    };

    const render = (now: number) => {
      const t = now / 1000;
      paintField(t);

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.imageSmoothingEnabled = true;
      const cols = Math.ceil(w / RIB);
      const ow = off.width;
      const sliceW = ow / cols;

      for (let c = 0; c < cols; c++) {
        // each rib samples the field with a sideways offset → refraction
        const wobble = Math.sin(c * 1.7 + t * 0.35);
        const shift = wobble * sliceW * 1.4;
        const sx = Math.max(0, Math.min(ow - sliceW, c * sliceW + shift));
        ctx.drawImage(off, sx, 0, sliceW, off.height, c * RIB, 0, RIB, h);

        // per-rib shading: a bright streak and darkened edges
        const lg = ctx.createLinearGradient(c * RIB, 0, (c + 1) * RIB, 0);
        const gleam = 0.16 + 0.1 * Math.sin(c * 2.3 + t * 0.5);
        lg.addColorStop(0, "rgba(2,10,30,.42)");
        lg.addColorStop(0.18, "rgba(2,10,30,.05)");
        lg.addColorStop(0.45, `rgba(255,255,255,${Math.max(0, gleam)})`);
        lg.addColorStop(0.62, "rgba(255,255,255,0)");
        lg.addColorStop(1, "rgba(2,10,30,.38)");
        ctx.fillStyle = lg;
        ctx.fillRect(c * RIB, 0, RIB, h);
      }

      // crown glow, mirroring the reference's bright upper third
      const crown = ctx.createRadialGradient(w / 2, h * 0.3, 0, w / 2, h * 0.3, Math.max(w, h) * 0.55);
      crown.addColorStop(0, "rgba(140,180,235,.32)");
      crown.addColorStop(1, "rgba(24,73,139,0)");
      ctx.fillStyle = crown;
      ctx.fillRect(0, 0, w, h);
    };

    const loop = (now: number) => {
      render(now);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduceMotion) {
      render(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="stage__glass" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
