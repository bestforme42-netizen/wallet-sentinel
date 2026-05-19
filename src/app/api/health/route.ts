import { NextRequest, NextResponse } from "next/server";
import { calculateHealth } from "@/lib/wallet-health";

export async function POST(req: NextRequest) {
  try {
    const { approvals } = await req.json();
    const report = calculateHealth(approvals || []);
    return NextResponse.json(report);
  } catch {
    return NextResponse.json({ error: "Health check failed" }, { status: 500 });
  }
}
