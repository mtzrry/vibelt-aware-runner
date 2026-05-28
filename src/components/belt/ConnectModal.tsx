import { Bluetooth, X, Zap } from "lucide-react";
import { useBelt } from "@/context/BeltContext";

const MOCK_DEVICES = [
  { id: "1", name: "Vibelt Pro-Belt v5", rssi: -42 },
  { id: "2", name: "Vibelt Band Lite", rssi: -67 },
  { id: "3", name: "Vibelt Runner X2", rssi: -78 },
];

export function ConnectModal() {
  const { showConnectModal, isScanning, closeModal, rescan, connectTo } = useBelt();
  if (!showConnectModal) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/80 backdrop-blur-sm p-4"
      onClick={closeModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-100">Pair Vibelt</h3>
          <button
            onClick={closeModal}
            className="h-9 w-9 grid place-items-center rounded-lg hover:bg-slate-800 text-slate-400"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {isScanning ? (
          <div className="py-10 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
              <div className="relative h-16 w-16 rounded-full bg-cyan-500/10 border border-cyan-500/40 grid place-items-center">
                <Bluetooth
                  size={28}
                  className="text-cyan-400 animate-spin"
                  style={{ animationDuration: "2s" }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-300 font-medium">
              Scanning for nearby Vibelt devices…
            </p>
            <p className="text-xs text-slate-500 mt-1">Make sure your belt is powered on.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-slate-400 mb-2">Available devices</p>
            {MOCK_DEVICES.map((d) => (
              <button
                key={d.id}
                onClick={() => connectTo(d.name)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 transition text-left"
              >
                <div className="h-10 w-10 grid place-items-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Bluetooth size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-100">{d.name}</div>
                  <div className="text-xs text-slate-500">Signal {d.rssi} dBm</div>
                </div>
                <Zap size={16} className="text-slate-500" />
              </button>
            ))}
            <button
              onClick={rescan}
              className="w-full mt-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 py-2"
            >
              Rescan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
