import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // Clear existing records
  await prisma.character.deleteMany();

  const raritiesData = [
    {
      name: "Normal",
      colorHex: "from-slate-600 to-gray-700",
    },
    {
      name: "Rare",
      colorHex: "from-blue-600 to-cyan-500",
    },
    {
      name: "Epic",
      colorHex: "from-purple-600 to-pink-500",
    },
    {
      name: "Legendary",
      // Radiant multi-color gradient style
      colorHex: "from-amber-400 via-rose-500 to-indigo-500 animate-pulse",
    },
  ];

  for (const rarity of raritiesData) {
    await prisma.rarity.upsert({
      where: { name: rarity.name },
      update: rarity,
      create: rarity,
    });
  }

  // 2. SEED JOBS
  const jobsData = [
    {
      name: "Warrior",
      description: "Frontline melee tank and physical powerhouse.",
      iconUrl: "/icons/warrior.svg",
    },
    {
      name: "Mage",
      description: "Master of arcane burst magic and crowd control.",
      iconUrl: "/icons/mage.svg",
    },
    {
      name: "Rogue",
      description: "Swift assassin specializing in critical hits and evasion.",
      iconUrl: "/icons/rogue.svg",
    },
    {
      name: "Paladin",
      description: "Holy defender balancing heavy armor with restorative light.",
      iconUrl: "/icons/paladin.svg",
    },
  ];

  for (const job of jobsData) {
    await prisma.job.upsert({
      where: { name: job.name },
      update: job,
      create: job,
    });
  }

  // 3. SEED ATTRIBUTES
  const attributesData = [
    {
      name: "Fire",
      iconUrl: "/icons/fire.svg",
    },
    {
      name: "Water",
      iconUrl: "/icons/water.svg",
    },
    {
      name: "Earth",
      iconUrl: "/icons/earth.svg",
    },
    {
      name: "Light",
      iconUrl: "/icons/light.svg",
    },
    {
      name: "Void",
      iconUrl: "/icons/void.svg",
    },
  ];

  for (const attribute of attributesData) {
    await prisma.attribute.upsert({
      where: { name: attribute.name },
      update: attribute,
      create: attribute,
    });
  }

  // Create initial heroes
  const charactersData = [
    {
      name: "Kaelen",
      job: { connect: { name: "Warrior" } },
      attribute: { connect: { name: "Fire" } },
      rarity: { connect: { name: "Legendary" } },
      bio: "A hot-headed warrior who leads the charge. Kaelen's blade is said to be forged from the heart of a dying star.",
      hp: 85,
      attack: 90,
      defense: 70,
      speed: 60,
      imageUrl: "/characters/Kaelen.png",
    },
    {
      name: "Lyra",
      job: { connect: { name: "Rogue" } },
      attribute: { connect: { name: "Void" } },
      rarity: { connect: { name: "Epic" } },
      bio: "Channeling the abyss, Lyra controls the battlefield from afar. Her past is as mysterious as the magic she wields.",
      hp: 50,
      attack: 95,
      defense: 40,
      speed: 75,
      imageUrl: "/characters/Lyra.png",
    },
    {
      name: "Toru",
      job: { connect: { name: "Paladin" } },
      attribute: { connect: { name: "Earth" } },
      rarity: { connect: { name: "Rare" } },
      bio: "An immovable object. Toru protects his allies with impenetrable shields made of crystalline bedrock.",
      hp: 100,
      attack: 40,
      defense: 95,
      speed: 30,
      imageUrl: "/characters/Toru.png",
    },
  ];

  // Create each character sequentially
  for (const character of charactersData) {
    await prisma.character.create({
      data: character,
    });
  }
  
  const hashedPassword = await bcrypt.hash("abc123!@#", 10);

  // Create Admin User
  await prisma.user.upsert({
    where: { email: "admin@game.com" },
    update: {},
    create: {
      email: "admin@game.com",
      name: "Guild Master",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create Regular User
  await prisma.user.upsert({
    where: { email: "user@game.com" },
    update: {},
    create: {
      email: "user@game.com",
      name: "Adventurer",
      password: hashedPassword,
      role: "USER",
    },
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