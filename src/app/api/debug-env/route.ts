import { NextResponse } from "next/server";

export async function GET() {
  // List all env vars that start with AUTH or NEXT
  const relevant = Object.keys(process.env)
    .filter(k => k.startsWith("AUTH") || k.startsWith("NEXT") || k.startsWith("VERCEL"))
    .sort();
  
  const result: Record<string, string> = {};
  for (const key of relevant) {
    result[key] = process.env[key]!.substring(0, 20) + "...";
  }
  
  return NextResponse.json({
    count: relevant.length,
    keys: relevant,
    values: result,
  });
}
