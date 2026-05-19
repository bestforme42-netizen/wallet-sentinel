# 🎯 Move & Solve — AR Crypto Treasure Quest

> **Walk. Discover. Solve.**

A gamified Web3 treasure-hunt app where users explore real-world locations, solve crypto-safety puzzles, earn NFT badges, and redeem merchant rewards. Built for the Xiaomi ecosystem hackathon.

## 🚀 Live Demo

| | |
|---|---|
| **App** | https://wallet-sentinel.vercel.app |
| **Repo** | https://github.com/bestforme42-netizen/wallet-sentinel |
| **Network** | Base Sepolia (mock mode) |

## 🎮 Try It

1. Visit the live demo
2. Click **"Start Quest"** → choose Wallet or Email login
3. Explore the **Dashboard** — see XP, level, streak, badges
4. Open **Quest Map** — see 4 nearby treasure locations
5. Tap a quest → **Start Quest** → AR Discovery mock
6. **Scan the clue** → solve the crypto-safety puzzle
7. Earn **XP + Points + NFT Badge** → share your achievement
8. Visit **Rewards** → redeem points for merchant vouchers

## 🏗️ Architecture

```
src/
├── app/
│   ├── page.tsx              Landing page
│   ├── auth/                 Connect wallet / social login
│   ├── dashboard/            User stats, active quest, badges
│   ├── map/                  Quest map with markers
│   ├── quest/[id]/           Quest detail
│   ├── quest/[id]/ar/        AR discovery mock
│   ├── quest/[id]/puzzle/    Crypto-safety quiz
│   ├── quest/[id]/reward/    Badge mint + XP celebration
│   ├── wallet/               NFT badges, quest history, on-chain activity
│   ├── leaderboard/          Weekly rankings
│   └── rewards/              Merchant voucher redemption
├── components/
│   ├── NavBar.tsx            Bottom navigation
│   └── GlassCard.tsx         Reusable glassmorphism card
├── data/
│   └── mock.ts               All demo data (users, quests, puzzles, badges, rewards)
├── store/
│   └── app.ts                Zustand global state
└── lib/
    └── utils.ts              cn() helper
```

## 🧪 Demo Flow (12 Steps)

| Step | Page | What Happens |
|------|------|--------------|
| 1 | Landing | Hero, features, Xiaomi section, Web3 safety |
| 2 | Auth | Wallet connect or email social login |
| 3 | Dashboard | XP bar, level, streak, active quest, badges |
| 4 | Quest Map | Interactive map mock with 4 quest markers |
| 5 | Map List | Quest cards with difficulty, distance, rewards |
| 6 | Quest Detail | Story, briefing, difficulty stars, reward preview |
| 7 | AR Discovery | Camera mock, floating clue, scan animation |
| 8 | Puzzle | Crypto-safety quiz with instant feedback |
| 9 | Explanation | Educational content after answer |
| 10 | Reward | Badge mint animation, XP/points, share button |
| 11 | Wallet | NFT gallery, quest history, on-chain mock |
| 12 | Leaderboard | Weekly rankings, top 3 podium |
| 13 | Rewards | Merchant vouchers, QR code redemption mock |

## 🛠️ Tech Stack

- **Next.js 14** — App Router, TypeScript, SSR
- **Tailwind CSS** — Xiaomi dark theme (navy, cyan, orange, purple)
- **Framer Motion** — page transitions, staggered animations, floating effects
- **Zustand** — lightweight global state
- **Lucide React** — icon library
- **Glassmorphism** — blur + subtle borders on every card

## 🎨 UI Design

- **Mobile-first** — every page designed for 375px width
- **Dark navy** background (#0a0e1a)
- **Neon cyan** (#00e5ff) for primary actions
- **Electric orange** (#ff6d00) for rewards/points
- **Soft purple** (#b388ff) for badges/rare items
- **Glassmorphism** panels with blur + border
- **Floating animations** on map markers
- **Progress bars** with gradient fills
- **Scanline effects** on AR overlay

## 📦 Local Development

```bash
git clone https://github.com/bestforme42-netizen/wallet-sentinel.git
cd wallet-sentinel
npm install
npm run dev    # http://localhost:3000
```

## 🌱 What's Next

- Real wallet integration (wagmi + MetaMask)
- GPS-based checkpoint verification
- Camera-based AR clue discovery
- On-chain NFT minting (Base Sepolia → Mainnet)
- Supabase user persistence
- Mi Band / Xiaomi fitness tracker step integration
- Merchant partner onboarding
- Multi-language support

## 📜 License

MIT
