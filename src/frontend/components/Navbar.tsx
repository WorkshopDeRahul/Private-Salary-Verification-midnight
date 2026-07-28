import React, { useState } from "react";
import { Link, useRouter } from "../router";
import { Shield, Lock, Wallet, CheckCircle, Loader2, AlertCircle, Menu, X, ChevronRight, Activity } from "lucide-react";

interface NavbarProps {
  walletConnected: boolean;
  walletAddress: string;
  onConnectWallet: () => void;
  networkName: string;
  walletConnecting?: boolean;
  walletError?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  walletConnected,
  walletAddress,
  onConnectWallet,
  networkName,
  walletConnecting = false,
  walletError = null,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentPath } = useRouter();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/verify", label: "Verification" },
    { path: "/credentials", label: "Credential Vault" },
    { path: "/history", label: "History" },
    { path: "/privacy", label: "Privacy" },
    { path: "/about", label: "About" },
  ];

  // ── Button styles & content by state ────────────────────────────

  const buttonClass = (() => {
    if (walletConnected)
      return "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 cursor-default";
    if (walletConnecting)
      return "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm bg-slate-100 border border-slate-300 text-slate-500 cursor-not-allowed";
    if (walletError)
      return "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100";
    return "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm bg-gradient-to-r from-[#6D5DF6] via-purple-600 to-indigo-600 text-white hover:opacity-95 shadow-purple-500/20";
  })();

  const buttonContent = (() => {
    // STATE 3 — CONNECTED
    if (walletConnected) {
      const short =
        walletAddress.length > 20
          ? `${walletAddress.substring(0, 14)}...${walletAddress.substring(walletAddress.length - 6)}`
          : walletAddress;
      return (
        <>
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold text-emerald-800">Lace Connected:</span>
          <span className="font-mono text-emerald-700">{short}</span>
        </>
      );
    }

    // STATE 2 — CONNECTING
    if (walletConnecting) {
      return (
        <>
          <Loader2 className="w-4 h-4 text-slate-500 animate-spin shrink-0" />
          <span>Connecting...</span>
        </>
      );
    }

    // STATE 4 — ERROR
    if (walletError) {
      return (
        <>
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>Retry Connection</span>
        </>
      );
    }

    // STATE 1 — DISCONNECTED
    return (
      <>
        <Wallet className="w-4 h-4 text-purple-100 shrink-0" />
        <span>Connect Lace Wallet</span>
      </>
    );
  })();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6D5DF6] via-purple-600 to-indigo-600 p-0.5 shadow-md shadow-purple-500/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#6D5DF6]" />
              </div>
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                Private Salary
              </span>
              <div className="flex items-center gap-1 text-[10px] text-purple-700 font-mono font-semibold">
                <Lock className="w-2.5 h-2.5 text-[#6D5DF6]" />
                <span>MIDNIGHT ZK PLATFORM</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-purple-50 text-[#6D5DF6] border border-purple-200/60 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side: Network Status & Connect Wallet */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Network Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-xs font-mono text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">{networkName}</span>
            </div>

            {/* Wallet Button — all 4 states */}
            <button
              id="connect-wallet-btn"
              onClick={walletConnected || walletConnecting ? undefined : onConnectWallet}
              disabled={walletConnecting}
              className={buttonClass}
            >
              {buttonContent}
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Error bar — shown when there's a wallet error */}
      {walletError && !walletConnected && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 flex items-center gap-2 text-xs text-rose-700 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{walletError}</span>
        </div>
      )}

      {/* Connected address bar — shown when connected */}
      {walletConnected && walletAddress && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-1.5 flex items-center gap-2 text-xs text-emerald-700 font-mono">
          <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span className="font-semibold">Connected to Lace Wallet</span>
          <span className="mx-1 text-emerald-400">·</span>
          <span>Address:</span>
          <span className="font-bold">{walletAddress}</span>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl shadow-lg">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive
                    ? "bg-purple-50 text-[#6D5DF6] border border-purple-200"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-mono">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                Network:
              </span>
              <span className="text-emerald-700 font-bold">{networkName}</span>
            </div>

            <button
              onClick={walletConnected || walletConnecting ? undefined : onConnectWallet}
              disabled={walletConnecting}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold ${
                walletConnected
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-700"
                  : walletConnecting
                  ? "bg-slate-100 border border-slate-300 text-slate-500"
                  : "bg-gradient-to-r from-[#6D5DF6] to-purple-600 text-white"
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>
                {walletConnected
                  ? "Wallet Connected"
                  : walletConnecting
                  ? "Connecting..."
                  : "Connect Lace Wallet"}
              </span>
            </button>

            {/* Mobile error */}
            {walletError && !walletConnected && (
              <p className="text-xs text-rose-600 px-1 font-medium">{walletError}</p>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
