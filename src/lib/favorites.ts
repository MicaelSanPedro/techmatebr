const GIST_FILENAME = "techmate-favorites.json";
const GIST_DESCRIPTION = "TechMate Blog Favorites";

interface FavoritesData {
  favorites: string[];
}

async function getGist(accessToken: string): Promise<{ id: string; data: FavoritesData } | null> {
  const res = await fetch("https://api.github.com/gists", {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
  });
  const gists = await res.json();
  const gist = gists.find((g: any) => g.description === GIST_DESCRIPTION && g.files[GIST_FILENAME]);
  if (!gist) return null;
  const content = JSON.parse(gist.files[GIST_FILENAME].content);
  return { id: gist.id, data: content };
}

async function createGist(accessToken: string, data: FavoritesData): Promise<string> {
  const res = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
    body: JSON.stringify({
      description: GIST_DESCRIPTION,
      public: false,
      files: { [GIST_FILENAME]: { content: JSON.stringify(data) } },
    }),
  });
  const gist = await res.json();
  return gist.id;
}

async function updateGist(accessToken: string, gistId: string, data: FavoritesData): Promise<void> {
  await fetch(`https://api.github.com/gists/${gistId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
    body: JSON.stringify({
      files: { [GIST_FILENAME]: { content: JSON.stringify(data) } },
    }),
  });
}

export async function getFavorites(accessToken: string): Promise<string[]> {
  const gist = await getGist(accessToken);
  return gist ? gist.data.favorites : [];
}

export async function toggleFavorite(accessToken: string, slug: string): Promise<boolean> {
  const gist = await getGist(accessToken);
  const favorites = gist ? gist.data.favorites : [];
  const index = favorites.indexOf(slug);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(slug);
  }
  const data = { favorites };
  if (gist) {
    await updateGist(accessToken, gist.id, data);
  } else {
    await createGist(accessToken, data);
  }
  return index === -1; // returns true if added, false if removed
}
