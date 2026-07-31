import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddCharacterForm from "../../new/AddCharacterForm";

type Props = {
  params: Promise<{ id: string }>; // In Next.js 15+, params is a Promise
};

export default async function EditCharacterPage({params}: Props) {
    const { id } = await params;

    // Fetch available lookup options in parallel
    const [character, jobs, attributes, rarities] = await Promise.all([
        prisma.character.findUnique({ where: { id } }),
        prisma.job.findMany({ orderBy: { createdAt: "asc" } }),
        prisma.attribute.findMany({ orderBy: { createdAt: "asc" } }),
        prisma.rarity.findMany({ orderBy: { createdAt: "asc" } }),
    ]);

    // If character doesn't exist, trigger 404 page
    if (!character) {
        notFound();
    }

    return (
            <main className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
            <AddCharacterForm
                jobs={jobs}
                attributes={attributes}
                rarities={rarities}
                initialData={character}
            />
            </main>
        );
}