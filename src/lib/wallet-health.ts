// ============================================================
// Wallet Health Score — aggregate approval risk into 0-100
// ============================================================

export interface HealthReport {
  score: number; // 0-100, higher = healthier
  grade: "A" | "B" | "C" | "D" | "F";
  totalApprovals: number;
  unlimitedApprovals: number;
  riskyApprovals: number;
  chainBreakdown: { chain: string; count: number; risk: number }[];
  tips: string[];
  summary: string;
}

export function calculateHealth(approvals: {
  risk: { level: string };
  chainName: string;
  isUnlimited: boolean;
}[]): HealthReport {
  const total = approvals.length;
  const unlimited = approvals.filter((a) => a.isUnlimited).length;
  const risky = approvals.filter((a) => ["critical", "high"].includes(a.risk.level)).length;

  let score = 100;

  // Deductions
  score -= unlimited * 8;     // -8 per unlimited approval
  score -= risky * 12;        // -12 per high/critical
  score -= (total - risky - unlimited) * 2; // -2 per remaining

  // Bonus for having 0 approvals
  if (total === 0) score = 100;

  score = Math.max(0, Math.min(100, score));

  // Grade
  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 50 ? "C" : score >= 25 ? "D" : "F";

  // Chain breakdown
  const chainMap = new Map<string, { count: number; risk: number }>();
  for (const a of approvals) {
    const existing = chainMap.get(a.chainName) || { count: 0, risk: 0 };
    existing.count++;
    if (["critical", "high"].includes(a.risk.level)) existing.risk++;
    chainMap.set(a.chainName, existing);
  }
  const chainBreakdown = Array.from(chainMap.entries()).map(([chain, data]) => ({ chain, ...data }));

  // Tips
  const tips: string[] = [];
  if (unlimited > 0) tips.push(`You have ${unlimited} unlimited approvals. Revoke any you don't actively use.`);
  if (risky > 0) tips.push(`${risky} approvals are flagged as high/critical risk. Review them immediately.`);
  if (total > 20) tips.push("You have many active approvals. Consider periodic cleanup.");
  if (score >= 90) tips.push("Great job! Your wallet is in excellent health.");
  if (tips.length === 0) tips.push("Keep monitoring your approvals regularly.");

  const summary =
    grade === "A" ? "Excellent — your wallet is well-protected." :
    grade === "B" ? "Good — a few approvals could be cleaned up." :
    grade === "C" ? "Fair — several risky approvals need attention." :
    grade === "D" ? "Poor — significant risks detected. Take action now." :
    "Critical — your wallet is at high risk of being drained.";

  return { score, grade, totalApprovals: total, unlimitedApprovals: unlimited, riskyApprovals: risky, chainBreakdown, tips, summary };
}
