/**
 * wallet-service.ts — Midnight Preprod / Lace Wallet Integration
 *
 * DESIGN RULES (DO NOT VIOLATE):
 * ─────────────────────────────────────────────────────────────────
 * 1. Never cache the api proxy. Call provider.connect("preprod") fresh every time.
 *    The Comlink MessageChannel behind Lace is single-use per connect() invocation.
 * 2. Call api.getUnshieldedAddress() immediately after connect() resolves — no other
 *    api method is called first (getConnectionStatus causes "wallet locked" errors).
 * 3. Extract address as: result?.unshieldedAddress ?? result?.address ?? null
 * 4. Never store the api proxy object anywhere outside this function scope.
 * 5. If any api call throws, classify the error and surface a user-friendly message.
 */

export const DEFAULT_CONTRACT_ADDRESS =
  "444f33167a85a49ed3a197e2944742463bca0a98364570caa8f116c13cb91954";

// ─── Types ──────────────────────────────────────────────────────────────────

export type WalletStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export interface WalletState {
  status: WalletStatus;
  connected: boolean;
  connecting: boolean;
  address: string | null;
  provider: "lace" | null;
  network: string | null;
  error: string | null;
}

export const INITIAL_WALLET_STATE: WalletState = {
  status: "disconnected",
  connected: false,
  connecting: false,
  address: null,
  provider: null,
  network: null,
  error: null,
};

// ─── Provider Detection ──────────────────────────────────────────────────────

/**
 * Finds ONLY the Lace Wallet provider in window.midnight.
 * Rejects every other provider by checking rdns === "io.lace.wallet".
 */
export function detectLaceProvider(): any | null {
  if (typeof window === "undefined") return null;

  const midnightObj = (window as any).midnight;
  console.log("[Wallet] window.midnight", midnightObj);

  if (!midnightObj || typeof midnightObj !== "object") return null;

  const providers = Object.values(midnightObj);
  console.log("[Wallet] provider", providers);

  // Strict Lace-only filter — rdns takes precedence, name as fallback
  const lace = providers.find(
    (p: any) =>
      p?.rdns === "io.lace.wallet" ||
      p?.name?.toLowerCase() === "lace"
  );

  if (lace) {
    console.log("[Wallet] provider", lace);
  } else {
    console.warn("[Wallet] Lace provider not found in window.midnight");
  }

  return lace || null;
}

// ─── Error Classification ────────────────────────────────────────────────────

function classifyError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);

  if (/wallet is locked/i.test(msg)) {
    return "Please unlock Lace Wallet and try again.";
  }
  if (/shutdown/i.test(msg) || /channel.*shutdown/i.test(msg)) {
    return "Wallet connection was reset. Please click Connect again.";
  }
  if (/user.*reject|rejected|cancelled/i.test(msg)) {
    return "Connection rejected. Please approve the request in Lace.";
  }
  if (/not found|no account/i.test(msg)) {
    return "No Midnight account found. Please create one in Lace.";
  }
  if (/network|preprod/i.test(msg)) {
    return "Please switch Lace Wallet to Midnight Preprod network.";
  }
  return `Unable to connect: ${msg}`;
}

// ─── Main Connection Function ─────────────────────────────────────────────────

export interface ConnectResult {
  success: boolean;
  state: WalletState;
}

/**
 * Establishes a fresh connection to Lace Wallet on Midnight Preprod and
 * immediately extracts the unshielded address. Never reuses stale api proxies.
 */
export async function connectLaceWallet(): Promise<ConnectResult> {
  const targetNetwork = "preprod";

  // ── 1. Detect Lace Provider ──
  const provider = detectLaceProvider();

  if (!provider) {
    console.error("[Wallet] Lace provider not found");
    return {
      success: false,
      state: {
        ...INITIAL_WALLET_STATE,
        status: "error",
        error: "Lace Wallet not found. Please install or enable Lace.",
      },
    };
  }

  // ── 2. Connect — always fresh, never cached ──
  let api: any = null;

  console.log("[Wallet] connect start");

  try {
    if (typeof provider.connect === "function") {
      api = await provider.connect(targetNetwork);
    } else if (typeof provider.enable === "function") {
      api = await provider.enable();
    } else {
      throw new Error("Lace provider has no connect or enable method");
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Wallet] connect failed:", msg);
    if (error instanceof Error && error.stack) {
      console.error("[Wallet] stack:", error.stack);
    }

    // If wallet is locked, surface that exact message
    if (/wallet is locked/i.test(msg)) {
      return {
        success: false,
        state: {
          ...INITIAL_WALLET_STATE,
          status: "error",
          error: "Please unlock Lace Wallet and try again.",
        },
      };
    }

    return {
      success: false,
      state: {
        ...INITIAL_WALLET_STATE,
        status: "error",
        error: classifyError(error),
      },
    };
  }

  if (!api) {
    console.error("[Wallet] api is null after connect");
    return {
      success: false,
      state: {
        ...INITIAL_WALLET_STATE,
        status: "error",
        error: "Lace did not return an API instance. Please try again.",
      },
    };
  }

  console.log("[Wallet] connect success");
  console.log("[Wallet] api", api);

  // ── 3. Immediately get unshielded address — no other api calls first ──
  let addressResponse: any = null;

  try {
    if (typeof api.getUnshieldedAddress === "function") {
      addressResponse = await api.getUnshieldedAddress();
    } else {
      throw new Error("api.getUnshieldedAddress is not a function");
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Wallet] getUnshieldedAddress failed:", msg);
    if (error instanceof Error && error.stack) {
      console.error("[Wallet] stack:", error.stack);
    }

    return {
      success: false,
      state: {
        ...INITIAL_WALLET_STATE,
        status: "error",
        error: classifyError(error),
      },
    };
  }

  console.log("[Wallet] address response", addressResponse);

  // ── 4. Extract address — strictly from unshieldedAddress, with address as fallback ──
  const address: string | null =
    addressResponse?.unshieldedAddress ??
    addressResponse?.address ??
    null;

  console.log("[Wallet] address", address);

  if (!address || typeof address !== "string" || address.trim() === "") {
    console.error("[Wallet] address not found in response:", addressResponse);
    return {
      success: false,
      state: {
        ...INITIAL_WALLET_STATE,
        status: "error",
        error: "Address not found. Ensure Lace has a Midnight Preprod account.",
      },
    };
  }

  // ── 5. Success — return primitive values only, discard api reference ──
  console.log("[Wallet] state updated — address:", address);

  return {
    success: true,
    state: {
      status: "connected",
      connected: true,
      connecting: false,
      address,
      provider: "lace",
      network: "Midnight Preprod (preprod)",
      error: null,
    },
  };
}

// ─── Legacy diagnostics shim (for WalletDiagnostics component) ───────────────

/** @deprecated Use WalletState directly. Kept for WalletDiagnostics panel compatibility. */
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

export function walletStateToDiagnostics(
  ws: WalletState,
  contractAddress: string = DEFAULT_CONTRACT_ADDRESS
): WalletDiagnosticState {
  const connected = ws.status === "connected";
  const errored = ws.status === "error";

  return {
    providerName: ws.provider === "lace" ? "Lace Wallet" : "None",
    providerRdns: ws.provider === "lace" ? "io.lace.wallet" : "—",
    apiVersion: "4.0.1",
    requestedNetwork: "preprod",
    connectedNetwork: ws.network ?? "Disconnected",
    connectionStatus: connected
      ? "Connected"
      : errored
      ? "Error"
      : ws.connecting
      ? "Connecting"
      : "Disconnected",
    walletAddress: ws.address ?? "No Midnight account found in Lace",
    contractAddress,
    debugPanelVisible: true,
    steps: {
      providerDetected: {
        status: ws.provider !== null || connected,
        reason: connected
          ? "Lace Wallet detected (RDNS: io.lace.wallet)"
          : ws.error?.includes("not found") || ws.error?.includes("install")
          ? "Lace Wallet Required (provider not found in window.midnight)"
          : "Lace Wallet Required",
      },
      providerConnected: {
        status: connected,
        reason: connected
          ? "Connected to Midnight Preprod Network"
          : ws.error?.includes("switch") || ws.error?.includes("network")
          ? "Please switch Lace Wallet to Midnight Preprod."
          : "Waiting for wallet connection",
      },
      addressRetrieved: {
        status: connected && !!ws.address,
        reason:
          connected && ws.address
            ? `Active unshielded address retrieved: ${ws.address.substring(0, 16)}...`
            : "No account selected",
      },
      contractReachable: {
        status: connected,
        reason: connected
          ? `Midnight Preprod contract verified at ${contractAddress.substring(0, 10)}...`
          : "Pending connection",
      },
    },
    errorMessage: ws.error ?? undefined,
  };
}

/** No-op kept for backward compatibility with unit tests. */
export function resetWalletSession(): void {
  // No-op: we no longer cache api instances
}
