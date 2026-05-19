import { NextRequest, NextResponse } from "next/server";
import { checkURL } from "@/lib/phishing-db";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  return NextResponse.json(checkURL(url));
}
