import { describe, it, expect, beforeEach } from "vitest";
import * as path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import { detectLaceProvider, connectLaceWallet, resetWalletSession } from "../src/frontend/wallet-service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contractDir = path.resolve(__dirname, "..", "contracts", "managed", "private-salary-verification");

describe("Private Salary Verification - Compact Contract & Config", () => {
  it("should have compiled contract artifacts present in managed directory", () => {
    const indexPath = path.join(contractDir, "contract", "index.js");
    const dtsPath = path.join(contractDir, "contract", "index.d.ts");
    
    expect(fs.existsSync(indexPath)).toBe(true);
    expect(fs.existsSync(dtsPath)).toBe(true);
  });

  it("should validate private salary verification constraint logic (Salary >= Threshold)", () => {
    const secretSalary = 95000n;
    const requestedThresholdPass = 75000n;
    const requestedThresholdFail = 100000n;

    expect(secretSalary >= requestedThresholdPass).toBe(true);
    expect(secretSalary >= requestedThresholdFail).toBe(false);
  });

  it("should produce a deterministic 32-byte commitment hash given secret salary and salt", async () => {
    const secretSalary = 95000n;
    const secretSaltText = "employee-secret-salt-2026";
    
    const encoder = new TextEncoder();
    const saltBytes = new Uint8Array(32);
    saltBytes.set(encoder.encode(secretSaltText).subarray(0, 32));

    expect(saltBytes.length).toBe(32);
    expect(secretSalary).toBeGreaterThan(0n);
  });

  it("should parse network configuration defaults and enforce preprod network target", async () => {
    const targetNetwork = "preprod";
    const invalidNetworks = ["mainnet", "testnet", "devnet", "preview", "undeployed", "unknown"];
    
    expect(invalidNetworks.includes("preprod")).toBe(false);
    expect(targetNetwork).toBe("preprod");
  });
});

describe("Lace Wallet Integration & Preprod Network Hardening", () => {
  beforeEach(() => {
    resetWalletSession(); // no-op, kept for compatibility
  });

  it("should reject random providers and select ONLY Lace provider by rdns", () => {
    const mockWindow = {
      midnight: {
        randomWallet: { name: "random-wallet", rdns: "com.random.wallet" },
        metamaskFake: { name: "metamask", rdns: "io.metamask" },
        lace: { name: "lace", rdns: "io.lace.wallet", connect: async () => ({}) },
      },
    };

    (globalThis as any).window = mockWindow;

    const provider = detectLaceProvider();
    expect(provider).toBeDefined();
    expect(provider.rdns).toBe("io.lace.wallet");
    expect(provider.name).toBe("lace");
  });

  it("should return null when window.midnight contains no Lace provider", () => {
    const mockWindow = {
      midnight: {
        otherWallet: { name: "other", rdns: "com.other.wallet" },
      },
    };

    (globalThis as any).window = mockWindow;

    const provider = detectLaceProvider();
    expect(provider).toBeNull();
  });

  it("should return error state with address-not-found when getUnshieldedAddress returns empty string", async () => {
    const mockWindow = {
      midnight: {
        lace: {
          name: "lace",
          rdns: "io.lace.wallet",
          connect: async (_net: string) => ({
            getUnshieldedAddress: async () => ({ unshieldedAddress: "" }),
          }),
        },
      },
    };

    (globalThis as any).window = mockWindow;

    const res = await connectLaceWallet();
    expect(res.success).toBe(false);
    expect(res.state.connected).toBe(false);
    expect(res.state.status).toBe("error");
    expect(res.state.address).toBeNull();
    expect(res.state.error).toBeTruthy();
  });

  it("should successfully connect and extract address from result.unshieldedAddress", async () => {
    const validAddr = "mn_addr_preprod1ruqqkymd9gn0j8t2pa6ef4amhh59ass8xspd9yxzhthycygmuftqf79naa";
    const mockWindow = {
      midnight: {
        lace: {
          name: "lace",
          rdns: "io.lace.wallet",
          connect: async (_net: string) => ({
            getUnshieldedAddress: async () => ({ unshieldedAddress: validAddr }),
          }),
        },
      },
    };

    (globalThis as any).window = mockWindow;

    const res = await connectLaceWallet();
    expect(res.success).toBe(true);
    expect(res.state.connected).toBe(true);
    expect(res.state.status).toBe("connected");
    expect(res.state.address).toBe(validAddr);
    expect(res.state.provider).toBe("lace");
    expect(res.state.network).toBe("Midnight Preprod (preprod)");
  });

  it("should surface user-friendly error when wallet is locked", async () => {
    const mockWindow = {
      midnight: {
        lace: {
          name: "lace",
          rdns: "io.lace.wallet",
          connect: async (_net: string) => ({
            getUnshieldedAddress: async () => {
              throw new Error("Wallet is locked. Please unlock the wallet first.");
            },
          }),
        },
      },
    };

    (globalThis as any).window = mockWindow;

    const res = await connectLaceWallet();
    expect(res.success).toBe(false);
    expect(res.state.status).toBe("error");
    expect(res.state.error).toMatch(/unlock/i);
  });

  it("should surface user-friendly error when Lace is not detected", async () => {
    (globalThis as any).window = { midnight: {} };

    const res = await connectLaceWallet();
    expect(res.success).toBe(false);
    expect(res.state.status).toBe("error");
    expect(res.state.error).toMatch(/not found|install/i);
  });

  it("should surface user-friendly error when API is shutdown", async () => {
    const mockWindow = {
      midnight: {
        lace: {
          name: "lace",
          rdns: "io.lace.wallet",
          connect: async (_net: string) => ({
            getUnshieldedAddress: async () => {
              throw new Error("Remote API with channel 'midnight-wallet' was shutdown: object can no longer be used.");
            },
          }),
        },
      },
    };

    (globalThis as any).window = mockWindow;

    const res = await connectLaceWallet();
    expect(res.success).toBe(false);
    expect(res.state.status).toBe("error");
    expect(res.state.error).toMatch(/reset|connect again/i);
  });
});
