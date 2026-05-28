import { Cpu } from "lucide-react";
import { useBelt } from "@/context/BeltContext";

export function ConnectButton() {
  const { isConnected, connectedDeviceName, openScan, disconnect } = useBelt();

  if (!isConnected) {
    return (
      <button
        onClick={openScan}
        className="flex items-center gap-2 h-10 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm active:scale-95 transition shadow-lg shadow-cyan-500/20"
      >
        <Cpu size={16} />
        <span className="hidden sm:inline">Connect Belt</span>
        <span className="sm:hidden">Connect</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 h-10 px-3 rounded-full bg-slate-900 border border-slate-800">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
        </span>
        <span className="text-xs font-medium text-slate-200 max-w-[140px] truncate">
          {connectedDeviceName}
        </span>
      </div>
      <button
        onClick={disconnect}
        className="hidden sm:inline text-xs font-semibold text-rose-500 hover:text-rose-400 px-2 h-10"
      >
        Disconnect
      </button>
    </div>
  );
}
