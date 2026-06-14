import { BeamFrame } from "./BeamFrame";
import { Brand } from "./icons";

const NAV_LINKS = ["About", "Product", "Integrations", "Pricing", "Blog"];

export function TopNav() {
  return (
    <nav className="topnav is-glass" data-nav>
      <BeamFrame />
      <a className="topnav__brand" href="#">
        <Brand />
      </a>
      <div className="topnav__links">
        {NAV_LINKS.map((l) => (
          <a href="#" key={l}>
            {l}
          </a>
        ))}
      </div>
      <div className="topnav__right">
        <a className="topnav__signin" href="#">
          Sign In
        </a>
        <button className="topnav__cta">
          <BeamFrame />
          Get Started
        </button>
        <button className="topnav__burger" data-burger aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

export function Drawer() {
  return (
    <div className="drawer" data-drawer>
      <button className="drawer__close" data-drawer-close aria-label="Close menu">
        ✕
      </button>
      {NAV_LINKS.map((l) => (
        <a href="#" key={l}>
          {l}
        </a>
      ))}
      <a href="#" className="dim">
        Sign In
      </a>
    </div>
  );
}
