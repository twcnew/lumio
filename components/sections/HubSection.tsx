import type { CSSProperties } from "react";
import { SplitText } from "../SplitText";
import { BankIcon, FlowIcon, KnotMark, LumioMark, NotchMark, PinwheelMark } from "../icons";

type Tile = {
  slot: string; // ring position g1…g9 (g5 = centre, unused on the ring)
  group?: "a" | "b";
  blank?: boolean;
  style?: CSSProperties;
  node: React.ReactNode;
};

/* Wordmark tiles are styled text — every "logo" here is typography or an
   original SVG, so the whole orbit ships without third-party artwork. */
const TILES: Tile[] = [
  { slot: "g1", blank: true, node: <NotchMark /> },
  {
    slot: "g2",
    group: "a",
    style: { background: "#1AB4D7", fontStyle: "italic", fontWeight: 700, fontSize: 24, letterSpacing: "-0.04em" },
    node: <span>xero</span>,
  },
  {
    slot: "g3",
    group: "a",
    style: { background: "#635BFF", fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500, fontSize: 30, color: "#fff" },
    node: <span>stripe</span>,
  },
  { slot: "g4", group: "a", style: { background: "#4A154B" }, node: <PinwheelMark /> },
  { slot: "g6", group: "a", style: { background: "#0F1A2A" }, node: <span>aws</span> },
  { slot: "g7", group: "a", style: { background: "#2CA01C" }, node: <span>qb</span> },
  {
    slot: "g8",
    group: "a",
    style: { background: "#F5614A", fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500, fontSize: 30, color: "#fff" },
    node: <span>gusto</span>,
  },
  { slot: "g9", blank: true, node: <KnotMark /> },

  { slot: "g1", group: "b", style: { background: "#0B2545", fontSize: 18, letterSpacing: "-0.03em" }, node: <span>svb⟩</span> },
  {
    slot: "g2",
    group: "b",
    style: { background: "#0F2A1F", fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#FFD93D", fontSize: 24 },
    node: <span>ramp</span>,
  },
  { slot: "g3", group: "b", style: { background: "#0E0A07", fontSize: 18 }, node: <span>PLAID</span> },
  {
    slot: "g4",
    group: "b",
    style: { background: "#0E3B2E", fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#FFE5A0", fontSize: 26 },
    node: <span>Relay</span>,
  },
  {
    slot: "g6",
    group: "b",
    style: { background: "#F2EB16", color: "#0E0A07", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 30 },
    node: <span>brex</span>,
  },
  { slot: "g7", group: "b", style: { background: "#fff", color: "#117ACA", fontStyle: "italic", fontWeight: 700, fontSize: 18 }, node: <span>CHASE</span> },
  {
    slot: "g8",
    group: "b",
    style: { background: "#163300", color: "#9FE870", fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 700, fontSize: 34 },
    node: <span>wise</span>,
  },
  { slot: "g9", group: "b", style: { background: "#FF5000", color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }, node: <span>mercury</span> },
];

const FILTERS: Array<{ label: string; group: "a" | "b" }> = [
  { label: "Revenue", group: "a" },
  { label: "Expenses", group: "a" },
  { label: "Banking", group: "b" },
  { label: "Payroll", group: "a" },
  { label: "Analytics", group: "a" },
  { label: "Communication", group: "a" },
];

/** S4 — integrations hub: orbiting tiles around the Lumio core. */
export function HubSection() {
  return (
    <section className="sec-hub" data-panel="hub">
      <div className="hub__lines" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="hub__axis" aria-hidden="true" />
      <div className="hub__inner">
        <div className="orbit" data-orbit aria-hidden="true">
          <div className="tile tile--core">
            <LumioMark />
          </div>
          <div className="core-label">
            <div className="n">Lumio</div>
            <div className="k">40+ INTEGRATIONS</div>
          </div>

          <div className="orbit__ring">
            {TILES.map((t, i) => (
              <div
                key={i}
                className={`tile${t.blank ? " tile--blank" : ""}`}
                data-slot={t.slot}
                data-group={t.group}
                style={{
                  ...t.style,
                  display: t.group === "b" ? "none" : undefined,
                }}
              >
                {t.node}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-wheel" data-filters>
          {FILTERS.map((f, i) => (
            <button key={f.label} className={i === 0 ? "active" : ""} data-group={f.group}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="hub__bottom">
          <div className="eyebrow">
            <span className="sq" />
            YOUR FINANCIAL HUB
          </div>
          <SplitText
            as="h2"
            step={19}
            segments={[
              { text: "Your Entire Stack," },
              { text: "Connected in Minutes", className: "accent", breakBefore: true, pauseBefore: 110 },
            ]}
          />
        </div>

        <div className="hub__pill">
          <div className="av">
            <i>
              <BankIcon />
            </i>
            <i>
              <FlowIcon />
            </i>
          </div>
          <div className="meta">
            <div className="t">Integrations</div>
            <div className="s">9 IN BANKING</div>
          </div>
        </div>

        <div className="hub__stamp">SYNC STARTS INSTANTLY</div>
      </div>
    </section>
  );
}
