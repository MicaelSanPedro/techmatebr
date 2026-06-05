import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFavorites, toggleFavorite, migrateGistToRedis } from "@/lib/favorites";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ favorites: [] });
    }

    const email = session.user.email;
    if (!email) {
      return NextResponse.json({ favorites: [] });
    }

    // First time: migrate GitHub Gist favorites to Redis (if user has GitHub token)
    if (session.user.accessToken) {
      const redisFavs = await getFavorites(email);
      if (redisFavs.length === 0) {
        // Check if they have existing Gist favorites to migrate
        const migrated = await migrateGistToRedis(email, session.user.accessToken);
        return NextResponse.json({ favorites: migrated });
      }
      return NextResponse.json({ favorites: redisFavs });
    }

    // Google users (or any user without GitHub token) - read from Redis directly
    const favorites = await getFavorites(email);
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("[GET /api/favorites] Error:", error);
    return NextResponse.json({ favorites: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 401 });
    }

    const body = await req.json();
    const slug = body?.slug;
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    const isFavorite = await toggleFavorite(email, slug);
    return NextResponse.json({ isFavorite });
  } catch (error) {
    console.error("[POST /api/favorites] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
