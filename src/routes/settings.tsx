import { createFileRoute } from "@tanstack/react-router";
import { Battery, Bluetooth, Cpu, Languages, Vibrate, Wifi } from "lucide-react";
import { AppShell } from "@/components/belt/AppShell";
import { HapticSettings } from "@/components/belt/widgets";
import { useBelt } from "@/context/BeltContext";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Vibelt Config" },
      {
        name: "description",
        content: "Manage device, haptics, and accessibility preferences for your Vibelt belt.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { isConnected, connectedDeviceName, openScan, disconnect } = useBelt();
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        {/* Device card */}
        <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Device
          </h2>

          <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 mb-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 grid place-items-center">
              <Cpu size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-100 truncate">
                {isConnected ? connectedDeviceName : "No device paired"}
              </div>
              <div className="text-xs text-slate-500">
                {isConnected ? "Firmware 2.4.1 · BLE 5.2" : "Pair a Vibelt to get started"}
              </div>
            </div>
            {isConnected ? (
              <button
                onClick={disconnect}
                className="text-xs font-semibold text-rose-500 hover:text-rose-400 px-2 h-9"
              >
                Unpair
              </button>
            ) : (
              <button
                onClick={openScan}
                className="text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 rounded-lg px-3 h-9"
              >
                Pair
              </button>
            )}
          </div>

          <ul className="space-y-2">
            <InfoRow icon={Battery} label="Battery" value={isConnected ? "82%" : "—"} />
            <InfoRow icon={Bluetooth} label="Signal" value={isConnected ? "-42 dBm" : "—"} />
            <InfoRow icon={Wifi} label="Sync" value={isConnected ? "Just now" : "—"} />
          </ul>
        </section>

        {/* Accessibility */}
        <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Accessibility
          </h2>
          <div className="space-y-2">
            <ToggleRow icon={Vibrate} label="Strong haptic feedback" defaultChecked />
            <ToggleRow icon={Languages} label="Caption hazard names" defaultChecked />
            <ToggleRow icon={Bluetooth} label="Auto-reconnect on launch" />
          </div>
        </section>

        <div className="lg:col-span-2">
          <HapticSettings />
        </div>
      </div>
    </AppShell>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <li className="flex items-center gap-3 px-3 h-11 rounded-lg bg-slate-950/40 border border-slate-800">
      <Icon size={14} className="text-cyan-400" />
      <span className="text-sm text-slate-300 flex-1">{label}</span>
      <span className="text-xs font-mono text-slate-400">{value}</span>
    </li>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  defaultChecked,
}: {
  icon: any;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 px-3 h-12 rounded-lg bg-slate-950/40 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
      <Icon size={16} className="text-cyan-400" />
      <span className="text-sm text-slate-300 flex-1">{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <div className="relative h-6 w-11 rounded-full bg-slate-700 peer-checked:bg-cyan-500 transition peer-checked:[&>span]:translate-x-5">
        <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition" />
      </div>
    </label>
  );
}
