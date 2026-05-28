import {
  Activity,
  AlertTriangle,
  Bell,
  Building2,
  Car,
  Eye,
  Flame,
  Timer,
  Trees,
  Volume2,
} from "lucide-react";
import { useBelt } from "@/context/BeltContext";

export function LiveStats() {
  const { distance, pace, calories, isConnected } = useBelt();
  return (
    <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Live Run
        </h2>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
            isConnected ? "bg-cyan-500/10 text-cyan-400" : "bg-slate-800 text-slate-500"
          }`}
        >
          {isConnected ? "Active" : "Idle"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat icon={Activity} label="Distance" value={distance.toFixed(2)} unit="km" />
        <Stat icon={Timer} label="Pace" value={pace} unit="/km" />
        <Stat icon={Flame} label="Calories" value={String(calories)} unit="kcal" />
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: any;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-3 md:p-4">
      <div className="flex items-center gap-1.5 text-slate-400 mb-1">
        <Icon size={12} />
        <span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <div className="text-2xl md:text-3xl font-bold tabular-nums text-slate-100 leading-tight">
        {value}
      </div>
      <div className="text-[10px] text-slate-500 mt-0.5">{unit}</div>
    </div>
  );
}

export function HapticSettings() {
  const { sensitivity, setSensitivity, audioLevel, setAudioLevel, visualLevel, setVisualLevel } =
    useBelt();
  return (
    <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
        Environment & Haptics
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <EnvButton
          active={sensitivity === "city"}
          onClick={() => setSensitivity("city")}
          icon={Building2}
          title="City"
          sub="High Sens"
        />
        <EnvButton
          active={sensitivity === "park"}
          onClick={() => setSensitivity("park")}
          icon={Trees}
          title="Park"
          sub="Low Sens"
        />
      </div>

      <div className="space-y-4">
        <SliderRow icon={Volume2} label="Audio Threats" value={audioLevel} onChange={setAudioLevel} />
        <SliderRow icon={Eye} label="Visual Threats" value={visualLevel} onChange={setVisualLevel} />
      </div>
    </section>
  );
}

function EnvButton({
  active,
  onClick,
  icon: Icon,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  title: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition active:scale-[0.98] ${
        active
          ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
          : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
      }`}
    >
      <Icon size={20} />
      <div className="text-sm font-bold leading-none">{title}</div>
      <div className={`text-[10px] ${active ? "text-slate-900/80" : "text-slate-500"}`}>
        {sub}
      </div>
    </button>
  );
}

function SliderRow({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: any;
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-slate-300">
          <Icon size={14} className="text-cyan-400" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-xs font-mono text-cyan-400 font-semibold">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${value}%, rgb(30 41 59) ${value}%, rgb(30 41 59) 100%)`,
        }}
      />
    </div>
  );
}

export function CalibrationPanel() {
  const { activeNodes, runTest } = useBelt();
  return (
    <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Belt Calibration
        </h2>
        <span className="text-[10px] text-slate-500">Top-down view</span>
      </div>

      <div className="relative rounded-xl bg-slate-950/60 border border-slate-800 p-6 mb-4">
        <div className="relative h-40 mx-auto max-w-[300px]">
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-16 rounded-full border-2 border-dashed border-slate-700" />
          <NodeDot pos="top-2 left-6" label="FL" active={activeNodes.includes("FL")} />
          <NodeDot pos="top-2 right-6" label="FR" active={activeNodes.includes("FR")} />
          <NodeDot pos="top-1/2 -translate-y-1/2 left-0" label="ML" active={activeNodes.includes("ML")} />
          <NodeDot pos="top-1/2 -translate-y-1/2 right-0" label="MR" active={activeNodes.includes("MR")} />
          <NodeDot pos="bottom-2 left-6" label="RL" active={activeNodes.includes("RL")} />
          <NodeDot pos="bottom-2 right-6" label="RR" active={activeNodes.includes("RR")} />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Front
          </div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Rear
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <TestBtn label="Test Left" onClick={() => runTest("left")} />
        <TestBtn label="Test Right" onClick={() => runTest("right")} />
        <TestBtn label="Test Rear" onClick={() => runTest("rear")} />
      </div>
    </section>
  );
}

function NodeDot({ pos, label, active }: { pos: string; label: string; active: boolean }) {
  return (
    <div className={`absolute ${pos} flex flex-col items-center gap-1`}>
      <div
        className={`h-10 w-10 rounded-full border-2 grid place-items-center transition-all duration-200 ${
          active
            ? "bg-cyan-500 border-cyan-300 shadow-lg shadow-cyan-500/50 scale-110"
            : "bg-slate-800 border-slate-700"
        }`}
      >
        <div className={`h-2 w-2 rounded-full ${active ? "bg-white" : "bg-slate-600"}`} />
      </div>
      <span className="text-[9px] font-mono text-slate-500">{label}</span>
    </div>
  );
}

function TestBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 active:scale-95 transition"
    >
      {label}
    </button>
  );
}

export function HazardLogCard() {
  const { hazardLogs, isConnected } = useBelt();
  return (
    <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Real-time Hazard Log
        </h2>
        <span className="text-[10px] text-slate-500">{hazardLogs.length}/4</span>
      </div>

      {hazardLogs.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-sm">
          <AlertTriangle size={28} className="mx-auto mb-2 opacity-40" />
          {isConnected
            ? "No hazards detected. All clear."
            : "Connect your belt to start monitoring."}
        </div>
      ) : (
        <ul className="space-y-2">
          {hazardLogs.map((h) => {
            const Icon = h.kind === "audio" ? Bell : Car;
            const isHigh = h.severity === "high";
            return (
              <li
                key={h.id}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  isHigh
                    ? "bg-rose-500/10 border-rose-500/30"
                    : "bg-slate-800/40 border-slate-800"
                }`}
              >
                <div
                  className={`h-10 w-10 grid place-items-center rounded-lg shrink-0 ${
                    isHigh ? "bg-rose-500/20 text-rose-500" : "bg-slate-700/50 text-cyan-400"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-100">{h.type}</span>
                    {isHigh && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500 text-white">
                        High
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">{h.direction}</div>
                </div>
                <div className="text-xs font-mono text-slate-500">{h.time}</div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
