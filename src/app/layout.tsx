import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wallet Sentinel — Autonomous Wallet Security Agent",
  description: "AI-powered wallet monitoring. Detects risky approvals, scam tokens, and drain attempts before it's too late.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grid-bg scanlines">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
