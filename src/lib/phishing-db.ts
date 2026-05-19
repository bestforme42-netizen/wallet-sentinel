// ============================================================
// Phishing URL Checker — heuristic + known patterns database
// ============================================================

export type PhishingResult = "safe" | "suspicious" | "dangerous";

export interface URLCheckResult {
  url: string;
  domain: string;
  result: PhishingResult;
  score: number; // 0-100, higher = more dangerous
  flags: string[];
  recommendation: string;
}

// Known phishing TLDs (cheap, commonly abused)
const SUSPICIOUS_TLDS = new Set([
  ".xyz", ".top", ".buzz", ".click", ".link", ".space", ".fun",
  ".icu", ".cam", ".lol", ".gdn", ".monster", ".surf", ".rest",
]);

// Known legitimate domains (whitelist)
const SAFE_DOMAINS = new Set([
  "etherscan.io", "basescan.org", "arbiscan.io", "polygonscan.com", "bscscan.com",
  "opensea.io", "uniswap.org", "aave.com", "compound.finance", "makerdao.com",
  "lido.fi", "curve.fi", "sushi.com", "pancakeswap.finance", "1inch.io",
  "metamask.io", "walletconnect.com", "coinbase.com", "binance.com",
  "ethereum.org", "base.org", "arbitrum.io", "optimism.io", "polygon.technology",
  "app.uniswap.org", "app.aave.com", "snapshot.org", "tally.xyz", "safe.global",
  "github.com", "twitter.com", "x.com", "discord.com", "telegram.org",
  "coingecko.com", "coinmarketcap.com", "defillama.com", "dune.com",
]);

// Known phishing keywords in domain
const PHISHING_KEYWORDS = [
  "airdrop", "claim", "verify", "restore", "seed-phrase", "seedphrase",
  "wallet-connect", "walletconnect", "metamask", "connect-wallet",
  "secure-wallet", "validate", "confirm-identity", "kyc-verify",
  "free-eth", "free-usdt", "giveaway", "reward-claim", "bonus-claim",
  "rectification", "synchroniz", "update-wallet", "fix-wallet",
  "drainer", "seaport", "blur-claim",
];

// Suspicious URL patterns
const SUSPICIOUS_PATTERNS = [
  { pattern: /https?:\/\/[^/]*\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, label: "Raw IP address in URL" },
  { pattern: /@/, label: "@ symbol in URL (URL obfuscation)" },
  { pattern: /\.com\.[a-z]/, label: "Nested domain (possible impersonation)" },
  { pattern: /-[a-z0-9]{8,}\./, label: "Random hash in subdomain" },
  { pattern: /(metamask|uniswap|opensea|aave|blur)[^.]*(?:\.com|\.org|\.io|\.net|\.app)/i, label: "Brand name in suspicious domain" },
  { pattern: /(?:bit\.ly|tinyurl|t\.co|goo\.gl|is\.gd|shorturl)/i, label: "Shortened URL (hides real destination)" },
  { pattern: /(?:\.zip|\.mov)$/i, label: "Dangerous TLD (.zip/.mov confusion attacks)" },
  { pattern: /punycode|xn--/i, label: "Punycode domain (homograph attack)" },
];

/**
 * Analyze a URL for phishing indicators.
 */
export function checkURL(rawUrl: string): URLCheckResult {
  let url = rawUrl.trim();
  if (!url.startsWith("http")) url = "https://" + url;

  let domain = "";
  try {
    domain = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return {
      url: rawUrl,
      domain: "invalid",
      result: "dangerous",
      score: 100,
      flags: ["Invalid URL format"],
      recommendation: "This doesn't appear to be a valid URL. Do not interact with it.",
    };
  }

  const flags: string[] = [];
  let score = 0;

  // Check whitelist
  const isWhitelisted = SAFE_DOMAINS.has(domain) || Array.from(SAFE_DOMAINS).some((safe) => domain.endsWith("." + safe));
  if (isWhitelisted) {
    return {
      url: rawUrl,
      domain,
      result: "safe",
      score: 0,
      flags: ["Known legitimate domain"],
      recommendation: "This appears to be a known, trusted domain.",
    };
  }

  // Check suspicious TLD
  const tld = "." + domain.split(".").pop();
  if (SUSPICIOUS_TLDS.has(tld)) {
    flags.push(`Suspicious TLD: ${tld}`);
    score += 15;
  }

  // Check phishing keywords in domain
  const domainLC = domain.toLowerCase();
  for (const kw of PHISHING_KEYWORDS) {
    if (domainLC.includes(kw)) {
      flags.push(`Phishing keyword in domain: "${kw}"`);
      score += 25;
    }
  }

  // Check suspicious URL patterns
  for (const sp of SUSPICIOUS_PATTERNS) {
    if (sp.pattern.test(url)) {
      flags.push(sp.label);
      score += 20;
    }
  }

  // Check for excessive subdomains
  const subdomainCount = domain.split(".").length - 2;
  if (subdomainCount > 2) {
    flags.push(`Excessive subdomains (${subdomainCount})`);
    score += 10;
  }

  // Check for HTTPS
  if (!url.startsWith("https://")) {
    flags.push("No HTTPS (insecure)");
    score += 10;
  }

  // Domain length
  if (domain.length > 30) {
    flags.push("Unusually long domain name");
    score += 5;
  }

  // Hyphen count
  const hyphenCount = (domain.match(/-/g) || []).length;
  if (hyphenCount > 3) {
    flags.push("Excessive hyphens in domain");
    score += 10;
  }

  // Clamp
  score = Math.min(100, score);

  // Determine result
  let result: PhishingResult;
  if (score >= 60) result = "dangerous";
  else if (score >= 30) result = "suspicious";
  else result = "safe";

  // Recommendation
  const recommendation =
    result === "dangerous"
      ? "🚨 DO NOT interact with this URL. High probability of phishing."
      : result === "suspicious"
        ? "⚠️ Exercise extreme caution. Verify the URL through official channels before interacting."
        : "No obvious phishing indicators, but always verify through official sources.";

  return { url: rawUrl, domain, result, score, flags, recommendation };
}
