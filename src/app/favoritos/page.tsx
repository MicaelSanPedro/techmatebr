import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllPosts } from "@/lib/posts";
import FavoritesPageClient from "./FavoritesPageClient";

export default async function FavoritosPage() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
  const allPosts = getAllPosts();
  return <FavoritesPageClient allPosts={allPosts} />;
}
