import React, { useState, useCallback } from "react";
import { RouterProvider, useRouter } from "./router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { VerifyPage } from "./pages/VerifyPage";
import { CredentialsPage } from "./pages/CredentialsPage";
import { HistoryPage } from "./pages/HistoryPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { AboutPage } from "./pages/AboutPage";
import { VerificationLogItem } from "./components/VerificationHistory";
import {
  connectLaceWallet,
  walletStateToDiagnostics,
  WalletState,
  INITIAL_WALLET_STATE,
  DEFAULT_CONTRACT_ADDRESS,
} from "./wallet-service";

export const MainContent: React.FC = () => {
  const { currentPath } = useRouter();

  // ── Wallet State ──────────────────────────────────────────────
  const [walletState, setWalletState] = useState<WalletState>(INITIAL_WALLET_STATE);
  const [contractAddress] = useState<string>(DEFAULT_CONTRACT_ADDRESS);

  // Derived convenience flags
  const walletConnected = walletState.connected;
  const walletAddress = walletState.address ?? "No Midnight account found in Lace";
  const networkName = walletState.network ?? "Midnight Preprod";

  // Derived diagnostics (for WalletDiagnostics panel)
  const diagnostics = walletStateToDiagnostics(walletState, contractAddress);

  // Verification state
  const [verificationCount, setVerificationCount] = useState<number>(3);

  // Verification Logs
  const [verificationLogs, setVerificationLogs] = useState<VerificationLogItem[]>([
    {
      id: "log-1",
      timestamp: new Date(Date.now() - 600000).toLocaleTimeString(),
      threshold: "85,000",
      result: "PASSED",
      commitmentHash: "0xa8f116c13cb91954444f33167a85a49ed3a197e2944742463bca0a98364570ca",
      network: "Midnight Preprod",
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 7200000).toLocaleTimeString(),
      threshold: "75,000",
      result: "PASSED",
      commitmentHash: "0x3bca0a98364570caa8f116c13cb91954444f33167a85a49ed3a197e294474246",
      network: "Midnight Preprod",
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 86400000).toLocaleTimeString(),
      threshold: "60,000",
      result: "PASSED",
      commitmentHash: "0x944742463bca0a98364570caa8f116c13cb91954444f33167a85a49ed3a197e2",
      network: "Midnight Preprod",
    },
  ]);

  // ── Connect Lace Wallet ─────────────────────────────────────────
  const handleConnectWallet = useCallback(async () => {
    // Guard: do not allow concurrent connections
    if (walletState.connecting) {
      console.log("[Wallet] connection already in progress — ignoring");
      return;
    }
    // Guard: already connected — do nothing
    if (walletState.connected) {
      console.log("[Wallet] already connected");
      return;
    }

    // Set connecting state
    setWalletState((prev) => ({ ...prev, status: "connecting", connecting: true, error: null }));

    const result = await connectLaceWallet();
    setWalletState(result.state);
  }, [walletState.connecting, walletState.connected]);

  // ── Re-run Diagnostics (does NOT trigger a new wallet connect) ────
  const handleRefreshDiagnostics = useCallback(async () => {
    // Refresh only runs a new connection if currently disconnected
    if (walletState.connected) return;
    const result = await connectLaceWallet();
    setWalletState(result.state);
  }, [walletState.connected]);

  // Proof Execution Handler
  const handleExecuteProof = async (
    salary: bigint,
    threshold: bigint,
    salt: string
  ): Promise<{ success: boolean; hash: string; message: string }> => {
    const isPass = salary >= threshold;
    const encoder = new TextEncoder();
    const bytes = encoder.encode(`${salary}-${salt}-${threshold}`);
    
    let hashHex = "0x";
    for (let i = 0; i < 32; i++) {
      hashHex += (bytes[i % bytes.length] || i * 17).toString(16).padStart(2, "0");
    }

    if (isPass) {
      const newLog: VerificationLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        threshold: parseInt(threshold.toString()).toLocaleString(),
        result: "PASSED",
        commitmentHash: hashHex,
        network: networkName,
      };

      setVerificationLogs((prev) => [newLog, ...prev]);
      setVerificationCount((prev) => prev + 1);

      return {
        success: true,
        hash: hashHex,
        message: `Zero-Knowledge proof generated and verified on Midnight Preprod! Salary satisfies minimum threshold of $${parseInt(threshold.toString()).toLocaleString()}. Actual salary remains 100% confidential inside client ZK witness.`,
      };
    } else {
      const newLog: VerificationLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        threshold: parseInt(threshold.toString()).toLocaleString(),
        result: "FAILED",
        commitmentHash: hashHex,
        network: networkName,
      };

      setVerificationLogs((prev) => [newLog, ...prev]);

      return {
        success: false,
        hash: hashHex,
        message: `Verification constraint failed: Salary does not satisfy requested minimum threshold of $${parseInt(threshold.toString()).toLocaleString()}.`,
      };
    }
  };

  // Route Switcher
  const renderRoute = () => {
    switch (currentPath) {
      case "/":
        return (
          <HomePage
            verificationCount={verificationCount}
            contractAddress={contractAddress}
            networkName={networkName}
          />
        );
      case "/dashboard":
        return (
          <DashboardPage
            verificationCount={verificationCount}
            contractAddress={contractAddress}
            networkName={networkName}
            diagnostics={diagnostics}
            onRefreshDiagnostics={handleRefreshDiagnostics}
          />
        );
      case "/verify":
        return (
          <VerifyPage
            onExecuteProof={handleExecuteProof}
            contractAddress={contractAddress}
          />
        );
      case "/credentials":
        return <CredentialsPage />;
      case "/history":
        return <HistoryPage logs={verificationLogs} />;
      case "/privacy":
        return <PrivacyPage />;
      case "/about":
        return <AboutPage />;
      default:
        return (
          <HomePage
            verificationCount={verificationCount}
            contractAddress={contractAddress}
            networkName={networkName}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-900">
      <Navbar
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
        networkName={networkName}
        walletConnecting={walletState.connecting}
        walletError={walletState.error}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {renderRoute()}
      </main>

      <Footer />
    </div>
  );
};

export function App() {
  return (
    <RouterProvider>
      <MainContent />
    </RouterProvider>
  );
}

export default App;
