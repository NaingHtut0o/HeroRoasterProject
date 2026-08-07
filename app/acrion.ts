"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";

export async function toggleLikeAction(characterId: string)
{
    logger.info({characterId}, "Like toggle initiated");

    const session = await getSession();

    if (!session?.userId || session?.role === "GUEST")
    {
        logger.warn({
                userId: session?.userId ?? "ANONYMOUS",
                role: session?.role ?? "NONE",
                characterId,
            }, "Unauthorized like attempt");

        return { success: false, error: "Unauthorized" };
    }

    const userId = session?.userId;

    try 
    {
        const existingLike = await prisma.characterLike.findUnique({
                where: {
                    userId_characterId: {
                    userId,
                    characterId,
                    },
                },
            });

        if (existingLike) {
            // Unlike
            await prisma.characterLike.delete({
                where: { id: existingLike.id },
            });
            logger.info({ userId, characterId }, "Character unliked successfully");
        } else {
            // Like
            await prisma.characterLike.create({
                data: {
                userId,
                characterId,
                },
            });
            logger.info({ userId, characterId }, "Character liked successfully");
        }

        revalidatePath("/characters");
        return { success: true };
    }
    catch (error) 
    {
        logger.error({
                userId,
                characterId,
                error: error instanceof Error ? error.message : String(error),
            }, "Failed to toggle like on character");
        return { success: false, error: "Database error" };
    }
}