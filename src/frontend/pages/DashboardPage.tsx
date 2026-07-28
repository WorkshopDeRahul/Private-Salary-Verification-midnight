import React from "react";
import { StatCard } from "../components/StatCard";
import { WalletDiagnostics } from "../components/WalletDiagnostics";
import { WalletDiagnosticState } from "../wallet-service";
import { Link } from "../router";
import { ShieldCheck, CheckCircle2, Award, Activity, ArrowRight, Cpu, FileText } from "lucide-react";

interface DashboardPageProps {
  verificationCount: number;
  contractAddress: string;
  networkName: string;
  diagnostics?: WalletDiagnosticState;
  onRefreshDiagnostics?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  verificationCount,
  contractAddress,
  networkName,
  diagnostics,
  onRefreshDiagnostics,
}) => {
  const recentActivities = [
    {
      id: "act-1",
      title: "Mortgage Threshold Verification",
      threshold: "$85,000",
      time: "10 mins ago",
      status: "PASSED",
      hash: "0xa8f116c13cb91954...",
    },
    {
      id: "act-2",
      title: "Lease Application Verification",
      threshold: "$75,000",
      time: "2 hours ago",
      status: "PASSED",
      hash: "0x3bca0a98364570ca...",
    },
    {
      id: "act-3",
      title: "Auto Loan Approval Check",
      threshold: "$60,000",
      time: "1 day ago",
      status: "PASSED",
      hash: "0x944742463bca0a98...",
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-[#6D5DF6] uppercase tracking-wider">
            User Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            System Dashboard
          </h1>
          <p className="text-xs text-slate-600">
            Real-time Zero-Knowledge verification metrics and active credential state.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/verify"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6D5DF6] to-purple-600 text-white font-bold text-xs hover:opacity-95 shadow-sm transition-all"
          >
            Start Verification
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Verifications"
          value={verificationCount}
          icon={<ShieldCheck className="w-5 h-5 text-[#6D5DF6]" />}
          subtitle="On-chain ledger executions"
          badge="Active"
          badgeType="info"
        />
        <StatCard
          title="Verification Success"
          value="100%"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          subtitle="Zero failed constraints"
          badge="Verified"
          badgeType="success"
        />
        <StatCard
          title="Active Credentials"
          value="3"
          icon={<Award className="w-5 h-5 text-purple-600" />}
          subtitle="Employer-issued vaults"
          badge="Vault"
          badgeType="purple"
        />
        <StatCard
          title="Midnight Network"
          value={networkName}
          icon={<Activity className="w-5 h-5 text-teal-600" />}
          subtitle="Preprod network active"
          badge="Online"
          badgeType="emerald"
        />
      </div>

      {/* Wallet Diagnostics Panel */}
      {diagnostics && onRefreshDiagnostics && (
        <WalletDiagnostics
          diagnostics={diagnostics}
          onRefreshDiagnostics={onRefreshDiagnostics}
        />
      )}

      {/* Contract Info & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Activity Feed */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#6D5DF6]" />
              Recent Verification Activity
            </h3>
            <Link to="/history" className="text-xs text-[#6D5DF6] font-semibold hover:underline">
              View All History →
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{act.title}</h4>
                    <span className="text-slate-500 font-mono">Threshold: {act.threshold}</span>
                  </div>
                </div>

                <div className="text-right space-y-0.5 font-mono">
                  <span className="text-emerald-700 font-bold block">{act.status}</span>
                  <span className="text-[10px] text-slate-400">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Smart Contract Info */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#6D5DF6]" />
              Smart Contract Specs
            </h3>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-mono space-y-2">
              <div>
                <span className="text-slate-500 block text-[10px]">Contract Address</span>
                <span className="text-purple-700 font-bold break-all">{contractAddress}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-600 text-[11px]">
                <span>Target Network:</span>
                <span className="text-emerald-700 font-bold">preprod</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Compiler Engine:</span>
                <span className="text-slate-900 font-bold">Compact 0.31.1</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <Link
              to="/about"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 font-semibold transition-colors border border-slate-200"
            >
              <FileText className="w-4 h-4 text-[#6D5DF6]" />
              Architecture Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

