import { BeamFrame } from "./BeamFrame";
import {
  BrowserArrows,
  CornerPlus,
  DotsMenu,
  HomeIcon,
  LumioMark,
  Padlock,
  QMark,
  Spark,
  UnfoldMore,
} from "./icons";

const KPIS = [
  {
    label: "MRP",
    value: "$94,280",
    note: "vs $79,620 last month",
    mom: "18.4%",
    bars: [33, 0, 20, 12, 30, 20, 16],
  },
  {
    label: "NRR",
    value: "118%",
    note: "Net revenue retention",
    mom: "4pp",
    bars: [33, 5, 20, 35, 30, 20, 9],
  },
  {
    label: "NEW CUSTOMERS",
    value: "142",
    note: "Signed this month",
    mom: "31%",
    bars: [33, 3, 38, 12, 21, 8, 9],
  },
];

/** The floating product shot: browser chrome + a dashboard rebuilt in HTML. */
export function BrowserMock() {
  return (
    <div className="mock" aria-hidden="true">
      <BeamFrame />
      <div className="mock__bar">
        <div className="mock__nav">
          <BrowserArrows />
        </div>
        <div className="mock__url">
          <CornerPlus />
          <Padlock /> app.lumio.ai / overview
        </div>
        <div className="mock__opts">
          <DotsMenu />
        </div>
      </div>

      <div className="dash">
        <aside className="dash__side">
          <div className="side-card">
            <div className="side-card__logo">
              <LumioMark />
            </div>
            <div className="side-card__meta">
              <div className="k">AGENCY</div>
              <div className="n">Lumio Team</div>
            </div>
            <div className="side-card__unfold">
              <UnfoldMore />
            </div>
          </div>
          <h6>MAIN MENU</h6>
          <div className="side-menu">
            <a className="active" href="#">
              <HomeIcon filled /> Overview
            </a>
            <a href="#">
              <HomeIcon /> Revenue
            </a>
            <a href="#">
              <HomeIcon /> Expenses
            </a>
            <a href="#">
              <HomeIcon /> Runway
            </a>
          </div>
        </aside>

        <div className="dash__main">
          <div className="crumbs">
            <span>Dashboard</span> <span>›</span> <strong>Overview</strong>
          </div>
          <div className="hello">Welcome back, David</div>
          <div className="kpi-grid">
            {KPIS.map((k) => (
              <div className="kpi" key={k.label}>
                <div className="kpi__core">
                  <div>
                    <div className="kpi__label">{k.label}</div>
                    <div className="kpi__val" data-countup>
                      {k.value}
                    </div>
                    <div className="kpi__note">{k.note}</div>
                  </div>
                  <Spark bars={k.bars} />
                </div>
                <div className="kpi__foot">
                  <QMark />
                  <span className="kpi__mom">
                    <span className="up">{k.mom}</span> <span className="lbl">MoM</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
