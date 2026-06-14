"use client";

import { useEffect, useRef } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const HERO_VIDEO_WEBM = `${BASE}/screen1-glass.webm`;
const HERO_VIDEO_MP4 = `${BASE}/screen1-glass.mp4`;

/**
 * Hero backdrop — ribbed-glass loop with tint / vignette overlays in LumioHome.
 * WebM (VP9) first for Chrome/Firefox; MP4 (H.264) fallback for Safari.
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
        <source src={HERO_VIDEO_WEBM} type="video/webm" />
        <source src={HERO_VIDEO_MP4} type="video/mp4" />
      </video>
    </div>
  );
}
