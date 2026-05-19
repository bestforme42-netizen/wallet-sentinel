import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Move & Solve — AR Crypto Treasure Quest",
  description: "Explore real-world locations, solve crypto puzzles, earn NFT badges, and redeem rewards.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-dvh bg-navy-900 text-gray-200 antialiased">
        {children}
      </body>
    </html>
  );
}
