"use client";

import { useRef } from "react";
import { useExperience } from "@/lib/useExperience";
import { BeamFrame } from "./BeamFrame";
import { BrowserMock } from "./BrowserMock";
import { Drawer, TopNav } from "./Chrome";
import { HeroBackdrop } from "./HeroBackdrop";
import { SplitText } from "./SplitText";
import { Brand, DoubleArrows } from "./icons";
import { ThinkSection } from "./sections/ThinkSection";
import { HowSection } from "./sections/HowSection";
import { HubSection } from "./sections/HubSection";

const SUB_LINES = [
  "On construit des process AI-native adaptés à votre marché.",
  "Positionnement, ciblage, outbound et démos : tout est pensé",
  "pour transformer un produit complexe en pipeline qualifié.",
];

export function LumioHome() {
  const rootRef = useRef<HTMLDivElement>(null);
  useExperience(rootRef);

  return (
    <div ref={rootRef}>
      <TopNav />
      <Drawer />

      {/* the curtain: hero stage that slides away on scroll */}
      <div className="stage" data-stage>
        <HeroBackdrop />
        <div className="stage__logo" data-splash aria-hidden="true">
          <Brand />
        </div>
        <div className="stage__tint" aria-hidden="true" />
        <div className="stage__vignette" aria-hidden="true" />

        <section className="hero">
          <div className="hero__pill" data-pill>
            <BeamFrame />
            <span className="chip">NEW</span>
            <span className="label">GTM AI-native · Pour produits complexes</span>
          </div>
          <SplitText
            as="h1"
            className="hero__title"
            step={11}
            segments={[
              { text: "Vendez Votre Produit Complexe." },
              { text: "Avec un GTM ", className: "row2", breakBefore: true },
              { text: "Sur Mesure.", className: "row2 accent" },
            ]}
          />
          <p className="hero__sub" data-sub>
            {SUB_LINES.map((line) => (
              <span className="sub-row" key={line}>
                {line}
              </span>
            ))}
          </p>
          <div className="hero__ctas" data-ctas>
            <button className="btn btn-solid">
              <BeamFrame />
              Construire mon GTM
              <DoubleArrows />
            </button>
            <button className="btn btn-ghost">
              <BeamFrame />
              Voir la méthode
            </button>
          </div>
        </section>

        <BrowserMock />
        <div className="stage__lip" aria-hidden="true" />
      </div>

      {/* the deck: panels revealed behind the curtain */}
      <main className="deck" data-deck>
        <div className="deck__panel deck__panel--ghost" />
        <div className="deck__panel">
          <ThinkSection />
        </div>
        <div className="deck__panel">
          <HowSection />
        </div>
        <div className="deck__panel">
          <HubSection />
        </div>
      </main>
    </div>
  );
}
