"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = { error?: string } | null;

export async function createCharacterAction(
    prevState: ActionState,
    formData: FormData
) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN")
    {
        logger.warn(
            { user: session?.email || "anonymous" },
            "Unauthorized character creation attempt blocked"
        );
        return { error: "Unauthorized: Admin access required." };
    }

    const name = formData.get("name") as string;
    const jobId = formData.get("jobId") as string;
    const attributeId = formData.get("attributeId") as string;
    const rarityId = formData.get("rarityId") as string;
    const bio = formData.get("bio") as string;
    const imageUrl = formData.get("imageUrl") as string;

    const hp = parseInt(formData.get("hp") as string, 10) || 50;
    const attack = parseInt(formData.get("attack") as string, 10) || 50;
    const defense = parseInt(formData.get("defense") as string, 10) || 50;
    const speed = parseInt(formData.get("speed") as string, 10) || 50;
    
    if (!name || !jobId || !attributeId || !rarityId || !imageUrl) {
        logger.info({ adminEmail: session.email }, "Character creation failed: missing required fields");
        return { error: "Please select a Job, Attribute, Rarity, and provide a Name and Image URL." };
    }

    try {
        const newCharacter = await prisma.character.create({
            data: {
                name,
                jobId,
                attributeId,
                rarityId,
                bio,
                imageUrl,
                hp,
                attack,
                defense,
                speed,
            },
            include: {
                job: true,
                rarity: true,
                attribute: true,
            },
        });

        logger.info(
            {
                characterId: newCharacter.id,
                characterName: newCharacter.name,
                job: newCharacter.job.name,
                rarity: newCharacter.rarity.name,
                adminEmail: session.email,
            },
            "New character created successfully"
        );
    } catch (err) {
        logger.error({ err, adminEmail: session.email }, "Database error during character creation");
        return { error: "Failed to create character in database." };
    }

    revalidatePath("/");
    redirect("/");
}