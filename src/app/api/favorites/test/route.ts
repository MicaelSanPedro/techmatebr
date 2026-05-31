import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFavorites, toggleFavorite } from "@/lib/favorites";

// Test endpoint: directly call getFavorites and toggleFavorite with full logging
export async function POST(req: NextRequest) {
  const session = await auth();
  const log: string[] = [];

  log.push(`[1] Session exists: ${!!session}`);
  log.push(`[2] User exists: ${!!session?.user}`);
  log.push(`[3] AccessToken exists: ${!!session?.user?.accessToken}`);
  log.push(`[4] AccessToken prefix: ${session?.user?.accessToken?.substring(0, 8) || 'none'}`);
  log.push(`[5] User login: ${session?.user?.login || 'none'}`);

  if (!session?.user?.accessToken) {
    return NextResponse.json({ logs: log, error: "No access token" });
  }

  const token = session.user.accessToken;

  // Step 1: Test raw Gist list API call
  try {
    log.push(`[6] Fetching gist list...`);
    const gistRes = await fetch("https://api.github.com/gists", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    log.push(`[7] Gist list response: ${gistRes.status} ${gistRes.statusText}`);

    // Check scopes
    const scopes = gistRes.headers.get("X-OAuth-Scopes");
    log.push(`[8] Token scopes: ${scopes || 'none'}`);

    if (!gistRes.ok) {
      const errBody = await gistRes.text();
      log.push(`[9] Error body: ${errBody.substring(0, 200)}`);
      return NextResponse.json({ logs: log, error: "Gist API failed" });
    }

    const gists = await gistRes.json();
    log.push(`[10] Total gists: ${gists.length}`);
    log.push(`[11] Gist descriptions: ${gists.map((g: any) => g.description).join(", ")}`);

    // Step 2: Call getFavorites
    log.push(`[12] Calling getFavorites...`);
    const favorites = await getFavorites(token);
    log.push(`[13] getFavorites returned: ${JSON.stringify(favorites)}`);

    // Step 3: Try toggle
    const { testSlug } = await req.json();
    const slug = testSlug || "__test__slug__";
    log.push(`[14] Calling toggleFavorite for slug: ${slug}`);
    const isFav = await toggleFavorite(token, slug);
    log.push(`[15] toggleFavorite returned: ${isFav}`);

    // Step 4: Read back
    log.push(`[16] Reading favorites after toggle...`);
    const afterFavorites = await getFavorites(token);
    log.push(`[17] Favorites after toggle: ${JSON.stringify(afterFavorites)}`);

    // Step 5: Undo the test toggle
    log.push(`[18] Undoing test toggle...`);
    await toggleFavorite(token, slug);
    const finalFavorites = await getFavorites(token);
    log.push(`[19] Final favorites: ${JSON.stringify(finalFavorites)}`);

  } catch (error) {
    log.push(`[ERROR] ${error instanceof Error ? error.message : String(error)}`);
  }

  return NextResponse.json({ logs: log });
}
