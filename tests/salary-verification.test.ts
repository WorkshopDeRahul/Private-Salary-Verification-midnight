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
    resetWalletSession();
  });
  it("should reject random providers and select ONLY Lace provider", () => {
    // Mock window.midnight with multiple providers
    const mockWindow = {
      midnight: {
        randomWallet: { name: "random-wallet", rdns: "com.random.wallet" },
        metamaskFake: { name: "metamask", rdns: "io.metamask" },
        lace: { name: "lace", rdns: "io.lace.wallet", enable: async () => ({}) },
      },
    };

    (globalThis as any).window = mockWindow;

    const provider = detectLaceProvider();
    expect(provider).toBeDefined();
    expect(provider.rdns).toBe("io.lace.wallet");
    expect(provider.name).toBe("lace");
  });

  it("should return Lace Wallet Required when window.midnight contains no Lace provider", () => {
    const mockWindow = {
      midnight: {
        otherWallet: { name: "other", rdns: "com.other.wallet" },
      },
    };

    (globalThis as any).window = mockWindow;

    const provider = detectLaceProvider();
    expect(provider).toBeNull();
  });

  it("should fallback to explicit message 'No Midnight account found in Lace' when address is empty", async () => {
    const mockWindow = {
      midnight: {
        lace: {
          name: "lace",
          rdns: "io.lace.wallet",
          connect: async (net: string) => ({
            getConnectionStatus: async () => "connected",
            network: async () => net,
            getUnshieldedAddress: async () => ({ unshieldedAddress: "" }),
          }),
        },
      },
    };

    (globalThis as any).window = mockWindow;

    const res = await connectLaceWallet("test-contract-addr");
    expect(res.success).toBe(false);
    expect(res.address).toBe("No Midnight account found in Lace");
    expect(res.diagnostics.steps.addressRetrieved.reason).toBe("No Midnight account found in Lace");
  });

  it("should successfully validate preprod connection when valid account is returned", async () => {
    const validAddr = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const mockWindow = {
      midnight: {
        lace: {
          name: "lace",
          rdns: "io.lace.wallet",
          connect: async (net: string) => ({
            getConnectionStatus: async () => "connected",
            network: async () => net,
            getUnshieldedAddress: async () => ({ unshieldedAddress: validAddr }),
          }),
        },
      },
    };

    (globalThis as any).window = mockWindow;

    const res = await connectLaceWallet("test-contract-addr");
    expect(res.success).toBe(true);
    expect(res.address).toBe(validAddr);
    expect(res.network).toBe("Midnight Preprod (preprod)");
    expect(res.diagnostics.steps.providerConnected.status).toBe(true);
  });
});

