import React from "react";
import { WalletDiagnosticState } from "../wallet-service";
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Terminal, Server, Cpu, Key } from "lucide-react";

interface WalletDiagnosticsProps {
  diagnostics: WalletDiagnosticState;
  onRefreshDiagnostics: () => void;
}

export const WalletDiagnostics: React.FC<WalletDiagnosticsProps> = ({
  diagnostics,
  onRefreshDiagnostics,
}) => {
  const stepsList = [
    {
      key: "providerDetected",
      label: "1. Provider Detected",
      data: diagnostics.steps.providerDetected,
    },
    {
      key: "providerConnected",
      label: "2. Provider Connected",
      data: diagnostics.steps.providerConnected,
    },
    {
      key: "addressRetrieved",
      label: "3. Address Retrieved",
      data: diagnostics.steps.addressRetrieved,
    },
    {
      key: "contractReachable",
      label: "4. Contract Reachable",
      data: diagnostics.steps.contractReachable,
    },
  ];

  return (
    <div className="rounded-2xl bg-slate-900 text-slate-100 p-6 border border-slate-800 shadow-xl space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
              Lace Wallet Diagnostics Panel
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-semibold border border-purple-500/30">
                Midnight Preprod
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Real-time integration status & protocol handshake validation.
            </p>
          </div>
        </div>

        <button
          onClick={onRefreshDiagnostics}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-purple-300 border border-slate-700 transition-colors"
        >
          Re-run Diagnostics
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
          <span className="text-slate-400 text-[10px] block uppercase">Provider Name</span>
          <span className="text-purple-300 font-bold">{diagnostics.providerName}</span>
        </div>
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
          <span className="text-slate-400 text-[10px] block uppercase">Provider RDNS</span>
          <span className="text-emerald-400 font-bold break-all">{diagnostics.providerRdns}</span>
        </div>
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
          <span className="text-slate-400 text-[10px] block uppercase">Wallet Connected</span>
          <span className={`font-bold ${diagnostics.connectionStatus === "Connected" ? "text-emerald-400" : "text-rose-400"}`}>
            {diagnostics.connectionStatus === "Connected" ? "YES (Connected)" : "NO (Disconnected)"}
          </span>
        </div>
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
          <span className="text-slate-400 text-[10px] block uppercase">API Version</span>
          <span className="text-blue-300 font-bold">{diagnostics.apiVersion}</span>
        </div>
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1">
          <span className="text-slate-400 text-[10px] block uppercase">Target Network</span>
          <span className="text-amber-300 font-bold">{diagnostics.requestedNetwork}</span>
        </div>
      </div>

      {/* Network & Address Technical Fields */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-purple-400" />
            Connected Network:
          </span>
          <span className="text-emerald-400 font-bold">{diagnostics.connectedNetwork}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-purple-400" />
            Wallet Address:
          </span>
          <span className="text-slate-200 font-bold break-all">{diagnostics.walletAddress}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            Contract Address:
          </span>
          <span className="text-purple-300 font-bold break-all">{diagnostics.contractAddress}</span>
        </div>
      </div>

      {/* 4-Step Validation Checklist */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          Protocol Verification Checklist
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stepsList.map((step) => (
            <div
              key={step.key}
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 transition-colors ${
                step.data.status
                  ? "bg-emerald-950/20 border-emerald-800/50 text-emerald-300"
                  : "bg-rose-950/20 border-rose-800/50 text-rose-300"
              }`}
            >
              {step.data.status ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 font-mono">
                <span className="font-bold block">{step.label}</span>
                <span className="text-[11px] opacity-90 block">{step.data.reason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error / Warning Alert Banner */}
      {diagnostics.errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-rose-300 block">Diagnostic Warning</span>
            <p className="leading-relaxed">{diagnostics.errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};
