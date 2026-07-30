import { prisma } from "@/lib/prisma";
import AddCharacterForm from "./AddCharacterForm";

export default async function NewCharacterPage() {
  // Fetch available lookup options in parallel
  const [jobs, attributes, rarities] = await Promise.all([
    prisma.job.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.attribute.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.rarity.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return (
        <main className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
        <AddCharacterForm
            jobs={jobs}
            attributes={attributes}
            rarities={rarities}
        />
        </main>
    );
}