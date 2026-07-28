# PROPOSAL.md — Private Salary Verification on Midnight Network

## Project Name
**Private Salary Verification (Zero-Knowledge Confidential Income Credentials)**

---

## Executive Summary
**Private Salary Verification** is a privacy-preserving decentralized application (dApp) built on the **Midnight Network**. It enables individuals (employees, contractors, freelancers) to prove that their annual income satisfies specific financial thresholds (e.g., for home mortgage applications, apartment leases, auto loans, or visa income checks) **without disclosing their exact salary, employer identity, or bank statements** to third parties.

By leveraging **Midnight's Compact smart contract language**, **Zero-Knowledge (ZK) proofs**, and **Lace Wallet integration**, sensitive financial information is kept strictly private inside local client-side witness circuits while emitting tamper-proof cryptographic verification outcomes onto the public Midnight Preprod blockchain ledger.

---

## Problem Statement
In traditional financial and rental verification processes:
1. **Excessive Data Exposure**: Individuals are forced to hand over pay stubs, W-2 forms, tax returns, and full bank statements containing sensitive personal identifiers (SSN, home address, account numbers, exact earnings).
2. **Third-Party Data Liability**: Landlords, mortgage brokers, loan officers, and background check agencies store unencrypted income documents on centralized servers, making them prime targets for identity theft and data breaches.
3. **Loss of Personal Autonomy**: Individuals cannot selectively disclose *only* what is necessary (e.g., "I earn over $75,000/year") and must instead reveal their exact compensation.
4. **Lack of Cryptographic Verifiability**: Paper and PDF paystubs are easy to forge, while digital verification APIs require intrusive third-party aggregators (e.g., Plaid) that track user activities.

---

## Why Privacy Is Required
Income data is among the most sensitive personal data types. Compromised salary information can lead to:
- **Targeted Financial Scams & Identity Theft**: Armed with exact earnings and bank details, bad actors can execute targeted spear-phishing or identity fraud.
- **Discriminatory Pricing & Negotiation Disadvantage**: Sharing exact income history with future landlords or employers undermines individual bargaining power.
- **Regulatory Non-Compliance**: Global regulations such as GDPR, CCPA, and CPRA classify financial history as sensitive personal data requiring strict minimization.

Zero-Knowledge technology is essential because it fundamentally shifts the security paradigm from *data trust* ("trust us with your data") to *math trust* ("verify the mathematical proof").

---

## Midnight Zero-Knowledge Approach
The Midnight Network combines a dual-state ledger (Private State vs. Public State) with Compact-generated zero-knowledge proof circuits (SNARKs).

### Core ZK Architecture Strategy:
1. **Private Local Computation**: The employee inputs their confidential salary and a secret salt locally in their browser.
2. **Client-Side Witness Evaluation**: The private input data is processed exclusively inside the client's local ZK witness runtime.
3. **ZK Constraint Evaluation**: The Compact contract executes the constraint `secretSalary >= requestedThreshold`.
4. **Zero-Knowledge Proof Generation**: The prover engine generates a succinct zero-knowledge proof (`zk-SNARK`) testifying that the inequality holds, without exposing `secretSalary`.
5. **Public State Update**: Only the public verification result (`isVerified = true`), aggregate counters (`verificationCount`), and a non-revertible commitment hash are written to the Midnight Preprod public ledger.

---

## Architecture Overview

```
 ┌──────────────────────────────────────────────────────────────────────────┐
 │                            User Browser / dApp                           │
 │                                                                          │
 │  ┌──────────────────────────────┐        ┌────────────────────────────┐  │
 │  │      Lace Wallet (dApp)      │ ───►   │  Private Salary dApp UI    │  │
 │  │   (Preprod Network Only)     │        │   (React + Vite + Router)  │  │
 │  └──────────────────────────────┘        └──────────────┬─────────────┘  │
 └─────────────────────────────────────────────────────────┼────────────────┘
                                                           │
                                                           ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │                    Client-Side ZK Witness Execution                      │
 │                                                                          │
 │  ┌────────────────────────────────────────────────────────────────────┐  │
 │  │  Witness Functions: getSecretSalary(), getSecretSalt()            │  │
 │  │  ZK Circuit Constraint: secretSalary >= requestedThreshold         │  │
 │  └──────────────────────────────────┬─────────────────────────────────┘  │
 └─────────────────────────────────────┼────────────────────────────────────┘
                                       │ Generates ZK-SNARK Proof
                                       ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │                     Midnight Preprod Blockchain Ledger                   │
 │                                                                          │
 │   Public State Updates:                                                  │
 │   - verificationCount: Uint<64> (+1)                                    │
 │   - latestVerifiedThreshold: Uint<64>                                    │
 │   - isVerified: Boolean (true)                                           │
 │   - verifiedCommitmentHash: Bytes<32>                                    │
 └──────────────────────────────────────────────────────────────────────────┘
```

---

## User Flow
1. **Connect Wallet**: User connects their **Lace Wallet** configured specifically for **Midnight Preprod**. Non-Lace providers are rejected with explicit error messaging.
2. **Select Requirement**: Verifier (e.g., landlord/lender) requests proof that income is >= $75,000.
3. **Input Private Data**: User enters actual salary (e.g., $95,000) and salt into the client-side dApp form.
4. **Execute ZK Proof**: Local prover evaluates the circuit logic `secretSalary >= requestedThreshold`.
5. **On-Chain Settlement**: The transaction containing the ZK proof is submitted to Midnight Preprod.
6. **Share Credential**: User shares the on-chain transaction hash or commitment proof with the verifier, who can independently confirm validity on-chain without ever seeing the raw income figure.

---

## Smart Contract Design
Written in Midnight's **Compact 0.23+** language (`contracts/private-salary-verification.compact`):

```compact
pragma language_version >= 0.23;

import CompactStandardLibrary;

// Public ledger state - visible on Midnight blockchain
export ledger verifierOwner: Bytes<32>;
export ledger verificationCount: Uint<64>;
export ledger latestVerifiedThreshold: Uint<64>;
export ledger isVerified: Boolean;
export ledger verifiedCommitmentHash: Bytes<32>;

// Witness declarations - Private inputs processed exclusively in client-side ZK context
witness secretSalary(): Uint<64>;
witness secretSalt(): Bytes<32>;

// Initialize verifier admin key
export circuit initializeVerifier(verifierPk: Bytes<32>): [] {
    verifierOwner = disclose(verifierPk);
    verificationCount = disclose(0 as Uint<64>);
    latestVerifiedThreshold = disclose(0 as Uint<64>);
    isVerified = disclose(false);
}

// Circuit: Privately verify that employee secret salary >= requestedThreshold
export circuit verifySalaryThreshold(
    requestedThreshold: Uint<64>,
    secretSalary: Uint<64>,
    secretSalt: Bytes<32>
): [] {
    // Zero-knowledge constraint assertion
    assert(secretSalary >= requestedThreshold, "Salary does not meet required threshold");
    
    // Disclose public outcome ledger state & commitment hash (never raw salary)
    verificationCount = disclose((verificationCount + 1) as Uint<64>);
    latestVerifiedThreshold = disclose(requestedThreshold);
    isVerified = disclose(true);
    verifiedCommitmentHash = disclose(secretSalt);
}
```

---

## Witness Design
Witnesses in Compact represent private data sources that supply secrets directly into the zero-knowledge circuit environment:
- **`secretSalary`**: Private integer representing annual compensation. Passed strictly as witness parameter; never exposed via `disclose()`.
- **`secretSalt`**: Private entropy byte sequence used to calculate a non-linkable commitment hash `verifiedCommitmentHash`.
- **Privacy Assurance**: The proof system outputs a mathematical proof testifying that the secret parameters satisfy the constraint assertion without leaking the value of the witnesses.

---

## Public vs Private Data Analysis

| Data Field | Storage Location | Visibility Scope | Privacy Rationale |
| :--- | :--- | :--- | :--- |
| **Secret Salary Amount** | Local Prover / Witness | **100% Private (Client Only)** | Core income figure; must never touch public chain. |
| **Employee Secret Salt** | Local Prover / Witness | **100% Private (Client Only)** | Prevents rainbow table / hash inversion attacks. |
| **Personal Identity Details** | Kept Off-Chain | **100% Private** | Names/SSNs are excluded from smart contract state. |
| **Requested Threshold** | Public Ledger State | **Public (On-Chain)** | Verifier needs to know what limit was tested (e.g. $75k). |
| **Verification Status** | Public Ledger State | **Public (On-Chain)** | Boolean result (`true`/`false`) of the ZK proof execution. |
| **Verification Counter** | Public Ledger State | **Public (On-Chain)** | Aggregate statistic tracking total system usage. |
| **Commitment Hash** | Public Ledger State | **Public (On-Chain)** | Cryptographic anchor confirming proof provenance. |

---

## Deployment Strategy
- **Smart Contract Target**: Midnight Preprod Network (`preprod`).
- **Frontend Hosting**: Deployed on Netlify with single-page routing rewrite rules (`public/_redirects` routing `/*` to `index.html`).
- **Wallet Compatibility**: Strictly configured for **Lace Wallet** (RDNS `io.lace.wallet`).
- **CI/CD Integration**: Automated GitHub Actions workflow (`.github/workflows/ci.yml`) performing linting, Compact compilation check, Vitest unit testing, TypeScript build, Vite frontend bundling, and deployment status updates.

---

## Future Improvements
1. **Employer Digital Signatures**: Integrate employer-signed ZK claims (e.g., HR cryptographic signatures) so income claims are certified directly by employers.
2. **Multi-Currency Support**: Support real-time FX rate conversions for foreign income verification.
3. **Reusable Re-verification Tokens**: Mint non-transferable Zero-Knowledge Credential Tokens (SBTs) on Midnight allowing users to reuse income proofs across multiple verifiers without re-executing SNARK generation.
