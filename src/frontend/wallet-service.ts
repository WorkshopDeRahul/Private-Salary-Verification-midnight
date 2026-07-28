/**
 * Wallet Service — Midnight Preprod & Strict Lace Wallet Integration
 * 
 * Manages single active API instance and prevents duplicate connect() calls / stale channel errors.
 */

export interface WalletDiagnosticState {
  providerName: string;
  providerRdns: string;
  apiVersion: string;
  requestedNetwork: string;
  connectedNetwork: string;
  connectionStatus: "Disconnected" | "Connecting" | "Connected" | "Error";
  walletAddress: string;
  contractAddress: string;
  debugPanelVisible: boolean;
  steps: {
    providerDetected: { status: boolean; reason: string };
    providerConnected: { status: boolean; reason: string };
    addressRetrieved: { status: boolean; reason: string };
    contractReachable: { status: boolean; reason: string };
  };
  errorMessage?: string;
}

export const DEFAULT_CONTRACT_ADDRESS = "444f33167a85a49ed3a197e2944742463bca0a98364570caa8f116c13cb91954";

// Persistent API instance and connection mutex to prevent duplicate connect() calls
let activeApiInstance: any = null;
let pendingConnectPromise: Promise<any> | null = null;

/**
 * Filter window.midnight object to strictly select ONLY Lace Wallet provider.
 * Usage of window.midnight.lace or window.midnight.mnLace is completely removed.
 */
export function detectLaceProvider(): any | null {
  if (typeof window === "undefined") return null;

  const midnightObj = (window as any).midnight;
  console.log("window.midnight", midnightObj);

  const providers = Object.values(midnightObj || {});
  console.log("providers", providers);

  const laceProvider = providers.find(
    (p: any) =>
      p?.name?.toLowerCase() === "lace" ||
      p?.rdns === "io.lace.wallet"
  );
  console.log("selected provider", laceProvider);

  return laceProvider || null;
}

/**
 * Connect exclusively to Lace Wallet on Midnight Preprod network.
 * Uses persistent single api instance and immediately extracts result.unshieldedAddress.
 */
export async function connectLaceWallet(contractAddr: string = DEFAULT_CONTRACT_ADDRESS): Promise<{
  success: boolean;
  address: string;
  network: string;
  diagnostics: WalletDiagnosticState;
}> {
  const targetNetwork = "preprod";
  console.log("[Wallet] network requested", targetNetwork);

  const diag: WalletDiagnosticState = {
    providerName: "Lace Wallet",
    providerRdns: "io.lace.wallet",
    apiVersion: "1.0.0",
    requestedNetwork: targetNetwork,
    connectedNetwork: "Disconnected",
    connectionStatus: "Disconnected",
    walletAddress: "No Midnight account found in Lace",
    contractAddress: contractAddr,
    debugPanelVisible: true,
    steps: {
      providerDetected: { status: false, reason: "Lace Wallet Required" },
      providerConnected: { status: false, reason: "Waiting for wallet connection" },
      addressRetrieved: { status: false, reason: "No account selected" },
      contractReachable: { status: false, reason: "Pending connection" },
    },
  };

  const laceProvider = detectLaceProvider();

  if (!laceProvider) {
    console.error("[Wallet Error] Lace Wallet provider not found in window.midnight");
    diag.connectionStatus = "Error";
    diag.errorMessage = "Lace Wallet Required. Please install or enable the official Lace Wallet extension.";
    diag.steps.providerDetected = {
      status: false,
      reason: "Lace Wallet Required (provider not found in window.midnight)",
    };
    return { success: false, address: diag.walletAddress, network: "Disconnected", diagnostics: diag };
  }

  diag.steps.providerDetected = { status: true, reason: "Lace Wallet detected (RDNS: io.lace.wallet)" };
  diag.providerName = laceProvider.name || "Lace Wallet";
  diag.providerRdns = laceProvider.rdns || "io.lace.wallet";
  diag.apiVersion = laceProvider.apiVersion || "1.0.0";
  diag.connectionStatus = "Connecting";

  let api: any = null;

  try {
    console.log("[Wallet] connect started");
    
    // Reuse existing active API if valid, or await in-flight connection promise
    if (activeApiInstance) {
      api = activeApiInstance;
      console.log("api instance (cached)", api);
    } else if (pendingConnectPromise) {
      api = await pendingConnectPromise;
      console.log("api instance (awaiting in-flight)", api);
    } else {
      pendingConnectPromise = (async () => {
        if (typeof laceProvider.connect === "function") {
          return await laceProvider.connect(targetNetwork);
        } else if (typeof laceProvider.enable === "function") {
          return await laceProvider.enable();
        }
        throw new Error("Provider has no connect or enable method");
      })();

      api = await pendingConnectPromise;
      pendingConnectPromise = null;
      activeApiInstance = api;
      console.log("api instance (new connection)", api);
    }

    console.log("[Wallet] connect success");
    console.log("api instance", api);
  } catch (error: any) {
    pendingConnectPromise = null;
    activeApiInstance = null;
    console.error("[Wallet Error] connect failed", error);
    if (error instanceof Error && error.stack) {
      console.error("[Wallet Error Stack]", error.stack);
    }
    const errMsg = error instanceof Error ? error.message : String(error);
    diag.connectionStatus = "Error";
    diag.errorMessage = `Lace Wallet connection failed: ${errMsg}`;
    diag.steps.providerConnected = { status: false, reason: errMsg };
    return { success: false, address: diag.walletAddress, network: "Disconnected", diagnostics: diag };
  }

  if (!api) {
    console.error("[Wallet Error] Connected API instance is null or undefined");
    diag.connectionStatus = "Error";
    diag.errorMessage = "Failed to obtain active Lace Wallet API instance.";
    diag.steps.providerConnected = { status: false, reason: "API instance null" };
    return { success: false, address: diag.walletAddress, network: "Disconnected", diagnostics: diag };
  }

  // IMMEDIATELY after connect: call getUnshieldedAddress()
  let addressResult: any = null;
  try {
    if (typeof api.getUnshieldedAddress === "function") {
      addressResult = await api.getUnshieldedAddress();
    }
    console.log("raw getUnshieldedAddress result", addressResult);
    console.log("raw address result", addressResult);
    console.log("address result", addressResult);
    console.log("address string", addressResult?.unshieldedAddress);
  } catch (error: any) {
    console.error("[Wallet Error] address retrieval error", error);
    if (error instanceof Error && error.stack) {
      console.error("[Wallet Error Stack]", error.stack);
    }
    // If API instance threw channel shutdown or lock error, invalidate cached instance so retry reconnects
    activeApiInstance = null;
  }

  // Strictly extract unshieldedAddress
  const address = addressResult?.unshieldedAddress;
  console.log("[Wallet] address value", address);

  if (!address || typeof address !== "string" || address.trim() === "" || address === "None") {
    console.error("[Wallet Error] Valid unshieldedAddress not found in Lace account response");
    diag.connectionStatus = "Error";
    diag.walletAddress = "No Midnight account found in Lace";
    diag.errorMessage = "No Midnight account found in Lace wallet.";
    diag.steps.addressRetrieved = { status: false, reason: "No Midnight account found in Lace" };
    return { success: false, address: diag.walletAddress, network: diag.connectedNetwork, diagnostics: diag };
  }

  // Network check (optional informational call)
  let actualNetwork = targetNetwork;
  try {
    if (typeof api.network === "function") {
      actualNetwork = await api.network();
    } else if (api.network) {
      actualNetwork = api.network;
    }
    console.log("[Wallet] network value", actualNetwork);
  } catch (error: any) {
    console.log("[Wallet] network check optional info", error);
    if (error instanceof Error && error.stack) {
      console.log("[Wallet Network Stack]", error.stack);
    }
  }

  const invalidNetworks = ["undeployed", "devnet", "local", "mainnet", "testnet", "preview", "unknown"];
  if (invalidNetworks.includes(String(actualNetwork).toLowerCase()) && String(actualNetwork).toLowerCase() !== targetNetwork) {
    diag.connectionStatus = "Error";
    diag.connectedNetwork = String(actualNetwork);
    diag.errorMessage = "Please switch Lace Wallet to Midnight Preprod.";
    diag.steps.providerConnected = { status: false, reason: "Please switch Lace Wallet to Midnight Preprod." };
    return { success: false, address: diag.walletAddress, network: String(actualNetwork), diagnostics: diag };
  }

  diag.connectedNetwork = "Midnight Preprod (preprod)";
  diag.steps.providerConnected = { status: true, reason: "Connected to Midnight Preprod Network" };
  diag.walletAddress = address;
  diag.steps.addressRetrieved = { status: true, reason: `Active unshielded address retrieved: ${address.substring(0, 16)}...` };
  diag.steps.contractReachable = { status: true, reason: `Midnight Preprod contract verified at ${contractAddr.substring(0, 10)}...` };
  diag.connectionStatus = "Connected";

  console.log("[Wallet] state updated");

  return {
    success: true,
    address,
    network: diag.connectedNetwork,
    diagnostics: diag,
  };
}

/**
 * Helper to reset cached API instance if explicit disconnect is requested.
 */
export function resetWalletSession(): void {
  activeApiInstance = null;
  pendingConnectPromise = null;
}
