import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  // Clear existing records
  await prisma.character.deleteMany();

  // Create initial heroes
  await prisma.character.createMany({
    data: [
      {
        name: "Kaelen",
        role: "Vanguard",
        element: "Fire",
        bio: "A hot-headed warrior who leads the charge. Kaelen's blade is said to be forged from the heart of a dying star.",
        hp: 85,
        attack: 90,
        defense: 70,
        speed: 60,
        color: "from-red-600 to-orange-500",
        imageUrl: "/Photos/Kaelen.png",
      },
      {
        name: "Lyra",
        role: "Spellweaver",
        element: "Void",
        bio: "Channeling the abyss, Lyra controls the battlefield from afar. Her past is as mysterious as the magic she wields.",
        hp: 50,
        attack: 95,
        defense: 40,
        speed: 75,
        color: "from-purple-600 to-indigo-900",
        imageUrl: "/Photos/Lyra.png",
      },
      {
        name: "Toru",
        role: "Guardian",
        element: "Earth",
        bio: "An immovable object. Toru protects his allies with impenetrable shields made of crystalline bedrock.",
        hp: 100,
        attack: 40,
        defense: 95,
        speed: 30,
        color: "from-emerald-600 to-teal-800",
        imageUrl: "/Photos/Toru.png",
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });