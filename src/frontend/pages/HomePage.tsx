import React from "react";
import { Link } from "../router";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Cpu,
  Building2,
  Home as HomeIcon,
  Landmark,
  Briefcase,
  ShieldAlert,
  Wallet,
  Activity,
  Layers,
  Key,
  FileCheck,
  Sparkles,
  Zap
} from "lucide-react";

interface HomePageProps {
  verificationCount: number;
  contractAddress: string;
  networkName: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  verificationCount,
  contractAddress,
  networkName,
}) => {
  return (
    <div className="space-y-24 py-6">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Badges */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#6D5DF6] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#6D5DF6]" />
                Powered by Midnight Network
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Zero-Knowledge Privacy
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Confidential Credentials
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Verify Income Eligibility{" "}
              <span className="bg-gradient-to-r from-[#6D5DF6] via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Without Revealing Your Salary
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
              Generate Zero-Knowledge proofs on Midnight Network proving income eligibility while keeping your exact earnings, pay stubs, and banking statements completely private.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/verify"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#6D5DF6] via-purple-600 to-indigo-600 text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02]"
              >
                Verify Salary Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all border border-slate-200"
              >
                Learn How It Works
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Diagram Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-5 bg-dot-pattern">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  ZK Proof Pipeline Visualizer
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-bold">
                  ACTIVE CIRCUIT
                </span>
              </div>

              {/* Step 1: Confidential Witness */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#6D5DF6] flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Private Salary</span>
                    <span className="text-[11px] font-mono text-slate-500">$95,000 / year (Masked Witness)</span>
                  </div>
                </div>
                <Lock className="w-4 h-4 text-[#6D5DF6]" />
              </div>

              {/* Arrow Indicator */}
              <div className="flex justify-center -my-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-[#6D5DF6] flex items-center justify-center text-xs">
                  ↓
                </div>
              </div>

              {/* Step 2: Compact Circuit */}
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-purple-900 block">Compact ZK Circuit</span>
                    <span className="text-[11px] font-mono text-purple-700">assert(secretSalary &gt;= $75,000)</span>
                  </div>
                </div>
                <Cpu className="w-4 h-4 text-purple-600" />
              </div>

              {/* Arrow Indicator */}
              <div className="flex justify-center -my-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">
                  ↓
                </div>
              </div>

              {/* Step 3: Public Ledger Result */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-emerald-950 block">On-Chain Ledger State</span>
                    <span className="text-[11px] font-mono text-emerald-700">isVerified = true (Salt 0x444f...)</span>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full bg-purple-50 text-[#6D5DF6] text-xs font-mono font-bold uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How Private Salary Verification Works
          </h2>
          <p className="text-sm text-slate-600">
            Powered by Midnight Compact smart contracts and client-side Zero-Knowledge proving engine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Enter Salary Privately",
              desc: "Employee enters actual earnings and secret salt key locally in browser.",
              icon: <Lock className="w-5 h-5 text-[#6D5DF6]" />,
            },
            {
              step: "02",
              title: "Compact ZK Execution",
              desc: "Circuit privately checks (secretSalary >= threshold) without revealing value.",
              icon: <Cpu className="w-5 h-5 text-purple-600" />,
            },
            {
              step: "03",
              title: "Local Proof Generation",
              desc: "Zero-Knowledge proof constructed client-side on Midnight Proof Server.",
              icon: <Zap className="w-5 h-5 text-indigo-600" />,
            },
            {
              step: "04",
              title: "Public Ledger Commitment",
              desc: "Only verification flag (true) and salt hash commitment posted to chain.",
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-purple-200 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                  {item.icon}
                </div>
                <span className="text-2xl font-black text-slate-300 font-mono">{item.step}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. USE CASES SECTION */}
      <section className="space-y-12 bg-slate-50/80 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 border-y border-slate-200">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold uppercase tracking-wider">
            Real-World Applications
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Modern Financial Services
          </h2>
          <p className="text-sm text-slate-600">
            Eliminate over-sharing in income verification workflows across industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {[
            {
              title: "Apartment Rentals",
              desc: "Landlords verify tenant 3x rent income rule without inspecting personal spending or pay slips.",
              icon: <HomeIcon className="w-6 h-6 text-[#6D5DF6]" />,
            },
            {
              title: "Mortgage Approval",
              desc: "Lenders confirm debt-to-income threshold compliance while keeping bank statements private.",
              icon: <Landmark className="w-6 h-6 text-purple-600" />,
            },
            {
              title: "Banking Verification",
              desc: "Credit card companies and underwriting systems verify income qualification tiers.",
              icon: <Building2 className="w-6 h-6 text-indigo-600" />,
            },
            {
              title: "Employment Screening",
              desc: "Recruiters confirm past salary scale claims without requiring sensitive tax filings.",
              icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
            },
            {
              title: "Insurance Qualification",
              desc: "Premium rate eligibility checks executed in Zero-Knowledge with verified proof tokens.",
              icon: <ShieldCheck className="w-6 h-6 text-teal-600" />,
            },
            {
              title: "Financial Assistance",
              desc: "Grant programs verify need-based income brackets confidentially.",
              icon: <FileCheck className="w-6 h-6 text-[#6D5DF6]" />,
            },
          ].map((uc, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                {uc.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-base">{uc.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRIVACY COMPARISON SECTION */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full bg-purple-50 text-[#6D5DF6] text-xs font-mono font-bold uppercase tracking-wider">
            Why Switch to ZK
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Traditional vs. Private Verification
          </h2>
          <p className="text-sm text-slate-600">
            See how Zero-Knowledge credentials protect applicants from data exposure and identity theft.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional Card */}
          <div className="p-8 rounded-3xl bg-rose-50/50 border border-rose-200 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                ✕
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Traditional Verification</h3>
                <p className="text-xs text-rose-700">Over-sharing & Data Risk</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Upload raw pay slips revealing exact income and deductions</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Hand over full bank account statements showing personal spending</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Expose W-2 tax returns to third-party landlord databases</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>High vulnerability to identity theft and data breach leaks</span>
              </li>
            </ul>
          </div>

          {/* ZK Card */}
          <div className="p-8 rounded-3xl bg-emerald-50/50 border border-emerald-200 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Private Salary Verification</h3>
                <p className="text-xs text-emerald-700">Midnight ZK Privacy</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Prove threshold qualification without disclosing exact salary</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Keep bank account statements and personal spending 100% hidden</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Employer identity & payroll keys remain confidential in ZK witness</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Verifiable on-chain commitment with zero raw document storage</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full bg-purple-50 text-[#6D5DF6] text-xs font-mono font-bold uppercase tracking-wider">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Enterprise Features & Integration
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Zero-Knowledge Proofs",
              desc: "Mathematical proofs guaranteeing truth of statements without exposing private input data.",
              icon: <Lock className="w-5 h-5 text-[#6D5DF6]" />,
            },
            {
              title: "Confidential Credentials",
              desc: "Level 3 category submission supporting verifier issuance and credential vaults.",
              icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
            },
            {
              title: "Midnight Compact Contracts",
              desc: "Smart contracts written in Compact with strict disclose() discipline.",
              icon: <Cpu className="w-5 h-5 text-indigo-600" />,
            },
            {
              title: "Lace Wallet Integration",
              desc: "Direct browser extension wallet state connection via window.midnight.lace.",
              icon: <Wallet className="w-5 h-5 text-emerald-600" />,
            },
            {
              title: "On-Chain Verification",
              desc: "Deterministic verification flags and salt commitments stored on ledger.",
              icon: <Activity className="w-5 h-5 text-teal-600" />,
            },
            {
              title: "Enterprise Privacy",
              desc: "Client-side ZK proof server integration for high-security applications.",
              icon: <Layers className="w-5 h-5 text-[#6D5DF6]" />,
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6D5DF6] flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-base">{f.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. LIVE NETWORK SECTION */}
      <section className="p-8 rounded-3xl bg-slate-900 text-white space-y-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
              Network Telemetry
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-1">Live Preprod Metrics</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPERATIONAL</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px]">CURRENT NETWORK</span>
            <div className="text-lg font-bold text-white font-sans">{networkName}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px]">CONTRACT ADDRESS</span>
            <div className="text-sm font-bold text-indigo-300 truncate">{contractAddress}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px]">VERIFICATION COUNT</span>
            <div className="text-lg font-bold text-white font-sans">{verificationCount} Executions</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px]">PROOF SERVER</span>
            <div className="text-lg font-bold text-emerald-400 font-sans">localhost:6300</div>
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="p-10 rounded-3xl bg-gradient-to-r from-[#6D5DF6] via-purple-600 to-indigo-600 text-white text-center space-y-6 shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          Ready to Verify Income Privately?
        </h2>
        <p className="text-sm text-purple-100 max-w-xl mx-auto leading-relaxed">
          Experience Zero-Knowledge confidential credential proofs on the Midnight Network right now.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/verify"
            className="px-7 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm hover:bg-slate-100 transition-all shadow-md"
          >
            Launch Verification Wizard
          </Link>
          <Link
            to="/privacy"
            className="px-7 py-3.5 rounded-2xl bg-purple-900/40 text-white font-semibold text-sm border border-white/20 hover:bg-purple-900/60 transition-all"
          >
            View Privacy Model
          </Link>
        </div>
      </section>
    </div>
  );
};
