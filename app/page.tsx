import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { getSession } from "@/lib/auth";
import { logoutAction } from "./login/actions";
import RosterClient from "./RosterClient";
import Link from "next/link";

// --- 1. TYPES & MOCK DATA ---

async function getCharacters() {
  const session = await getSession();
  const startTime = performance.now();

  const currentUserId = session?.userId;
  // Query database directly on the server
  const dbCharacters = await prisma.character.findMany({
    include: {
      job: true,
      attribute: true,
      rarity: true,
      _count: {
        select: { likes: true },
      },
      likes: currentUserId
        ? {
          where: { userId: currentUserId },
          select: { id: true },
        }
        : false,
    },
    orderBy: {
      likes: {
        _count: 'desc'
      }
    }
  });
  const durationMs = Math.round(performance.now() - startTime);

  logger.info(
    { count: dbCharacters.length, durationMs },
    "Successfully fetched character roster"
  );

  return dbCharacters.map((char) => ({
    id: char.id,
    name: char.name,
    job: char.job,
    attribute: char.attribute,
    rarity: char.rarity,
    bio: char.bio,
    imageUrl: char.imageUrl,
    stats: {
      hp: char.hp ?? 50,
      attack: char.attack ?? 50,
      defense: char.defense ?? 50,
      speed: char.speed ?? 50,
    },
    likeCount: char._count.likes,
    isLiked: char.likes ? char.likes.length > 0 : false,
  }));
}

export type CharacterData = Awaited<ReturnType<typeof getCharacters>>[number];

export default async function RosterPage() {
  const session = await getSession();

  logger.info("Fetching character roaster from database...");

  let characters: CharacterData[] = [];

  try
  {
    // Transform database fields to fit UI layout
    characters = await getCharacters();
  } catch (error)
  {
    logger.error({ err: error }, "Failed to fetch character roster");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Header Bar */}
      <header className="border-b border-gray-800 bg-gray-900/50 px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight">Character Roster</h1>
          {session?.role === "ADMIN" && (
            <span className="self-start sm:self-auto px-2 py-0.5 text-xs font-mono rounded border border-indigo-500/40 bg-indigo-500/20 text-indigo-300">
              ADMIN
            </span>
          )}
        </div>

        {/* <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4 text-sm">
          {session?.role === "ADMIN" && (
            <span></span>
          )}

          {session?.role === "ADMIN" && (
            <Link
              href="/admin/characters/new"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
            >
              + Add Hero
            </Link>
          )}

          <span className="text-xs font-mono text-gray-400">
            {session?.name}
          </span>

          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700"
            >
              {session?.role === "GUEST" || !session ? "Login" : "Logout"}
            </button>
          </form>
        </div> */}

        <div className="flex flex-col-reverse sm:flex-row-reverse sm:items-center sm:justify-end gap-2 sm:gap-4">
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="text-xs font-mono text-gray-400">
              {session?.name}
            </span>

            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700"
              >
                {session?.role === "GUEST" || !session ? "Login" : "Logout"}
              </button>
            </form>
          </div>

          {session?.role === "ADMIN" && (
            <Link
              href="/admin/characters/new"
              className="self-end sm:self-auto rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
            >
              + Add Hero
            </Link>
          )}
        </div>
      </header>

      {/* Roster View */}
      <main className="p-6">
        <RosterClient characters={characters} userRole={session?.role} userId={session?.userId} />
      </main>
    </div>
  );
}