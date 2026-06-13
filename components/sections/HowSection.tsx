import { BeamFrame } from "../BeamFrame";
import { CornerText, SplitText } from "../SplitText";
import { CashIcon, GlobeIcon, SparkleAI, WarnTriangle } from "../icons";

const CONNECTIONS = [
  { badge: "stripe", badgeNode: <span>stripe</span>, kicker: "Revenue · Subscriptions", name: "Stripe" },
  { badge: "qb", badgeNode: <span>qb</span>, kicker: "Expenses · Payroll · P&L", name: "QuickBooks" },
  { badge: "mercury", badgeNode: <GlobeIcon />, kicker: "Cash balance · Transactions", name: "Mercury" },
];

const SUB_LINES = [
  "Most finance tools hand you more charts to interpret. Lumio does the",
  "interpreting for you connecting your accounts, watching for problems,",
  "and telling you what to do next",
];

/** S3 — "how it works": connect / detect / forecast. */
export function HowSection() {
  return (
    <section className="sec-how" data-panel="how">
      <div className="how__lines" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="how__inner">
        <div className="how__head">
          <CornerText text="THREE THINGS HAPPEN THE" side="l" />
          <CornerText text="MOMENT YOU CONNECT" side="r" />
          <div className="eyebrow">
            <span className="sq" />
            HOW IT WORKS
          </div>
          <SplitText
            as="h2"
            step={19}
            segments={[
              { text: "From Raw Data to Clear" },
              { text: "Decisions in Seconds", className: "accent", breakBefore: true, pauseBefore: 110 },
            ]}
          />
          <p>
            {SUB_LINES.map((line) => (
              <span className="sub-row" key={line}>
                {line}
              </span>
            ))}
          </p>
        </div>

        <div className="fcards">
          {/* 01 — connect */}
          <div className="fcard fcard--connect">
            <div className="conn-list">
              {CONNECTIONS.map((c) => (
                <div className="conn" key={c.name}>
                  <BeamFrame />
                  <div className={`badge ${c.badge}`}>{c.badgeNode}</div>
                  <div className="meta">
                    <div className="kicker">{c.kicker}</div>
                    <div className="name">{c.name}</div>
                  </div>
                  <div className="live-pill">LIVE</div>
                </div>
              ))}
            </div>
            <div className="stamp">01 — CONNECT</div>
          </div>

          {/* 02 — detect */}
          <div className="fcard fcard--detect">
            <div className="ai-card">
              <BeamFrame />
              <div className="panel-head">
                <div className="ic">
                  <SparkleAI />
                </div>
                <div>
                  <div className="k">JUST NOW</div>
                  <div className="t">Ai Insight</div>
                </div>
              </div>
              <div className="msg">
                AWS spend spiked 340% on Mar 18 likely a runaway job or misconfigured autoscaler
              </div>
              <div className="alarm">
                <i>
                  <WarnTriangle />
                </i>
                <span>Anomaly detected</span>
              </div>
              <div className="saving">
                <div className="lbl">Estimated saving</div>
                <div className="v">
                  $2,400 <em>/ mo</em>
                </div>
              </div>
            </div>
            <div className="stamp">02 — DETECT</div>
          </div>

          {/* 03 — forecast */}
          <div className="fcard fcard--forecast">
            <div className="runway-card">
              <BeamFrame />
              <div className="panel-head">
                <div className="ic">
                  <CashIcon />
                </div>
                <div>
                  <div className="k">AI PROJECTION</div>
                  <div className="t">Cash Runway</div>
                </div>
              </div>
              <div className="chart">
                <div className="chart-flag">RUNWAY IMPROVING +4 MO</div>
                <div className="chart-dot" />
                <svg viewBox="0 0 280 140" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="fillFade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fff" stopOpacity=".25" />
                      <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                    </linearGradient>
                    <pattern
                      id="hatch"
                      width="5"
                      height="5"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(45)"
                    >
                      <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(255,255,255,.12)" strokeWidth="1.2" />
                    </pattern>
                    <clipPath id="chartClip">
                      <rect className="chart-clip" x="0" y="0" width="0" height="140" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#chartClip)">
                    <path
                      d="M0 110 C 30 100, 60 80, 90 70 C 120 60, 150 55, 180 35 C 210 22, 240 18, 280 16 L 280 140 L 0 140 Z"
                      fill="url(#fillFade)"
                    />
                    <path
                      d="M93 120 C 93 78, 210 68, 280 65 L 280 16 C 240 18, 210 22, 180 35 C 150 55, 120 60, 93 70 L 93 120 Z"
                      fill="url(#hatch)"
                    />
                    <path
                      className="chart-line"
                      d="M0 110 C 30 100, 60 80, 90 70 C 120 60, 150 55, 180 35 C 210 22, 240 18, 280 16"
                      stroke="#fff"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M93 120 C 93 78, 210 68, 280 65"
                      stroke="rgba(255,255,255,.55)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="6 4"
                    />
                  </g>
                </svg>
                <div className="axis">
                  <span>JUL 01</span>
                  <span>AUG 01</span>
                  <span>OCT 01</span>
                  <span>NOV 01</span>
                </div>
              </div>
              <div className="runway-foot">
                <div className="v">Sep 2026</div>
                <div className="d">Projected cash-out date · 18 months away</div>
              </div>
            </div>
            <div className="stamp">03 — FORECAST</div>
          </div>
        </div>
      </div>
    </section>
  );
}
