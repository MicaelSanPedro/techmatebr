import { kv } from "@vercel/kv";

const PREFIX = "techmate:favorites:";

/**
 * Get favorites for a user by email (works for both GitHub and Google)
 */
export async function getFavorites(email: string): Promise<string[]> {
  try {
    const data = await kv.get<string[]>(`${PREFIX}${email}`);
    return data || [];
  } catch (error) {
    console.error("[getFavorites] KV error:", error);
    return [];
  }
}

/**
 * Toggle a favorite for a user by email
 */
export async function toggleFavorite(email: string, slug: string): Promise<boolean> {
  try {
    const current = await getFavorites(email);
    const index = current.indexOf(slug);
    let updated: string[];

    if (index > -1) {
      updated = current.filter((s) => s !== slug);
    } else {
      updated = [...current, slug];
    }

    await kv.set(`${PREFIX}${email}`, updated);
    return index === -1;
  } catch (error) {
    console.error("[toggleFavorite] KV error:", error);
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
 * Migrate favorites from GitHub Gist to KV store.
 * Called once when a GitHub user first accesses favorites after migration.
 */
export async function migrateGistToKv(
  email: string,
  accessToken: string
): Promise<string[]> {
  try {
    const gistId = await findGistId(accessToken);
    if (!gistId) return [];

    const gistFavorites = await fetchGistById(accessToken, gistId);
    if (!gistFavorites || gistFavorites.length === 0) return [];

    // Save to KV
    await kv.set(`${PREFIX}${email}`, gistFavorites);
    console.log(`[migrateGistToKv] Migrated ${gistFavorites.length} favorites from Gist to KV for ${email}`);
    return gistFavorites;
  } catch (error) {
    console.error("[migrateGistToKv] Error:", error);
    return [];
  }
}
