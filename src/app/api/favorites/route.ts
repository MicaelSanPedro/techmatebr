import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFavorites, toggleFavorite } from "@/lib/favorites";

export async function GET() {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return NextResponse.json({ favorites: [] });
  }
  const favorites = await getFavorites(session.user.accessToken);
  return NextResponse.json({ favorites });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  const isFavorite = await toggleFavorite(session.user.accessToken, slug);
  return NextResponse.json({ isFavorite });
}
