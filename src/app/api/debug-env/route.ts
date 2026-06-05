import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasGithubId: !!process.env.AUTH_GITHUB_ID,
    hasGithubSecret: !!process.env.AUTH_GITHUB_SECRET,
    githubIdPrefix: process.env.AUTH_GITHUB_ID?.substring(0, 8) || "MISSING",
    hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
    hasGoogleSecret: !!process.env.AUTH_GOOGLE_SECRET,
    googleIdPrefix: process.env.AUTH_GOOGLE_ID?.substring(0, 10) || "MISSING",
    hasAuthSecret: !!process.env.AUTH_SECRET,
    authSecretLength: process.env.AUTH_SECRET?.length || 0,
    nextauthUrl: process.env.NEXTAUTH_URL || "MISSING",
  });
}
