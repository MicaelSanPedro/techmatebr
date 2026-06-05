import Redis from "ioredis";

const PREFIX = "techmate:favorites:";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    const url = process.env.REDIS_URL;
    if (!url) {
      throw new Error("REDIS_URL environment variable is not set");
    }
    redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    });
  }
  return redis;
}

/**
 * Get favorites for a user by email (works for both GitHub and Google)
 */
export async function getFavorites(email: string): Promise<string[]> {
  try {
    const r = getRedis();
    const data = await r.get(`${PREFIX}${email}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("[getFavorites] Redis error:", error);
    return [];
  }
}

/**
 * Toggle a favorite for a user by email
 */
export async function toggleFavorite(email: string, slug: string): Promise<boolean> {
  try {
    const r = getRedis();
    const current = await getFavorites(email);
    const index = current.indexOf(slug);
    let updated: string[];

    if (index > -1) {
      updated = current.filter((s) => s !== slug);
    } else {
      updated = [...current, slug];
    }

    await r.set(`${PREFIX}${email}`, JSON.stringify(updated));
    return index === -1;
  } catch (error) {
    console.error("[toggleFavorite] Redis error:", error);
    return index > -1;
  }
}

// ── Legacy Gist-based storage (for migration) ──

const GIST_FILENAME = "techmate-favorites.json";
const GIST_DESCRIPTION = "TechMate Blog Favorites";

interface FavoritesData {
  favorites: string[];
}

interface GistFile {
  filename: string;
  content: string | null;
}

interface GistListItem {
  id: string;
  description: string;
  files: Record<string, GistFile>;
}

async function findGistId(accessToken: string): Promise<string | null> {
  const res = await fetch("https://api.github.com/gists?per_page=100", {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) return null;
  const gists: GistListItem[] = await res.json();
  const gist = gists.find(
    (g) => g.description === GIST_DESCRIPTION && g.files[GIST_FILENAME]
  );
  return gist?.id || null;
}

async function fetchGistById(accessToken: string, gistId: string): Promise<string[] | null> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) return null;
  const gist: GistListItem = await res.json();
  const file = gist.files[GIST_FILENAME];
  if (!file?.content) return null;
  try {
    const data: FavoritesData = JSON.parse(file.content);
    return data.favorites;
  } catch {
    return null;
  }
}

/**
 * Migrate favorites from GitHub Gist to Redis.
 * Called once when a GitHub user first accesses favorites after migration.
 */
export async function migrateGistToRedis(
  email: string,
  accessToken: string
): Promise<string[]> {
  try {
    const gistId = await findGistId(accessToken);
    if (!gistId) return [];

    const gistFavorites = await fetchGistById(accessToken, gistId);
    if (!gistFavorites || gistFavorites.length === 0) return [];

    // Save to Redis
    const r = getRedis();
    await r.set(`${PREFIX}${email}`, JSON.stringify(gistFavorites));
    console.log(`[migrateGistToRedis] Migrated ${gistFavorites.length} favorites from Gist to Redis for ${email}`);
    return gistFavorites;
  } catch (error) {
    console.error("[migrateGistToRedis] Error:", error);
    return [];
  }
}
