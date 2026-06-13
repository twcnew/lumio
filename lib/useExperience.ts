"use client";

import { useEffect, type RefObject } from "react";

/**
 * Orchestrates the whole one-page experience:
 *
 *  - intro timeline (splash logo → nav unfold → hero letters → browser drop)
 *  - desktop full-page scroll: the deck snaps panel by panel while the
 *    curtain stage slides away; mobile falls back to natural scroll with
 *    viewport-entry triggers
 *  - per-panel reveals (think / how / hub) incl. count-ups and the runway
 *    chart line drawing
 *  - the integrations orbit (continuous spin + spiral pop-ins) and the
 *    vertical filter wheel
 *
 * Everything is cleanup-safe so hot reloads don't stack listeners.
 */

const EASE_SNAP = "cubic-bezier(.77,0,.18,1)";

export function useExperience(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const $ = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel);
    const $$ = <T extends HTMLElement>(sel: string) => [...root.querySelectorAll<T>(sel)];

    const timeouts: number[] = [];
    const rafs: number[] = [];
    const cleanups: Array<() => void> = [];
    const later = (fn: () => void, ms: number) => timeouts.push(window.setTimeout(fn, ms));
    const everyFrame = (fn: FrameRequestCallback) => {
      let id = 0;
      const loop: FrameRequestCallback = (t) => {
        fn(t);
        id = requestAnimationFrame(loop);
        rafs[slot] = id;
      };
      const slot = rafs.length;
      rafs.push(requestAnimationFrame(loop));
    };
    const listen = <K extends keyof WindowEventMap>(
      target: Window | HTMLElement,
      type: string,
      fn: EventListenerOrEventListenerObject,
      opts?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, fn, opts);
      cleanups.push(() => target.removeEventListener(type, fn, opts));
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 900px)").matches;

    const nav = $(".topnav")!;
    const stage = $(".stage")!;
    const deck = $(".deck")!;
    const panels = $$(".deck > .deck__panel");

    /* ---------------------------------------------------------- utilities */

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const countUp = (
      el: HTMLElement,
      target: number,
      opts: { prefix?: string; suffix?: string; dec?: number; dur?: number } = {},
    ) => {
      const { prefix = "", suffix = "", dec = 0, dur = 1400 } = opts;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const v = target * easeOutCubic(t);
        const out = dec > 0 ? v.toFixed(dec) : Math.round(v).toLocaleString("en-US");
        el.textContent = prefix + out + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const countUpFromText = (el: HTMLElement, dur = 1500) => {
      const raw = (el.textContent ?? "").trim();
      const prefix = raw.startsWith("$") ? "$" : "";
      const suffix = raw.endsWith("%") ? "%" : "";
      const target = parseInt(raw.replace(/[^0-9]/g, ""), 10);
      if (!Number.isFinite(target)) return;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        el.textContent = prefix + Math.round(target * easeOutCubic(t)).toLocaleString("en-US") + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = raw;
      };
      requestAnimationFrame(tick);
    };

    const staggerRows = (rows: HTMLElement[], base: number, gap: number) => {
      rows.forEach((row, i) => later(() => row.classList.add("in"), base + i * gap));
    };

    /* -------------------------------------------------------------- intro */

    const runIntro = () => {
      if (reduceMotion) {
        nav.classList.add("nav-ready");
        $(".hero__title")?.classList.add("in");
        $$("[data-sub] .sub-row, .hero__pill, .hero__ctas").forEach((el) => el.classList.add("in", "play-in"));
        $(".mock")?.classList.add("play-in");
        return;
      }

      const splash = $("[data-splash]")!;
      later(() => splash.classList.add("play-in"), 80);
      later(() => {
        splash.classList.add("play-out");
        nav.classList.add("play-nav");
      }, 200);
      later(() => $(".topnav__brand")?.classList.add("play-in"), 280);

      const links = $$(".topnav__links a");
      links.forEach((a, i) => later(() => a.classList.add("play-in"), 330 + i * 55));
      const linksEnd = 330 + links.length * 55;

      later(() => $(".topnav__signin")?.classList.add("play-in"), linksEnd + 60);
      later(() => $(".topnav__cta")?.classList.add("play-in"), linksEnd + 240);
      later(() => $("[data-pill]")?.classList.add("play-in"), linksEnd + 120);

      const title = $(".hero__title")!;
      later(() => title.classList.add("in"), linksEnd + 160);

      const letterCount = title.querySelectorAll(".lt").length;
      const titleDone = 160 + (letterCount - 1) * 11 + 300;
      const subRows = $$("[data-sub] .sub-row");
      staggerRows(subRows, linksEnd + titleDone, 90);
      const subEnd = titleDone + (subRows.length - 1) * 90 + 225;

      later(() => $("[data-ctas]")?.classList.add("play-in"), linksEnd + subEnd + 120);
      later(() => {
        $(".mock")?.classList.add("play-in");
        later(() => $$(".kpi__val").forEach((el) => countUpFromText(el)), 1500);
      }, linksEnd + subEnd + 300);

      later(() => nav.classList.add("nav-ready"), linksEnd + 900);
    };

    /* -------------------------------------------------- panel: S2 "think" */

    let thinkDone = false;
    const triggerThink = () => {
      if (thinkDone) return;
      thinkDone = true;
      const sec = $(".sec-think")!;
      sec.classList.add("is-live");
      sec.querySelector(".think__grid .split-wait")?.classList.add("in");
      staggerRows([...sec.querySelectorAll<HTMLElement>(".think__lede .sub-row")], 450, 220);
      const violet = sec.querySelector<HTMLElement>(".stat.violet .v");
      const blue = sec.querySelector<HTMLElement>(".stat.blue .v");
      if (violet) later(() => countUp(violet, 4200, { suffix: "+" }), 1350);
      if (blue) later(() => countUp(blue, 2.4, { prefix: "$", suffix: "B", dec: 1 }), 1650);
    };

    /* ---------------------------------------------------- panel: S3 "how" */

    const playRunwayChart = (sec: HTMLElement) => {
      const chart = sec.querySelector<HTMLElement>(".chart");
      if (!chart) return;
      const line = chart.querySelector<SVGPathElement>(".chart-line");
      const clip = chart.querySelector<SVGRectElement>(".chart-clip");
      const dot = chart.querySelector<HTMLElement>(".chart-dot");
      const flag = chart.querySelector<HTMLElement>(".chart-flag");
      if (!line || !clip || !dot || !flag) return;

      const len = line.getTotalLength();
      const DUR = 5400;
      const DOT_STOP = 0.65; // the dot parks while the clip keeps revealing
      const FLAG_AT = 0.3;
      const FLAG_LIFT = -30; // % above the dot

      const p0 = line.getPointAtLength(0);
      dot.style.left = `${(p0.x / 280) * 100}%`;
      dot.style.top = `${(p0.y / 140) * 100}%`;
      dot.style.opacity = "1";

      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / DUR);
        const eased = easeOutCubic(t);
        clip.setAttribute("width", String(eased * 280));

        const pt = line.getPointAtLength(Math.min(eased, DOT_STOP) * len);
        const lx = (pt.x / 280) * 100;
        const ty = (pt.y / 140) * 100;
        dot.style.left = `${lx}%`;
        dot.style.top = `${ty}%`;

        if (eased >= FLAG_AT) {
          flag.style.opacity = String(Math.min(1, (eased - FLAG_AT) / 0.15));
          flag.style.left = `${lx}%`;
          flag.style.top = `${ty + FLAG_LIFT}%`;
        }
        if (t < 1) requestAnimationFrame(step);
        else flag.style.opacity = "1";
      };
      requestAnimationFrame(step);
    };

    let howDone = false;
    const triggerHow = () => {
      if (howDone) return;
      howDone = true;
      const sec = $(".sec-how")!;
      const h2 = sec.querySelector<HTMLElement>(".how__head .split-wait");
      sec.classList.add("is-live");
      h2?.classList.add("in");

      const letters = h2 ? h2.querySelectorAll(".lt").length : 0;
      const h2Done = 50 + (letters - 1) * 19 + 110 + 450;
      const subRows = [...sec.querySelectorAll<HTMLElement>(".how__head .sub-row")];
      staggerRows(subRows, h2Done, 110);
      const subEnd = h2Done + (subRows.length - 1) * 110 + 350;

      later(() => {
        sec.classList.add("cards-live");

        // 01 — connect: rows burst in one after the other
        later(() => {
          sec.querySelector(".fcard--connect .stamp")?.classList.add("pop-rise");
          sec.querySelectorAll(".fcard--connect .conn").forEach((conn, i) => {
            later(() => conn.classList.add("pop-burst"), i * 350);
          });
        }, 800);

        // 02 — detect: panel bursts, then the saving box counts up
        later(() => {
          const ai = sec.querySelector<HTMLElement>(".ai-card");
          ai?.classList.add("pop-burst");
          sec.querySelector(".fcard--detect .stamp")?.classList.add("pop-rise");
          later(() => {
            const saving = ai?.querySelector<HTMLElement>(".saving");
            saving?.classList.add("pop-rise");
            const v = saving?.querySelector<HTMLElement>(".v");
            if (!v) return;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / 1400);
              v.innerHTML = `$${Math.round(2400 * easeOutCubic(t)).toLocaleString("en-US")} <em>/ mo</em>`;
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }, 700);
        }, 1050);

        // 03 — forecast: panel bursts, then the chart draws
        later(() => {
          sec.querySelector(".runway-card")?.classList.add("pop-burst");
          sec.querySelector(".fcard--forecast .stamp")?.classList.add("pop-rise");
          later(() => playRunwayChart(sec), 750);
        }, 1300);
      }, subEnd);
    };

    /* ---------------------------------------------------- panel: S4 "hub" */

    // per-tile animation state, driven by the spin loop below
    type TileState = { scale: number; radius: number; lag: number };
    const tileState = new Map<HTMLElement, TileState>();
    const stateOf = (t: HTMLElement) => {
      let s = tileState.get(t);
      if (!s) {
        s = { scale: 0, radius: 1, lag: 0 };
        tileState.set(t, s);
      }
      return s;
    };

    const orbit = $("[data-orbit]");
    const ringTiles = $$(".orbit__ring .tile");
    let hubIntroDone = false;

    /** spiral a tile in: it scales up while catching up with the ring */
    const spiralIn = (tile: HTMLElement, dur: number, delay: number, overshoot = 1.08) => {
      const s = stateOf(tile);
      s.scale = 0;
      s.radius = 0;
      s.lag = -280;
      later(() => {
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const out = 1 - Math.pow(1 - t, 4);
          s.radius = Math.pow(out, 0.618);
          s.scale =
            t < 0.8
              ? 1 - Math.pow(1 - t / 0.8, 4)
              : 1 + (overshoot - 1) * Math.sin(((t - 0.8) / 0.2) * Math.PI);
          s.lag = -280 * Math.pow(1 - t, 2.5);
          if (t < 1) requestAnimationFrame(step);
          else Object.assign(s, { scale: 1, radius: 1, lag: 0 });
        };
        requestAnimationFrame(step);
      }, delay);
    };

    const visibleRingTiles = () => ringTiles.filter((t) => t.style.display !== "none");

    /** sort tiles clockwise from 12 o'clock so pops cascade around the ring */
    const clockwise = (tiles: HTMLElement[]) => {
      if (!orbit) return tiles;
      const o = orbit.getBoundingClientRect();
      const cx = o.left + o.width / 2;
      const cy = o.top + o.height / 2;
      return tiles
        .map((t) => {
          const r = t.getBoundingClientRect();
          let ang = (Math.atan2(r.left + r.width / 2 - cx, cy - (r.top + r.height / 2)) * 180) / Math.PI;
          if (ang < 0) ang += 360;
          return { t, ang };
        })
        .sort((a, b) => a.ang - b.ang)
        .map((x) => x.t);
    };

    let hubDone = false;
    const triggerHub = () => {
      if (hubDone) return;
      hubDone = true;
      const sec = $(".sec-hub")!;
      sec.classList.add("is-live");

      const core = sec.querySelector<HTMLElement>(".tile--core");
      if (core) {
        core.style.transition = "transform 1700ms cubic-bezier(0.34,1.45,0.64,1), opacity 1000ms ease";
        core.style.transform = "scale(1) translateY(0)";
        core.style.opacity = "1";
      }
      sec.querySelectorAll<HTMLElement>(".core-label .n, .core-label .k").forEach((el, i) => {
        const d = 1200 + i * 260;
        el.style.transition = `opacity 1200ms ease ${d}ms, transform 1200ms cubic-bezier(0.34,1.35,0.64,1) ${d}ms`;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });

      sec.querySelector(".hub__bottom .split-wait")?.classList.add("in");
      later(() => $("[data-filters]")?.classList.add("play-in"), 2100);

      clockwise(visibleRingTiles()).forEach((tile, i) => spiralIn(tile, 1800, 2100 + i * 160));
      const lastIn = 2100 + (visibleRingTiles().length - 1) * 160 + 1800;
      later(() => {
        hubIntroDone = true;
      }, lastIn);
    };

    /* orbit spin — runs from mount; tiles only show once scale > 0 */
    if (orbit && !reduceMotion) {
      const SLOT_ANGLE: Record<string, number> = {
        g2: 0, g3: 45, g6: 90, g9: 135, g8: 180, g7: 225, g4: 270, g1: 315,
      };
      // design tilt at each of the 8 ring stops, interpolated in between
      const STOP_TILT = [-0.991, 43.025, 90.926, 134.422, 179.009, 223.025, 270.926, 314.422];
      const tiltAt = (a: number) => {
        a = ((a % 360) + 360) % 360;
        const idx = a / 45;
        const i0 = Math.floor(idx) % 8;
        const i1 = (i0 + 1) % 8;
        const frac = idx - Math.floor(idx);
        const d = ((STOP_TILT[i1] - STOP_TILT[i0] + 540) % 360) - 180;
        return STOP_TILT[i0] + d * frac;
      };

      const PERIOD = 32000;
      let radius = 220;
      const measure = () => {
        const w = orbit.getBoundingClientRect().width;
        const tw = ringTiles[0]?.getBoundingClientRect().width || 136;
        radius = Math.max(60, (w - tw) / 2);
      };
      measure();
      listen(window, "resize", measure);

      let last = performance.now();
      let spin = 0;
      everyFrame((now) => {
        spin = (spin + ((now - last) / PERIOD) * 360) % 360;
        last = now;
        for (const tile of ringTiles) {
          const s = stateOf(tile);
          const base = SLOT_ANGLE[tile.dataset.slot ?? ""] ?? 0;
          const a = base + spin + s.lag;
          const tilt = tiltAt(a);
          tile.style.transform =
            `rotate(${a}deg) translateY(${-radius * s.radius}px) rotate(${-a + tilt}deg) scale(${s.scale})`;
          tile.style.setProperty("--rot", `${tilt}deg`);
        }
      });
    } else if (orbit) {
      // reduced motion: park the tiles on the ring, full size
      const SLOT_ANGLE: Record<string, number> = {
        g2: 0, g3: 45, g6: 90, g9: 135, g8: 180, g7: 225, g4: 270, g1: 315,
      };
      const w = orbit.getBoundingClientRect().width;
      const tw = ringTiles[0]?.getBoundingClientRect().width || 136;
      const radius = Math.max(60, (w - tw) / 2);
      for (const tile of ringTiles) {
        const a = SLOT_ANGLE[tile.dataset.slot ?? ""] ?? 0;
        tile.style.transform = `rotate(${a}deg) translateY(${-radius}px) rotate(${-a}deg) scale(1)`;
      }
    }

    /* filter wheel: a vertical carousel that drifts, steers on hover and
       snaps to the clicked entry; "Banking" swaps the ring to group b */
    const wheel = $("[data-filters]");
    if (wheel) {
      const items = [...wheel.querySelectorAll<HTMLButtonElement>("button")];
      const N = items.length;
      const STEP = 50;
      const DRIFT = 0.0007;
      let offset = 0;
      let speed = reduceMotion ? 0 : 1;
      let lastT = performance.now();

      const applyGroup = (showB: boolean) => {
        for (const tile of ringTiles) {
          const isB = tile.dataset.group === "b";
          const blank = !tile.dataset.group;
          tile.style.display = (isB ? showB : !showB || blank) && !(blank && showB) ? "grid" : "none";
        }
        if (!hubIntroDone) return;
        clockwise(visibleRingTiles()).forEach((tile, i) => {
          const s = stateOf(tile);
          s.scale = 0;
          s.radius = 0;
          s.lag = -300;
          later(() => {
            const start = performance.now();
            const back = (x: number) => {
              const c1 = 1.70158;
              return 1 + (c1 + 1) * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
            };
            const step = (now: number) => {
              const t = Math.min(1, (now - start) / 900);
              s.scale = Math.max(0, Math.min(1.15, back(t)));
              s.radius = Math.pow(1 - Math.pow(1 - t, 3), 0.618);
              s.lag = -300 * Math.pow(1 - t, 2);
              if (t < 1) requestAnimationFrame(step);
              else Object.assign(s, { scale: 1, radius: 1, lag: 0 });
            };
            requestAnimationFrame(step);
          }, i * 90);
        });
      };

      listen(wheel, "mouseenter", () => (speed = 0));
      listen(wheel, "mouseleave", () => (speed = reduceMotion ? 0 : 1));
      listen(wheel, "mousemove", ((e: MouseEvent) => {
        const r = wheel.getBoundingClientRect();
        const rel = (e.clientY - r.top) / r.height - 0.5;
        speed = Math.abs(rel) < 0.12 ? 0 : rel * 4;
      }) as EventListener);

      items.forEach((btn, idx) => {
        listen(btn, "click", () => {
          items.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          applyGroup(btn.dataset.group === "b");

          // glide the wheel so the clicked entry parks in the centre slot
          const cur = ((offset % N) + N) % N;
          let diff = idx - cur;
          if (diff > N / 2) diff -= N;
          if (diff < -N / 2) diff += N;
          const from = offset;
          const to = offset + diff;
          const start = performance.now();
          const snap = (now: number) => {
            const t = Math.min(1, (now - start) / 500);
            offset = from + (to - from) * easeOutCubic(t);
            if (t < 1) requestAnimationFrame(snap);
            else offset = ((to % N) + N) % N;
          };
          requestAnimationFrame(snap);
        });
      });

      everyFrame((now) => {
        const dt = now - lastT;
        lastT = now;
        offset = (offset + DRIFT * dt * speed) % N;
        if (offset < 0) offset += N;
        const CENTER = 2.5;
        items.forEach((el, i) => {
          const slot = (((i - offset) % N) + N) % N;
          const pos = slot > N / 2 ? slot - N : slot;
          const y = (pos + CENTER) * STEP;
          const d = Math.abs(pos);
          const opacity =
            d < 0.5 ? 1 : d < 1.5 ? 1 - (d - 0.5) * 0.2 : d < 2.5 ? 0.8 - (d - 1.5) * 0.35 : d < 3.5 ? 0.45 - (d - 2.5) * 0.3 : 0;
          const scale = d < 0.5 ? 1 : Math.max(0.8, 1 - (d - 0.5) * 0.08);
          const blur = d < 1 ? 0 : Math.min(3, (d - 1) * 2);
          const grey = Math.min(165, Math.round(14 + d * 70));
          el.style.transform = `translate3d(0,${y}px,0) scale(${scale})`;
          el.style.opacity = String(Math.max(0, opacity));
          el.style.filter = blur > 0 ? `blur(${blur}px)` : "";
          el.style.color = `rgba(${grey},${grey},${grey},${d < 0.5 ? 1 : Math.max(0.35, 1 - d * 0.28)})`;
          el.style.background = d < 0.5 ? "#fff" : "rgba(14,10,7,.025)";
          el.style.boxShadow = d < 0.5 ? "0 6px 18px rgba(14,10,7,.08)" : "none";
          el.style.zIndex = String(100 - Math.round(d * 10));
          el.style.visibility = opacity > 0.01 ? "visible" : "hidden";
        });
      });
    }

    /* --------------------------------------------------------- navigation */

    const triggers = [null, triggerThink, triggerHow, triggerHub] as const;

    const setNav = (pastHero: boolean) => {
      nav.classList.toggle("is-glass", !pastHero);
      nav.classList.toggle("is-dark", pastHero);
    };

    if (!isMobile && !reduceMotion) {
      /* desktop: hijacked full-page snapping */
      document.documentElement.classList.add("fp-on");
      cleanups.push(() => document.documentElement.classList.remove("fp-on"));

      deck.style.position = "fixed";
      deck.style.top = "0";
      deck.style.left = "0";
      deck.style.width = "100%";
      deck.style.zIndex = "1";
      deck.style.transition = `transform 1000ms ${EASE_SNAP}`;
      deck.style.willChange = "transform";

      let current = 0;
      let animating = false;
      let wheelLock = false;

      const goTo = (idx: number) => {
        idx = Math.max(0, Math.min(panels.length - 1, idx));
        if (idx === current || animating) return;
        current = idx;
        animating = true;
        deck.style.transform = `translateY(-${idx * 100}vh)`;
        setNav(idx !== 0);
        stage.classList.toggle("is-open", idx !== 0);
        triggers[idx]?.();
        later(() => (animating = false), 1050);
      };

      listen(
        window,
        "wheel",
        ((e: WheelEvent) => {
          e.preventDefault();
          if (wheelLock || animating || Math.abs(e.deltaY) < 8) return;
          wheelLock = true;
          goTo(current + (e.deltaY > 0 ? 1 : -1));
          later(() => (wheelLock = false), 1100);
        }) as EventListener,
        { passive: false },
      );

      listen(window, "keydown", ((e: KeyboardEvent) => {
        if (["ArrowDown", "PageDown", " "].includes(e.key)) {
          e.preventDefault();
          goTo(current + 1);
        } else if (["ArrowUp", "PageUp"].includes(e.key)) {
          e.preventDefault();
          goTo(current - 1);
        } else if (e.key === "Home") {
          e.preventDefault();
          goTo(0);
        } else if (e.key === "End") {
          e.preventDefault();
          goTo(panels.length - 1);
        }
      }) as EventListener);

      let touchY: number | null = null;
      listen(
        window,
        "touchstart",
        ((e: TouchEvent) => {
          touchY = e.touches[0].clientY;
        }) as unknown as EventListener,
        { passive: true },
      );
      listen(
        window,
        "touchmove",
        ((e: TouchEvent) => {
          if (touchY == null || animating) return;
          const dy = touchY - e.touches[0].clientY;
          if (Math.abs(dy) > 40) {
            goTo(current + (dy > 0 ? 1 : -1));
            touchY = null;
          }
        }) as EventListener,
        { passive: true },
      );

      setNav(false);

      // dev affordance: /?panel=2 jumps straight to a panel (no slide transition)
      const jump = Number(new URLSearchParams(window.location.search).get("panel"));
      if (jump >= 1 && jump < panels.length) {
        const slide = deck.style.transition;
        deck.style.transition = "none";
        stage.style.transition = "none";
        goTo(jump);
        later(() => {
          deck.style.transition = slide;
          stage.style.transition = "";
        }, 100);
      }
    } else {
      /* mobile / reduced motion: natural scroll with entry triggers */
      const watched: Array<{ sel: string; fn: () => void; done?: boolean }> = [
        { sel: ".sec-think", fn: triggerThink },
        { sel: ".sec-how", fn: triggerHow },
        { sel: ".sec-hub", fn: triggerHub },
      ];
      const onScroll = () => {
        const vh = window.innerHeight;
        setNav(window.scrollY > vh * 0.7);
        for (const wEntry of watched) {
          if (wEntry.done) continue;
          const el = $(wEntry.sel);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.top < vh * 0.7 && r.bottom > vh * 0.3) {
            wEntry.done = true;
            wEntry.fn();
          }
        }
      };
      listen(window, "scroll", onScroll, { passive: true });
      listen(window, "resize", onScroll, { passive: true });
      onScroll();
    }

    /* mobile drawer */
    const drawer = $("[data-drawer]");
    const burger = $("[data-burger]");
    if (drawer && burger) {
      listen(burger, "click", () => drawer.classList.add("is-open"));
      const close = drawer.querySelector("[data-drawer-close]");
      if (close) listen(close as HTMLElement, "click", () => drawer.classList.remove("is-open"));
      drawer.querySelectorAll("a").forEach((a) =>
        listen(a as HTMLElement, "click", () => drawer.classList.remove("is-open")),
      );
    }

    runIntro();

    return () => {
      timeouts.forEach(clearTimeout);
      rafs.forEach(cancelAnimationFrame);
      cleanups.forEach((fn) => fn());
    };
  }, [rootRef]);
}
