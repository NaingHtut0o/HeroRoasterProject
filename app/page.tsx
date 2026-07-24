import { prisma } from "@/lib/prisma";
import RosterClient from "./RosterClient";

// --- 1. TYPES & MOCK DATA ---
export type CharacterData = {
  id: string;
  name: string;
  role: string;
  element: string;
  bio: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  color: string; // Used for the card gradient placeholder
  imageUrl: string;
};

export default async function RosterPage() {
  // Query database directly on the server
  const dbCharacters = await prisma.character.findMany();

  // Transform database fields to fit UI layout
  const characters: CharacterData[] = dbCharacters.map((char) => ({
    id: char.id,
    name: char.name,
    role: char.role,
    element: char.element,
    bio: char.bio,
    color: char.color,
    imageUrl: char.imageUrl,
    stats: {
      hp: char.hp,
      attack: char.attack,
      defense: char.defense,
      speed: char.speed,
    },
  }));

  return <RosterClient characters={characters} />;
}