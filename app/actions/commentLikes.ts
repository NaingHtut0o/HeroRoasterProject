"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";

export async function toggleCommentLikeAction(commentId: string) {
    logger.info({commentId}, "Like toggle initiated");

    const session = await getSession();

    if (!session?.userId || session.role === "GUEST") {
        logger.warn({
                userId: session?.userId ?? "ANONYMOUS",
                role: session?.role ?? "NONE",
                commentId,
            }, "Unauthorized like attempt");

        return { success: false, error: "Unauthorized" };
    }

    const userId = session?.userId;

    try {
        const existingLike = await prisma.commentLike.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId,
                },
            },
        });

        if (existingLike) {
            // Unlike
            await prisma.commentLike.delete({
                where: { id: existingLike.id },
            });
            logger.info({ userId, commentId }, "Comment unliked successfully");
        } else {
            // Like
            await prisma.commentLike.create({
                data: {
                    userId: session.userId,
                    commentId,
                },
            });
            logger.info({ userId, commentId }, "Comment liked successfully");
        }
        revalidatePath("/characters");
        return { success: true};
    } catch (error) {
        logger.error({
                userId,
                commentId,
                error: error instanceof Error ? error.message : String(error),
            }, "Failed to toggle like on comment");
        return { success: false, error: "Failed to toggle like" };
    }
}