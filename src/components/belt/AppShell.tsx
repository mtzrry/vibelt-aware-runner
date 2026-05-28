import { useEffect, useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { Sidebar, NAV_LINKS } from "./Sidebar";
import { ConnectButton } from "./ConnectButton";
import { ConnectModal } from "./ConnectModal";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const current = NAV_LINKS.find((n) => n.to === pathname) ?? NAV_LINKS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex w-full">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 shrink-0 sticky top-0 z-30 bg-slate-950/80 backdrop-blur border-b border-slate-800 px-4 md:px-6 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="lg:hidden h-10 w-10 grid place-items-center rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 active:scale-95 transition"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              Vibelt Config
            </div>
            <h1 className="text-base md:text-lg font-bold text-slate-100 leading-tight truncate">
              {current.label}
            </h1>
          </div>

          <ConnectButton />
        </header>

        <main className="flex-1 px-4 md:px-6 lg:px-8 py-5 md:py-7">{children}</main>
      </div>

      <ConnectModal />
    </div>
  );
}
