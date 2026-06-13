import { SplitText } from "../SplitText";
import { ArrowRight } from "../icons";

const LEDE_LINES = [
  "Lumio™ is built by a small team of",
  "founders who spent years watching great",
  "SaaS companies make bad financial",
  "decisions — not because they were",
  "careless, but because their tools made",
  "everything harder than it needed to be.",
  "We believe that understanding your money shouldn't",
  "require a CFO, a data team, or a PhD in spreadsheets",
];

/** S2 — manifesto panel ("how we think"). */
export function ThinkSection() {
  return (
    <section className="sec-think" data-panel="think">
      <div className="think__inner">
        <div className="think__ovals" aria-hidden="true">
          <div className="o" />
          <div className="o square" />
          <div className="o" />
          <div className="o" />
        </div>

        <div className="think__grid">
          <div>
            <span className="eyebrow">
              <span className="sq" />
              HOW WE THINK
            </span>
          </div>
          <div>
            <SplitText
              as="h2"
              step={38}
              segments={[
                { text: "We're engineers at heart" },
                { text: "and builders by obsession", breakBefore: true },
              ]}
            />
            <p className="think__lede">
              {LEDE_LINES.map((line) => (
                <span className="sub-row" key={line}>
                  {line}
                </span>
              ))}
            </p>
          </div>
          <div />
        </div>

        <div className="think__bottom">
          <div className="think__note">
            <p>
              We believe that understanding your money shouldn't require a CFO, a data team, or a
              PhD in spreadsheets
            </p>
            <button className="btn-meet">
              Meet the Team
              <ArrowRight />
            </button>
          </div>
          <div className="think__stats">
            <div className="stat violet">
              <div className="v" data-count="4200" data-suffix="+" data-format="int">
                0+
              </div>
              <div className="l">
                SAAS
                <br />
                COMPANIES
                <br />
                TRUST LUMIO
              </div>
            </div>
            <div className="stat blue">
              <div className="v" data-count="2.4" data-prefix="$" data-suffix="B" data-format="dec1">
                $0.0B
              </div>
              <div className="l">
                REVENUE
                <br />
                TRACKED
                <br />
                MONTHLY
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
