// ============================================================
// Move & Solve — Mock Data
// ============================================================

export type User = {
  id: string;
  name: string;
  walletAddress: string;
  avatar: string;
  xp: number;
  level: number;
  points: number;
  streak: number;
  badges: string[];
  questsCompleted: number;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  story: string;
  locationName: string;
  lat: number;
  lng: number;
  distance: string;
  difficulty: "easy" | "medium" | "hard";
  movementGoal: string;
  movementProgress: number;
  puzzleId: string;
  rewardPoints: number;
  rewardXP: number;
  badgeId: string;
  badgeName: string;
  badgeRarity: "common" | "rare" | "epic" | "legendary";
  isActive: boolean;
  isCompleted: boolean;
  icon: string;
};

export type Puzzle = {
  id: string;
  question: string;
  choices: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  topic: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  mintedAt: string;
  txHash: string;
  questId: string;
};

export type MerchantReward = {
  id: string;
  merchantName: string;
  merchantIcon: string;
  title: string;
  requiredPoints: number;
  description: string;
  category: string;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  badges: number;
  streak: number;
  isCurrentUser: boolean;
};

// ── Current User ──
export const currentUser: User = {
  id: "user-001",
  name: "Alex",
  walletAddress: "0x7a3E…f92B",
  avatar: "🕵️",
  xp: 2450,
  level: 5,
  points: 1280,
  streak: 7,
  badges: ["badge-phishing", "badge-seed-phrase", "badge-wallet-guard"],
  questsCompleted: 12,
};

// ── Quests ──
export const quests: Quest[] = [
  {
    id: "quest-phishing-phantom",
    title: "Phishing Phantom at Cyber Park",
    description: "A suspicious wallet-draining link has appeared near Cyber Park.",
    story:
      "Reports are flooding in about a phishing attack near Cyber Park. Victims received DMs asking them to \"verify\" their wallets. Walk to the checkpoint, discover the hidden clue, and solve the puzzle to protect the community.",
    locationName: "Cyber Park",
    lat: -6.2088,
    lng: 106.8456,
    distance: "500m",
    difficulty: "easy",
    movementGoal: "Walk 500 steps to Cyber Park",
    movementProgress: 0.72,
    puzzleId: "puzzle-seed-phrase",
    rewardPoints: 150,
    rewardXP: 200,
    badgeId: "badge-phishing",
    badgeName: "Phishing Detector",
    badgeRarity: "common",
    isActive: true,
    isCompleted: false,
    icon: "👻",
  },
  {
    id: "quest-wallet-guardian",
    title: "Wallet Guardian at Tech Plaza",
    description: "A rogue smart contract is draining unsuspecting wallets nearby.",
    story:
      "Tech Plaza has become a hotspot for suspicious approval requests. Users are granting unlimited token access to unknown contracts. Navigate to the plaza, scan the AR clue, and learn how to guard your wallet.",
    locationName: "Tech Plaza",
    lat: -6.1944,
    lng: 106.8229,
    distance: "1.2km",
    difficulty: "medium",
    movementGoal: "Walk 1200 steps to Tech Plaza",
    movementProgress: 0.3,
    puzzleId: "puzzle-approval",
    rewardPoints: 250,
    rewardXP: 350,
    badgeId: "badge-wallet-guard",
    badgeName: "Wallet Guardian",
    badgeRarity: "rare",
    isActive: false,
    isCompleted: false,
    icon: "🛡️",
  },
  {
    id: "quest-rug-pull",
    title: "Rug Pull Alert at Crypto Market",
    description: "A suspicious new token is being shilled at the local crypto meetup.",
    story:
      "Someone at Crypto Market is promoting a new token with promises of 100x returns. Walk to the market, investigate the token contract, and identify the red flags before more people get rugged.",
    locationName: "Crypto Market",
    lat: -6.2250,
    lng: 106.8100,
    distance: "2.0km",
    difficulty: "hard",
    movementGoal: "Walk 2000 steps to Crypto Market",
    movementProgress: 0,
    puzzleId: "puzzle-rug-pull",
    rewardPoints: 400,
    rewardXP: 500,
    badgeId: "badge-rug-detective",
    badgeName: "Rug Detective",
    badgeRarity: "epic",
    isActive: false,
    isCompleted: false,
    icon: "🔍",
  },
  {
    id: "quest-seed-guardian",
    title: "Seed Phrase Vault at Data Tower",
    description: "A database of leaked seed phrases has been discovered near Data Tower.",
    story:
      "Security researchers found a database of compromised seed phrases near Data Tower. The phrases were leaked through fake \"wallet recovery\" services. Visit the tower, secure the vault, and earn the Seed Guardian badge.",
    locationName: "Data Tower",
    lat: -6.1900,
    lng: 106.8300,
    distance: "800m",
    difficulty: "medium",
    movementGoal: "Walk 800 steps to Data Tower",
    movementProgress: 0,
    puzzleId: "puzzle-seed-phrase",
    rewardPoints: 300,
    rewardXP: 400,
    badgeId: "badge-seed-phrase",
    badgeName: "Seed Guardian",
    badgeRarity: "rare",
    isActive: false,
    isCompleted: true,
    icon: "🔐",
  },
];

// ── Puzzles ──
export const puzzles: Puzzle[] = [
  {
    id: "puzzle-seed-phrase",
    question:
      "You receive a DM: \"Verify your wallet now or lose your NFT.\" The link asks for your seed phrase. What should you do?",
    choices: [
      { label: "A", text: "Enter the seed phrase quickly to keep my NFT" },
      { label: "B", text: "Ignore and report the link — never share your seed phrase" },
      { label: "C", text: "Send only half of the seed phrase for safety" },
      { label: "D", text: "Ask the sender for proof they're legitimate" },
    ],
    correctAnswer: "B",
    explanation:
      "Your seed phrase gives FULL control of your wallet. No legitimate app, brand, or support agent will EVER ask for it. Scammers create urgency (\"verify now or lose…\") to bypass your critical thinking. Always report and block.",
    topic: "Seed Phrase Safety",
  },
  {
    id: "puzzle-approval",
    question:
      "A DeFi app asks you to approve \"unlimited\" USDC spending. What's the safest action?",
    choices: [
      { label: "A", text: "Approve unlimited — it's more convenient" },
      { label: "B", text: "Approve only the exact amount you need" },
      { label: "C", text: "Approve unlimited but revoke immediately after" },
      { label: "D", text: "Skip the approval and use a different wallet" },
    ],
    correctAnswer: "B",
    explanation:
      "Unlimited approvals give the contract permission to spend ALL your tokens — forever. If the contract is hacked or malicious, your entire balance is at risk. Always approve only the exact amount needed, or use a burner wallet.",
    topic: "Token Approval Safety",
  },
  {
    id: "puzzle-rug-pull",
    question:
      "A new token promises \"guaranteed 100x returns\" and the team is anonymous. What are the red flags?",
    choices: [
      { label: "A", text: "Anonymous team + guaranteed returns = likely rug pull" },
      { label: "B", text: "High returns are normal in crypto, just invest small" },
      { label: "C", text: "Check the Telegram group size to verify legitimacy" },
      { label: "D", text: "If it's listed on a DEX, it must be safe" },
    ],
    correctAnswer: "A",
    explanation:
      "No legitimate project can guarantee returns. Anonymous teams + unrealistic promises + no working product = textbook rug pull. Telegram members can be bought, and DEX listings are permissionless — anyone can list any token.",
    topic: "Rug Pull Detection",
  },
];

// ── Badges ──
export const badges: Badge[] = [
  {
    id: "badge-phishing",
    name: "Phishing Detector",
    description: "Identified and avoided a phishing attack",
    image: "🎣",
    rarity: "common",
    mintedAt: "2026-05-10",
    txHash: "0xabc123…def456",
    questId: "quest-phishing-phantom",
  },
  {
    id: "badge-seed-phrase",
    name: "Seed Guardian",
    description: "Protected seed phrase from social engineering",
    image: "🔐",
    rarity: "rare",
    mintedAt: "2026-05-12",
    txHash: "0x789ghi…jkl012",
    questId: "quest-seed-guardian",
  },
  {
    id: "badge-wallet-guard",
    name: "Wallet Guardian",
    description: "Learned to manage token approvals safely",
    image: "🛡️",
    rarity: "rare",
    mintedAt: "2026-05-14",
    txHash: "0xmno345…pqr678",
    questId: "quest-wallet-guardian",
  },
];

// ── Merchant Rewards ──
export const merchantRewards: MerchantReward[] = [
  {
    id: "reward-1",
    merchantName: "Crypto Coffee",
    merchantIcon: "☕",
    title: "Free Americano",
    requiredPoints: 200,
    description: "Enjoy a free Americano at any Crypto Coffee outlet.",
    category: "Food & Drink",
  },
  {
    id: "reward-2",
    merchantName: "BlockFit Gym",
    merchantIcon: "💪",
    title: "1-Day Free Pass",
    requiredPoints: 500,
    description: "Access any BlockFit gym for a full day.",
    category: "Fitness",
  },
  {
    id: "reward-3",
    merchantName: "NFT Gallery",
    merchantIcon: "🎨",
    title: "Exclusive NFT Frame",
    requiredPoints: 800,
    description: "Get a premium digital frame for your NFT collection.",
    category: "Digital",
  },
  {
    id: "reward-4",
    merchantName: "Web3 Academy",
    merchantIcon: "📚",
    title: "Premium Course Access",
    requiredPoints: 1200,
    description: "Unlock a premium Web3 safety course.",
    category: "Education",
  },
];

// ── Leaderboard ──
export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "CryptoNinja", avatar: "🥷", xp: 5200, badges: 15, streak: 21, isCurrentUser: false },
  { rank: 2, name: "BlockchainBoss", avatar: "👑", xp: 4800, badges: 13, streak: 18, isCurrentUser: false },
  { rank: 3, name: "DefiExplorer", avatar: "🧭", xp: 4200, badges: 12, streak: 14, isCurrentUser: false },
  { rank: 4, name: "Alex", avatar: "🕵️", xp: 2450, badges: 3, streak: 7, isCurrentUser: true },
  { rank: 5, name: "SatoshiFan", avatar: "⚡", xp: 2100, badges: 8, streak: 5, isCurrentUser: false },
  { rank: 6, name: "TokenHunter", avatar: "🎯", xp: 1800, badges: 6, streak: 4, isCurrentUser: false },
  { rank: 7, name: "SafeHodler", avatar: "🏦", xp: 1500, badges: 5, streak: 3, isCurrentUser: false },
  { rank: 8, name: "ChainWalker", avatar: "🚶", xp: 1200, badges: 4, streak: 2, isCurrentUser: false },
];

// ── Helper ──
export function getQuestById(id: string): Quest | undefined {
  return quests.find((q) => q.id === id);
}

export function getPuzzleById(id: string): Puzzle | undefined {
  return puzzles.find((p) => p.id === id);
}

export function getBadgeById(id: string): Badge | undefined {
  return badges.find((b) => b.id === id);
}
