// ============================================================
// Multi-chain configuration
// ============================================================

export interface ChainConfig {
  id: number;
  name: string;
  shortName: string;
  rpc: string;
  explorer: string;
  explorerApi?: string;
  nativeCurrency: string;
  icon: string;
  color: string;
}

export const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    id: 1,
    name: "Ethereum",
    shortName: "ETH",
    rpc: "https://eth.llamarpc.com",
    explorer: "https://etherscan.io",
    explorerApi: "https://api.etherscan.io/api",
    nativeCurrency: "ETH",
    icon: "⟠",
    color: "#627EEA",
  },
  {
    id: 8453,
    name: "Base",
    shortName: "BASE",
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    explorerApi: "https://api.basescan.org/api",
    nativeCurrency: "ETH",
    icon: "🔵",
    color: "#0052FF",
  },
  {
    id: 42161,
    name: "Arbitrum",
    shortName: "ARB",
    rpc: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io",
    explorerApi: "https://api.arbiscan.io/api",
    nativeCurrency: "ETH",
    icon: "🔷",
    color: "#28A0F0",
  },
  {
    id: 10,
    name: "Optimism",
    shortName: "OP",
    rpc: "https://mainnet.optimism.io",
    explorer: "https://optimistic.etherscan.io",
    explorerApi: "https://api-optimistic.etherscan.io/api",
    nativeCurrency: "ETH",
    icon: "🔴",
    color: "#FF0420",
  },
  {
    id: 137,
    name: "Polygon",
    shortName: "MATIC",
    rpc: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com",
    explorerApi: "https://api.polygonscan.com/api",
    nativeCurrency: "POL",
    icon: "🟣",
    color: "#8247E5",
  },
  {
    id: 56,
    name: "BSC",
    shortName: "BSC",
    rpc: "https://bsc-dataseed1.binance.org",
    explorer: "https://bscscan.com",
    explorerApi: "https://api.bscscan.com/api",
    nativeCurrency: "BNB",
    icon: "🟡",
    color: "#F0B90B",
  },
  {
    id: 43114,
    name: "Avalanche",
    shortName: "AVAX",
    rpc: "https://api.avax.network/ext/bc/C/rpc",
    explorer: "https://snowtrace.io",
    explorerApi: "https://api.snowtrace.io/api",
    nativeCurrency: "AVAX",
    icon: "🔺",
    color: "#E84142",
  },
  {
    id: 84532,
    name: "Base Sepolia",
    shortName: "BASE-SEP",
    rpc: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    explorerApi: "https://api-sepolia.basescan.org/api",
    nativeCurrency: "ETH",
    icon: "🔵",
    color: "#0052FF",
  },
];

export function getChainById(id: number): ChainConfig | undefined {
  return SUPPORTED_CHAINS.find((c) => c.id === id);
}

export function getChainByName(name: string): ChainConfig | undefined {
  return SUPPORTED_CHAINS.find(
    (c) => c.shortName.toLowerCase() === name.toLowerCase() || c.name.toLowerCase() === name.toLowerCase()
  );
}
