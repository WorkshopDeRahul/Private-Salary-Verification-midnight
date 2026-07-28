import React, { useState } from "react";
import { Link, useRouter } from "../router";
import { Shield, Lock, Wallet, CheckCircle, Menu, X, ChevronRight, Activity } from "lucide-react";

interface NavbarProps {
  walletConnected: boolean;
  walletAddress: string;
  onConnectWallet: () => void;
  networkName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  walletConnected,
  walletAddress,
  onConnectWallet,
  networkName,
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

            {/* Lace Wallet Button */}
            <button
              onClick={onConnectWallet}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                walletConnected
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                  : "bg-gradient-to-r from-[#6D5DF6] via-purple-600 to-indigo-600 text-white hover:opacity-95 shadow-purple-500/20"
              }`}
            >
              {walletConnected ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-800">Lace Connected:</span>
                  <span className="font-mono text-emerald-700">
                    {walletAddress.length > 20
                      ? `${walletAddress.substring(0, 14)}...${walletAddress.substring(walletAddress.length - 6)}`
                      : walletAddress}
                  </span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 text-purple-100" />
                  <span>Connect Lace Wallet</span>
                </>
              )}
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
              onClick={onConnectWallet}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold ${
                walletConnected
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-700"
                  : "bg-gradient-to-r from-[#6D5DF6] to-purple-600 text-white"
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>{walletConnected ? "Wallet Connected" : "Connect Lace Wallet"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
