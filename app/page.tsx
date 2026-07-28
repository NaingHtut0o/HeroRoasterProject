import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { getSession } from "@/lib/auth";
import { logoutAction } from "./login/actions";
import RosterClient from "./RosterClient";
import Link from "next/link";

// --- 1. TYPES & MOCK DATA ---

async function getCharacters() {
  const startTime = performance.now();
  // Query database directly on the server
  const dbCharacters = await prisma.character.findMany({
    include: {
      job: true,
      attribute: true,
      rarity: true,
    },
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
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">Character Roster</h1>
          {session?.role === "ADMIN" && (
            <span className="px-2 py-0.5 text-xs font-mono bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 rounded">
              ADMIN
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400 font-mono text-xs">{session?.email}</span>

          {session?.role === "ADMIN" && (
            <Link
              href="/admin/characters/new"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              + Add Hero
            </Link>
          )}

          <form action={logoutAction}>
            <button
              type="submit"
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      {/* Roster View */}
      <main className="p-6">
        <RosterClient characters={characters} />
      </main>
    </div>
  );
}