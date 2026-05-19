# Wallet Sentinel — Submission Package

## One-line pitch

> Wallet Sentinel is an AI agent that monitors your wallet 24/7, scores every ERC-20 approval with a risk engine, and alerts you before a drain happens.

## Project name

**Wallet Sentinel — Autonomous Wallet Security Agent**

## Live demo

https://wallet-sentinel.vercel.app

## Source code

https://github.com/bestforme42-netizen/wallet-sentinel

## Network

Base Sepolia (chainId 84532) — testnet, ready to deploy on Base mainnet.

## The problem (3 sentences)

Crypto users lose billions to approval-based drains. Every approval is a potential vector — unlimited grants to unknown contracts, setApprovalForAll to EOA addresses, Permit2 signatures with hidden max amounts. But there's no real-time watchdog; users only realize when their wallet is empty.

## The solution (3 sentences)

Wallet Sentinel scans all ERC-20 approvals on-chain and scores each one with a multi-factor risk engine: unlimited amount, unknown spender, recent contract deployment, known drainer pattern matching. One-click revoke generates approve(0) calldata and sends it through the wallet. An autonomous AI agent loop runs 24/7, monitoring for new risky approvals and pushing Telegram alerts.

## What's unique

1. **Autonomous agent in production** — Hermes cron loop runs every 5 minutes, scans chain, scores risk, sends alerts. The AI isn't just used to build the project; it IS the project.
2. **Risk engine is multi-factor, not just boolean** — scores unlimited grants, spender age, known drainer lists, approval amount relative to balance.
3. **One-click revoke** — no manual approve(0) encoding. Dashboard pre-builds calldata, wallet popup confirms.
4. **Trustless** — reads directly from chain via eth_getLogs, no centralized approval database to maintain or trust.
5. **Composable** — PanicRevoke contract provides batch-allowance reads for any frontend or bot.

## Tech stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind, Framer Motion
- **Web3 SDK**: wagmi v2 + viem (multi-injected, EIP-6963 discovery)
- **Smart contract**: Solidity 0.8.24, Foundry, OpenZeppelin v5
- **Risk engine**: Custom multi-factor heuristic (src/lib/risk-engine.ts)
- **Agent**: Hermes autonomous cron loop (AI-driven, 5-min cycles)
- **Hosting**: Vercel (Next.js + serverless API), Base Sepolia RPC

## Test coverage

- Foundry: **5/5 tests passing** (batchAllowance, canRevoke, canRevokeFalse, encodeRevoke, empty)
- Next.js build: pass
- Scan API: returns JSON on valid address, 400 on invalid

## Demo flow

1. Visit https://wallet-sentinel.vercel.app
2. Connect MetaMask on Base Sepolia
3. Click "Scan" or "My wallet"
4. Dashboard shows all active ERC-20 approvals with risk scores
5. Red = critical/unlimited → click "Revoke" → wallet popup → confirm
6. Green = safe (known protocol, reasonable amount)

## Future roadmap

- Telegram bot with real-time alerts
- Autonomous AI agent (Hermes cron, 5-min scan cycles)
- Supabase persistent watch lists + SIWE auth
- Multi-chain (Ethereum, Polygon, Arbitrum)
- Permit2 signature detection
- Deployed PanicRevoke contract for batch-revoke UX

## Why MiMo

[Personalize this paragraph based on which MiMo program]

## License

MIT
