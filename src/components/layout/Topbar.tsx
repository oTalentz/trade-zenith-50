import { LineChart, LayoutDashboard, CandlestickChart, SignalHigh, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Topbar() {
  const linkBase =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground";
  const active = "bg-muted text-primary";

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `${linkBase} ${isActive ? active : ""}`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-[image:var(--gradient-brand)] shadow-[var(--shadow-elev)] grid place-items-center text-primary-foreground">
            <LineChart className="h-4 w-4" aria-hidden />
          </div>
          <span className="text-sm sm:text-base font-semibold tracking-tight">TradingAnalytics</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={navClass} aria-label="Dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </NavLink>
          <NavLink to="/charts" className={navClass} aria-label="Charts">
            <CandlestickChart className="mr-2 h-4 w-4" /> Charts
          </NavLink>
          <NavLink to="/signals" className={navClass} aria-label="Signals">
            <SignalHigh className="mr-2 h-4 w-4" /> Signals
          </NavLink>
          <NavLink to="/portfolio" className={navClass} aria-label="Portfolio">
            <Wallet className="mr-2 h-4 w-4" /> Portfolio
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-secondary/70 ring-1 ring-border grid place-items-center">
            <span className="text-xs" aria-hidden>TA</span>
            <span className="sr-only">Perfil</span>
          </div>
        </div>
      </div>
    </header>
  );
}
