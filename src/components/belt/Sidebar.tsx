import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Sliders,
  History,
  Settings,
  Zap,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useBelt } from "@/context/BeltContext";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, desc: "Live run & hazards" },
  { to: "/calibration", label: "Calibration", icon: Sliders, desc: "Test haptic nodes" },
  { to: "/history", label: "History", icon: History, desc: "Past sessions" },
  { to: "/settings", label: "Settings", icon: Settings, desc: "Device & profile" },
] as const;

type Props = {
  mobileOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export function Sidebar({ mobileOpen, onClose, collapsed, onToggleCollapsed }: Props) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { isConnected, connectedDeviceName } = useBelt();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed z-50 top-0 left-0 h-screen bg-slate-900 border-r border-slate-800 flex flex-col",
          "transition-all duration-300 ease-out",
          // mobile slide-in
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // desktop always visible
          "lg:translate-x-0 lg:static lg:z-auto",
          // width responsive
          collapsed ? "w-[72px]" : "w-[260px]",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 grid place-items-center shadow-lg shadow-cyan-500/30">
              <Zap size={18} className="text-slate-950" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-100 leading-tight truncate">
                  Vibelt
                </div>
                <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-semibold">
                  Config
                </div>
              </div>
            )}
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden h-9 w-9 grid place-items-center rounded-lg text-slate-400 hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {!collapsed && (
            <div className="px-2 pt-2 pb-1 text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              Navigation
            </div>
          )}
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={[
                  "group flex items-center gap-3 rounded-xl px-3 h-12 transition relative",
                  active
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200",
                ].join(" ")}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-cyan-400" />
                )}
                <item.icon size={20} className="shrink-0" />
                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold leading-tight">{item.label}</div>
                    <div
                      className={`text-[11px] truncate ${
                        active ? "text-cyan-400/70" : "text-slate-500"
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Device status footer */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          <div
            className={[
              "rounded-xl border p-3 flex items-center gap-3",
              isConnected
                ? "bg-cyan-500/5 border-cyan-500/20"
                : "bg-slate-800/40 border-slate-800",
            ].join(" ")}
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              {isConnected && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  isConnected ? "bg-green-400" : "bg-slate-600"
                }`}
              />
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                  Belt status
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {isConnected ? connectedDeviceName : "Disconnected"}
                </div>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapsed}
            className="hidden lg:flex w-full mt-2 items-center justify-center gap-1.5 h-9 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 text-xs font-medium transition"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>
    </>
  );
}

export const NAV_LINKS = NAV;
