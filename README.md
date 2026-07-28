# Private Salary Verification

*A privacy-preserving Confidential Credentials dApp built on Midnight Network using Compact smart contracts and Zero-Knowledge proofs.*

[![Netlify Status](https://api.netlify.com/api/v1/badges/privatesalaryverification/deploy-status)](https://privatesalaryverification.netlify.app/)
[![YouTube Demo](https://img.shields.io/badge/YouTube-Demo-red.svg?logo=youtube)](https://youtu.be/1EZ12ttgSXY)
[![CI/CD Pipeline](https://github.com/WorkshopDeRahul/Private-Salary-Verification-midnight/actions/workflows/ci.yml/badge.svg)](https://github.com/WorkshopDeRahul/Private-Salary-Verification-midnight/actions/workflows/ci.yml)
[![Midnight Network](https://img.shields.io/badge/Midnight-Preprod_Network-indigo.svg)](https://midnight.network)
[![Compact Language](https://img.shields.io/badge/Compact-0.23+-purple.svg)](https://midnight.network)
[![Node.js](https://img.shields.io/badge/Node.js-v22-green.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🚀 Live Demo, Video & Proposal

- 🌐 **Live Web Application**: [https://privatesalaryverification.netlify.app/](https://privatesalaryverification.netlify.app/)
- 📺 **YouTube Video Demo**: [https://youtu.be/1EZ12ttgSXY](https://youtu.be/1EZ12ttgSXY)
- 📦 **GitHub Repository**: [https://github.com/WorkshopDeRahul/Private-Salary-Verification-midnight](https://github.com/WorkshopDeRahul/Private-Salary-Verification-midnight)
- 📄 **Project Proposal**: [PROPOSAL.md](PROPOSAL.md)
- ⚙️ **CI/CD Workflow**: [https://github.com/WorkshopDeRahul/Private-Salary-Verification-midnight/actions/workflows/ci.yml](https://github.com/WorkshopDeRahul/Private-Salary-Verification-midnight/actions/workflows/ci.yml)

---

## 📋 Hackathon Compliance & Requirements Checklist

- [x] **PROPOSAL.md**: Complete project proposal detailing problem statement, ZK architecture, witness design, and roadmap.
- [x] **Live Deployed Application**: Operational production dApp deployed to Netlify with single-page routing (`public/_redirects`).
- [x] **Demo Video Available**: Complete walkthrough published on YouTube demonstrating ZK proof flows.
- [x] **Public GitHub Repository**: Public repository under sole author WorkshopDeRahul.
- [x] **Live CI/CD Badge**: Active GitHub Actions badge reflecting workflow build and test status.
- [x] **Passing Automated Tests**: 8/8 Vitest unit tests passing cleanly.
- [x] **Compact Smart Contract**: Production contract (`contracts/private-salary-verification.compact`) compiled with witness parameters.
- [x] **Lace-Only Wallet Integration**: Provider filter strictly requiring Lace Wallet (RDNS `io.lace.wallet`). Rejecting non-Lace providers.
- [x] **Midnight Preprod Enforcement**: Restricting target network connection strictly to `preprod`.
- [x] **Developer Diagnostics Panel**: Interactive panel tracking provider detection, connection, address retrieval, and contract reachability.
- [x] **Address Retrieval Fix**: Active account address extraction with clean fallback message `"No Midnight account found in Lace"`.
- [x] **Contract Deployment Documentation**: Detailed network deployment instructions and verification parameters.

---

## 🛡️ Midnight Privacy Model & Witness Explanation

The **Private Salary Verification** smart contract leverages Midnight's dual-state architecture to separate private witness execution from public on-chain ledger state.

### Witness Private Execution (Client-Side Only)
- **`secretSalary`**: Confidential integer representing annual compensation. Evaluated locally in local ZK witness; **NEVER** stored on-chain or disclosed.
- **`secretSalt`**: Private 32-byte entropy salt key protecting against hash inversion / rainbow table attacks.
- **ZK Circuit Constraint**: Evaluates `assert(secretSalary >= requestedThreshold)` inside client-side ZK-SNARK prover.

### Public Ledger State (On-Chain Visibility)
- **`verifierOwner`**: Public address/key of the verifier admin (`Bytes<32>`).
- **`verificationCount`**: Total number of proof executions recorded on-chain (`Uint<64>`).
- **`latestVerifiedThreshold`**: The public threshold limit tested (`Uint<64>`).
- **`isVerified`**: Boolean verification outcome flag (`Boolean`).
- **`verifiedCommitmentHash`**: 32-byte cryptographic salt commitment hash (`Bytes<32>`).

---

## 🔑 Strict Lace Wallet Integration & Diagnostics

The dApp implements strict provider isolation and network validation:
1. **Lace Provider Isolation**: Inspects `Object.values(window.midnight || {})` and connects **ONLY** when `provider.name === "lace"` or `provider.rdns === "io.lace.wallet"`.
2. **Midnight Preprod Network Check**: Enforces `provider.connect("preprod")`. Rejects invalid networks (`mainnet`, `testnet`, `devnet`, `preview`, `unknown`).
3. **Address Retrieval**: Returns active account address or displays `"No Midnight account found in Lace"`.
4. **Developer Diagnostics Panel**: Displays Provider Name, RDNS, API Version, Target Network (`preprod`), Connected Network, Status, Address, Contract Address, and 4-step checklist.

---

## 📄 Contract & Deployment Information

| Parameter | Value |
| :--- | :--- |
| **Contract File** | `contracts/private-salary-verification.compact` |
| **Managed Output** | `contracts/managed/private-salary-verification` |
| **Target Network** | **Midnight Preprod** (`preprod`) |
| **Contract Address** | `444f33167a85a49ed3a197e2944742463bca0a98364570caa8f116c13cb91954` |
| **Compiler Engine** | Compact 0.23+ / 0.31.1 Managed Artifacts |
| **Proof Server URL** | `http://localhost:6300` |
| **Deployment Date** | July 2026 |

---

## 🚀 Local Development & Setup

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/WorkshopDeRahul/Private-Salary-Verification-midnight.git
cd Private-Salary-Verification-midnight
npm install
```

### 2. Compile Compact Smart Contract
```bash
npm run compile
```

### 3. Run Automated Unit Test Suite
```bash
npm test
```

### 4. Build TypeScript & Production Assets
```bash
npm run build
npm run build:frontend
```

### 5. Start Development Server
```bash
npm run dev
```

---

## 🧪 Automated Test Suite

The repository includes comprehensive Vitest unit tests covering contract managed artifacts, ZK constraint logic, Lace provider isolation, Preprod network enforcement, and fallback address handling.

```bash
npm test
```

### Verification Output:
```text
 RUN  v4.1.10

 ✓ tests/salary-verification.test.ts (8 tests)

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Duration  624ms
```

---

## 📸 Application Screenshots

### 1. Marketing Homepage & ZK Visualizer
![Landing Page](docs/screenshots/landing-page.png)

### 2. Salary Verification Wizard
![Salary Verification Wizard](docs/screenshots/salary-verification.png)

---

## 🗺️ Application Routes

| Route | Page Name | Description |
| :--- | :--- | :--- |
| **`/`** | **Home** | Marketing landing page with ZK pipeline diagram, process cards, and use cases. |
| **`/dashboard`** | **System Dashboard** | Metrics, recent activity feed, contract specs, and Developer Wallet Diagnostics panel. |
| **`/verify`** | **Salary Verification** | Step-by-step interactive ZK proof verification wizard. |
| **`/credentials`** | **Credential Vault** | Management panel for employer-issued credentials and vault JSON export. |
| **`/history`** | **Verification History** | Audit log table of on-chain verification records and commitment hashes. |
| **`/privacy`** | **Privacy Model** | Technical breakdown of private witness inputs vs public ledger state. |
| **`/about`** | **About & Specs** | System architecture, problem statement, and Midnight ZK technology overview. |

---

## 🔮 Future Roadmap

1. **Employer Digital Signatures**: Integrate employer-signed ZK claims (e.g., HR cryptographic signatures) to certify income sources.
2. **Multi-Currency Support**: Support real-time FX rate conversions for foreign income verification.
3. **Reusable Re-verification Tokens**: Mint non-transferable Zero-Knowledge Credential Tokens (SBTs) on Midnight allowing users to reuse income proofs across multiple verifiers.

---

## 📜 License

MIT License — Built for the Midnight Community & Hackathon.
