"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export type ActionState = { error?: string } | null;

export async function createCharacterAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const session = await getSession();
    if (!session || session.role !== "ADMIN")
    {
        logger.warn(
            { user: session?.email || "anonymous" },
            "Unauthorized character creation attempt blocked"
        );
        return { error: "Unauthorized: Admin access required." };
    }

    const characterId = formData.get("characterId") as string | null;
    const name = formData.get("name") as string;
    const jobId = formData.get("jobId") as string;
    const attributeId = formData.get("attributeId") as string;
    const rarityId = formData.get("rarityId") as string;
    const bio = formData.get("bio") as string;

    const hp = parseInt(formData.get("hp") as string, 10) || 50;
    const attack = parseInt(formData.get("attack") as string, 10) || 50;
    const defense = parseInt(formData.get("defense") as string, 10) || 50;
    const speed = parseInt(formData.get("speed") as string, 10) || 50;
    
    const imageFile = formData.get("imageFile") as File | null;

    if ((!imageFile || imageFile.size === 0) && !characterId) {
        return { error: "Please upload an image file for the hero." };
    }
    
    if (!name || !jobId || !attributeId || !rarityId) {
        logger.info({ adminEmail: session.email }, "Character creation failed: missing required fields");
        return { error: "Please select a Job, Attribute, Rarity, and provide a Name and Image URL." };
    }

    let imageUrl = "";

    try {
        if (imageFile && imageFile.size !== 0)
        {
            // Convert File stream to Node Buffer
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Create unique filename (e.g. 1720000000000-a1b2c3d4.png)
            const fileExt = path.extname(imageFile.name) || ".png";
            const uniqueFilename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${fileExt}`;

            // Ensure public/Photos folder exists
            const photosDir = path.join(process.cwd(), "public", "characters");
            await mkdir(photosDir, { recursive: true });

            // Save file to disk
            const filePath = path.join(photosDir, uniqueFilename);
            await writeFile(filePath, buffer);

            // Path stored in the DB
            imageUrl = `/characters/${uniqueFilename}`;

            logger.info({ uniqueFilename, size: imageFile.size }, "Saved image file to public/characters/");
        }
    } catch (fileErr) {
        logger.error({ fileErr }, "Failed to save image file to public/characters/");
        return { error: "Failed to save image file on server." };
    }

    try {
        if (characterId)
        {
            await prisma.character.update({
                where: {
                    id: characterId,
                },
                data: {
                    name,
                    jobId,
                    attributeId,
                    rarityId,
                    bio,
                    ...( imageUrl != "" && {imageUrl}),
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
                { characterId },
                "Character updated successfully"
            );
        }
        else
        {
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
        }
    } catch (err) {
        logger.error({ err, adminEmail: session.email }, "Database error during character creation");
        return { error: "Failed to create character in database." };
    }

    revalidatePath("/");
    redirect("/");
}