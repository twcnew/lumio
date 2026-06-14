"use client";

import { useEffect, useRef } from "react";

const HERO_VIDEO_SRC = "/screen1-glass.mp4";

/**
 * Hero backdrop — ribbed-glass loop (1920×1080 · 30fps · 15s) with tint /
 * vignette overlays applied in LumioHome (stage__tint, stage__vignette).
 */
export function HeroBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      video.pause();
      return;
    }

    video.play().catch(() => {});
  }, []);

  return (
    <div className="stage__glass" aria-hidden="true">
      <div className="stage__glass-bg" />
      <video
        ref={videoRef}
        className="stage__glass-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  );
}
