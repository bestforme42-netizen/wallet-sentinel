// ============================================================
// Smart Contract Safety Checker — heuristic analysis engine
// ============================================================

export type SafetyLevel = "safe" | "warning" | "danger" | "unknown";

export interface SCRiskFactor {
  label: string;
  description: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  icon: string;
}

export interface SCCheckResult {
  address: string;
  chainId: number;
  chainName: string;
  isContract: boolean;
  isVerified: boolean;
  isProxy: boolean;
  isHoneypot: boolean;
  hasDangerousFunctions: boolean;
  hasMintFunction: boolean;
  hasPauseFunction: boolean;
  hasBlacklist: boolean;
  hasSelfDestruct: boolean;
  ownerCanChangeFees: boolean;
  ageInDays: number | null;
  txCount: number;
  riskFactors: SCRiskFactor[];
  safetyLevel: SafetyLevel;
  safetyScore: number; // 0-100, higher = safer
  summary: string;
}

// Known dangerous function selectors
const DANGEROUS_SELECTORS: Record<string, string> = {
  "0x8da5cb5b": "transferOwnership(address)",
  "0xf2fde38b": "transferOwnership(address)",
  "0x715018a6": "renounceOwnership()",
  "0x3ccfd60b": "withdraw()",
  "0x8b95dd71": "setFee(uint256)",
  "0xa9059cbb": "transfer(address,uint256)",
  "0x23b872dd": "transferFrom(address,address,uint256)",
  "0x095ea7b3": "approve(address,uint256)",
  "0xa0712d68": "mint(uint256)",
  "0x40c10f19": "mint(address,uint256)",
  "0x3f4ba83a": "unpause()",
  "0x8456cb59": "pause()",
  "0x46423aa7": "setSwapAndLiquifyEnabled(bool)",
  "0xc02a86c2": "setMaxTxPercent(uint256)",
  "0x5342acb4": "updateBlacklist(address[],bool)",
  "0x70a08231": "balanceOf(address)",
  "0x159a0288": "setFees(uint256,uint256)",
  "0xeee97214": "addLiquidityFee(uint256)",
};

// Known safe protocol patterns
const SAFE_PATTERNS = [
  "uniswap", "aave", "compound", "maker", "curve", "lido",
  "opensea", "ens", "eas", "safe", "gnosis", "1inch",
  "paraswap", "0x", "kyber", "sushiswap", "balancer",
];

/**
 * Analyze contract bytecode for dangerous patterns.
 * This is a simplified heuristic — production would use deeper bytecode analysis.
 */
export function analyzeBytecode(bytecode: string): {
  hasSelfDestruct: boolean;
  hasDangerousCalls: boolean;
  hasMint: boolean;
  hasPause: boolean;
  hasBlacklist: boolean;
  suspiciousPatterns: string[];
} {
  const code = bytecode.toLowerCase();
  const suspicious: string[] = [];

  // SELFDESTRUCT opcode = 0xff
  const hasSelfDestruct = code.includes("ff") && code.length > 100;

  // Check for known dangerous function selectors in bytecode
  const foundSelectors: string[] = [];
  for (const [selector, name] of Object.entries(DANGEROUS_SELECTORS)) {
    if (code.includes(selector.slice(2))) {
      foundSelectors.push(name);
    }
  }

  const hasDangerousCalls = foundSelectors.length > 3;
  const hasMint = foundSelectors.some((s) => s.startsWith("mint"));
  const hasPause = foundSelectors.some((s) => s.includes("pause"));
  const hasBlacklist = foundSelectors.some((s) => s.includes("Blacklist") || s.includes("blacklist"));

  if (hasDangerousCalls) suspicious.push("Multiple dangerous function selectors detected");
  if (hasMint) suspicious.push("Mint function found — unlimited supply risk");
  if (hasPause) suspicious.push("Pause function found — can freeze transfers");
  if (hasBlacklist) suspicious.push("Blacklist function found — can block addresses");

  return {
    hasSelfDestruct,
    hasDangerousCalls,
    hasMint,
    hasPause,
    hasBlacklist,
    suspiciousPatterns: suspicious,
  };
}

/**
 * Build SCCheckResult from raw data.
 */
export function buildSCResult(params: {
  address: string;
  chainId: number;
  chainName: string;
  bytecode: string;
  isVerified: boolean;
  isProxy: boolean;
  txCount: number;
  ageInDays: number | null;
  contractName?: string;
}): SCCheckResult {
  const { address, chainId, chainName, bytecode, isVerified, isProxy, txCount, ageInDays, contractName } = params;

  const isContract = bytecode.length > 4; // "0x" + empty or very short = EOA

  if (!isContract) {
    return {
      address,
      chainId,
      chainName,
      isContract: false,
      isVerified: false,
      isProxy: false,
      isHoneypot: false,
      hasDangerousFunctions: false,
      hasMintFunction: false,
      hasPauseFunction: false,
      hasBlacklist: false,
      hasSelfDestruct: false,
      ownerCanChangeFees: false,
      ageInDays: null,
      txCount: 0,
      riskFactors: [{ label: "Not a Contract", description: "This address is an EOA (wallet), not a smart contract.", severity: "info", icon: "ℹ️" }],
      safetyLevel: "unknown",
      safetyScore: 50,
      summary: "This is a regular wallet address, not a smart contract.",
    };
  }

  const bytecodeAnalysis = analyzeBytecode(bytecode);
  const riskFactors: SCRiskFactor[] = [];
  let score = 80; // Start optimistic

  // Contract name / known protocol check
  const nameLC = (contractName || "").toLowerCase();
  const isKnownProtocol = SAFE_PATTERNS.some((p) => nameLC.includes(p));

  if (isKnownProtocol) {
    riskFactors.push({ label: "Known Protocol", description: `Matches known DeFi protocol pattern: ${contractName}`, severity: "info", icon: "✅" });
    score += 10;
  }

  // Verified source
  if (isVerified) {
    riskFactors.push({ label: "Source Verified", description: "Contract source code is verified on the block explorer.", severity: "info", icon: "✅" });
    score += 10;
  } else {
    riskFactors.push({ label: "Unverified Source", description: "Contract source code is NOT verified. Cannot audit logic.", severity: "medium", icon: "⚠️" });
    score -= 20;
  }

  // Proxy
  if (isProxy) {
    riskFactors.push({ label: "Proxy Contract", description: "This is a proxy — implementation can be upgraded by the admin.", severity: "medium", icon: "🔄" });
    score -= 10;
  }

  // Age
  if (ageInDays !== null) {
    if (ageInDays < 1) {
      riskFactors.push({ label: "Brand New", description: "Contract deployed less than 24 hours ago. Extremely high risk.", severity: "critical", icon: "🆕" });
      score -= 30;
    } else if (ageInDays < 7) {
      riskFactors.push({ label: "Very New", description: `Contract is only ${ageInDays} days old. Proceed with caution.`, severity: "high", icon: "🕐" });
      score -= 15;
    } else if (ageInDays < 30) {
      riskFactors.push({ label: "Relatively New", description: `Contract is ${ageInDays} days old.`, severity: "low", icon: "🕐" });
      score -= 5;
    } else {
      riskFactors.push({ label: "Established", description: `Contract has been active for ${ageInDays} days.`, severity: "info", icon: "🕐" });
    }
  }

  // Transaction count
  if (txCount < 10) {
    riskFactors.push({ label: "Low Activity", description: `Only ${txCount} transactions. May be abandoned or rarely used.`, severity: "low", icon: "📉" });
    score -= 5;
  } else if (txCount > 1000) {
    riskFactors.push({ label: "High Activity", description: `${txCount.toLocaleString()} transactions. Widely used.`, severity: "info", icon: "📈" });
    score += 5;
  }

  // Bytecode analysis flags
  if (bytecodeAnalysis.hasSelfDestruct) {
    riskFactors.push({ label: "SELFDESTRUCT Detected", description: "Contract contains self-destruct opcode. Can be permanently destroyed.", severity: "critical", icon: "💣" });
    score -= 25;
  }

  if (bytecodeAnalysis.hasMint) {
    riskFactors.push({ label: "Mint Function", description: "Contract can mint new tokens. Potential unlimited supply.", severity: "high", icon: "🏭" });
    score -= 15;
  }

  if (bytecodeAnalysis.hasPause) {
    riskFactors.push({ label: "Pause Function", description: "Contract owner can pause all transfers.", severity: "medium", icon: "⏸️" });
    score -= 10;
  }

  if (bytecodeAnalysis.hasBlacklist) {
    riskFactors.push({ label: "Blacklist Function", description: "Contract can blacklist addresses from transacting.", severity: "high", icon: "🚫" });
    score -= 15;
  }

  if (bytecodeAnalysis.hasDangerousCalls) {
    riskFactors.push({ label: "Dangerous Functions", description: "Multiple admin/owner functions detected in bytecode.", severity: "high", icon: "⚠️" });
    score -= 15;
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine safety level
  let safetyLevel: SafetyLevel;
  if (score >= 70) safetyLevel = "safe";
  else if (score >= 50) safetyLevel = "warning";
  else safetyLevel = "danger";

  // Honeypot heuristic: very low score + unverified + danger functions
  const isHoneypot = score < 30 && !isVerified && bytecodeAnalysis.hasDangerousCalls;

  // Summary
  const summary =
    safetyLevel === "safe"
      ? "This contract appears relatively safe based on available data. Always DYOR."
      : safetyLevel === "warning"
        ? "This contract has some risk factors. Review carefully before interacting."
        : "This contract has significant risk factors. Interacting may result in loss of funds.";

  return {
    address,
    chainId,
    chainName,
    isContract,
    isVerified,
    isProxy,
    isHoneypot,
    hasDangerousFunctions: bytecodeAnalysis.hasDangerousCalls,
    hasMintFunction: bytecodeAnalysis.hasMint,
    hasPauseFunction: bytecodeAnalysis.hasPause,
    hasBlacklist: bytecodeAnalysis.hasBlacklist,
    hasSelfDestruct: bytecodeAnalysis.hasSelfDestruct,
    ownerCanChangeFees: false,
    ageInDays,
    txCount,
    riskFactors,
    safetyLevel,
    safetyScore: score,
    summary,
  };
}
