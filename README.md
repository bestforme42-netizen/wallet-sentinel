# 🔭 Wallet Sentinel — Autonomous Wallet Security Agent

> **Your wallet has a 24/7 bodyguard.**

An AI-powered wallet monitoring platform built on Base. Wallet Sentinel scans ERC-20 approvals, scores them with a multi-factor risk engine, and alerts you *before* a drain happens. The autonomous agent loop runs 24/7 — you sleep, Sentinel watches.

---

## 🚀 Live Demo

| | |
|---|---|
| **App**     | https://wallet-sentinel-tools.vercel.app |
| **Repo**    | https://github.com/bestforme42-netizen/wallet-sentinel |
| **Network** | Base Sepolia (chainId 84532) |

### Try It in 60 Seconds
1. Visit https://wallet-sentinel-tools.vercel.app
2. Connect any injected wallet (MetaMask, OKX, Rabby) on Base Sepolia
3. Click "Scan" — Sentinel fetches all your ERC-20 Approval events on-chain
4. See risk scores: 🔴 Critical → unlimited approval to unknown contract, etc.
5. Click "Revoke" on dangerous approvals — wallet pops up with pre-encoded approve(0)
6. Set up Telegram alerts (coming soon) for autonomous 24/7 monitoring

---

## 🎯 The Problem

Crypto users lose **$billions** to approval-based drains every year. The pattern is always the same:
1. User signs a malicious approval (unlimited, to unknown contract)
2. Drainer contract sweeps tokens hours/days later
3. User realizes too late — "I didn't know that approval was dangerous"

There's no real-time watchdog for approvals. Until now.

---

## 🏗️ Architecture

```
                    ┌─ Web Dashboard ──────────┐
   User ──SIWE────▶│  Scan approvals          │
                    │  Risk analysis UI        │
                    │  One-click revoke        │
                    └────────┬─────────────────┘
                             │
              ┌────── AI Agent Loop ──────────────┐
              │  Hermes cron (every 5 min)        │
              │  1. Fetch new Approval events     │
              │  2. Score each with risk engine   │
              │  3. LLM-summarize findings        │
              │  4. Push alert if threshold met   │
              └──────────┬───────────────────────┘
                         ▼
              ┌─ Telegram Bot ────────────────────┐
              │  Real-time alerts                 │
              │  Inline revoke buttons            │
              │  /status, /add, /list commands    │
              └───────────────────────────────────┘
```

---

## 🔍 Risk Scoring Engine

Multi-factor heuristic engine (`src/lib/risk-engine.ts`) scores every approval:

| Risk Level | Trigger |
|-----------|---------|
| 🔴 **Critical** | Unlimited approval to unknown contract |
| 🟠 **High** | Unlimited approval (even to known protocols) |
| 🟡 **Medium** | Non-unlimited to unknown spender |
| 🔵 **Low** | Approval to known safe spender (Uniswap, Base Bridge) |
| 🟢 **Safe** | Known safe spender, reasonable amount |

Each approval gets a recommendation: "Revoke immediately", "Replace with exact amount", etc.

---

## 📜 Smart Contract (Base Sepolia)

| Contract | Address |
|----------|---------|
| **PanicRevoke** (utility) | *deploying soon — pending Base Sepolia ETH* |

PanicRevoke provides:
- `batchAllowance(owner, targets)` — batch-read allowances for display
- `canRevoke(owner, token, spender)` — check if revoke is needed
- `encodeRevoke(token, spender)` — generate approve(0) calldata for wallet popup

Actual revocation happens via the wallet calling `approve(spender, 0)` directly on each token contract — approvals are keyed to `msg.sender`, so only the wallet can revoke its own approvals.

---

## 🧪 Tests

| Suite | Status |
|-------|--------|
| `forge test --match-contract PanicRevokeTest` | 5/5 ✅ |
| Next.js build | ✅ |
| Scan API endpoint | ✅ (returns JSON on valid address) |

---

## 📂 Repo Structure

```
wallet-sentinel/
├── contracts/                    Foundry project
│   ├── src/
│   │   └── PanicRevoke.sol       Batch allowance reader + calldata encoder
│   └── test/
│       └── PanicRevoke.t.sol     5 tests (batch read, canRevoke, encodeRevoke)
└── src/
    ├── app/
    │   ├── page.tsx               Landing page
    │   ├── dashboard/             Scan + risk analysis + revoke UI
    │   └── api/
    │       └── scan/route.ts      Fetch Approval events via RPC
    ├── lib/
    │   ├── wagmi.ts               Base Sepolia + mainnet config
    │   ├── risk-engine.ts         Multi-factor risk scoring
    │   └── contracts.ts           ABI + constants
    └── components/
        ├── Providers.tsx           Wagmi + QueryClient
        └── ConnectButton.tsx      Multi-injected wallet connect
```

---

## 🛠️ Local Development

```bash
git clone https://github.com/bestforme42-netizen/wallet-sentinel.git
cd wallet-sentinel
npm install
npm run dev            # http://localhost:3000

# Contracts
cd contracts
forge build && forge test -vv
```

---

## 🌱 What's Next

- **Telegram bot** — real-time alerts via `@WalletSentinelBot`
- **Autonomous cron agent** — Hermes loop scans every 5 min, LLM-summarizes risk
- **Supabase integration** — persistent watch lists + SIWE auth
- **Multi-chain** — Ethereum mainnet, Polygon, Arbitrum
- **Permit2 detection** — flag Permit2 signatures with unlimited amounts
- **Deployed contract** — PanicRevoke deployed on Base for batch-revoke UX

---

## 📜 License

MIT
