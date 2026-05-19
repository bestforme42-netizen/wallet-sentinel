"use client";

export type RiskLevel = "safe" | "low" | "medium" | "high" | "critical";

export type ApprovalRecord = {
  token: string;
  tokenName: string;
  tokenSymbol: string;
  spender: string;
  amount: string;
  amountFormatted: string;
  isUnlimited: boolean;
  blockNumber: number;
  txHash: string;
  timestamp: number;
};

export type RiskReport = {
  approval: ApprovalRecord;
  risk: RiskLevel;
  reasons: string[];
  recommendation: string;
};

// Known safe spenders (whitelisted). In production this comes from a curated DB.
const KNOWN_SAFE_SPENDERS = new Set<string>([
  // Uniswap V3 Router on Base mainnet & Sepolia
  "0x2626664c2603336E57B271c5C0b26F421741e481".toLowerCase(),
  "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD".toLowerCase(),
  "0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4".toLowerCase(), // Uniswap Sepolia
  // Base Bridge
  "0x4200000000000000000000000000000000000010".toLowerCase(),
]);

// Known high-risk patterns
const RISK_RULES: Array<{
  name: string;
  check: (appr: ApprovalRecord) => boolean;
  level: RiskLevel;
  recommendation: string;
}> = [
  {
    name: "unlimited_approval",
    check: (a) => a.isUnlimited,
    level: "high",
    recommendation: "Replace with exact amount or use Permit2 with max amount.",
  },
  {
    name: "unlimited_to_unknown",
    check: (a) => a.isUnlimited && !KNOWN_SAFE_SPENDERS.has(a.spender.toLowerCase()),
    level: "critical",
    recommendation: "Revoke immediately — unlimited approval to unknown contract.",
  },
  {
    name: "approval_to_eoa",
    check: (a) =>
      !KNOWN_SAFE_SPENDERS.has(a.spender.toLowerCase()) &&
      a.spender === "0x0000000000000000000000000000000000000000", // placeholder
    level: "critical",
    recommendation: "EOA approvals are never safe. Revoke immediately.",
  },
  {
    name: "exceeds_balance",
    check: (a) => {
      const amount = parseFloat(a.amountFormatted);
      return amount > 0 && !a.isUnlimited && amount < 1e12; // reasonable amount but still flag
    },
    level: "low",
    recommendation: "Consider revoking when not actively using the protocol.",
  },
];

export function scoreApproval(appr: ApprovalRecord): RiskReport {
  const triggered = RISK_RULES.filter((rule) => rule.check(appr));

  let risk: RiskLevel = "safe";
  const reasons: string[] = [];

  for (const rule of triggered) {
    reasons.push(rule.name);
    const levels: RiskLevel[] = ["safe", "low", "medium", "high", "critical"];
    if (levels.indexOf(rule.level) > levels.indexOf(risk)) {
      risk = rule.level;
    }
  }

  // If unknown spender and not in known safe, at least medium
  if (!KNOWN_SAFE_SPENDERS.has(appr.spender.toLowerCase()) && risk === "safe") {
    risk = "medium";
    reasons.push("unknown_spender");
  }

  const recommendation =
    triggered.find((r) => r.level === risk)?.recommendation ??
    "Low risk. Consider revoking when not actively using the protocol.";

  return { approval: appr, risk, reasons, recommendation };
}

export function scoreAll(approvals: ApprovalRecord[]): RiskReport[] {
  return approvals.map(scoreApproval).sort((a, b) => {
    const levels: RiskLevel[] = ["safe", "low", "medium", "high", "critical"];
    return levels.indexOf(b.risk) - levels.indexOf(a.risk);
  });
}
