"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";

export async function getCharacterComments(characterId: string) {
    logger.info({ characterId }, "Fetching character comments");
    
    const session = await getSession();
    const currentUserId = session?.userId;

    try {
        const comments = await prisma.comment.findMany({
            where: { characterId },
            include: {
                user: {
                    select: {
                    id: true,
                    name: true,
                    role: true,
                    },
                },
                likes: {
                    where: { userId: currentUserId ?? "" },
                    select: { id: true },
                },
                _count: {
                    select: { likes: true },
                },
            },
            orderBy: { likes: { _count: "desc" } },
        });

        const formattedComments = comments.map((comment) => ({
            ...comment,
            likeCount: comment._count.likes,
            isLiked: comment.likes.length > 0,
        }));

        return { success: true, comments: formattedComments };
    } catch (error) {
        logger.error(
            { characterId, error: error instanceof Error ? error.message : String(error) },
            "Failed to fetch comments"
        );
        return { success: false, comments: [] };
    }
}

export async function addCommentAction( characterId: string, content: string)
{
    logger.info({ characterId }, "Add comment action initiated");

    const session = await getSession();

    if (!session?.userId || session.role === "GUEST")
    {
        logger.warn(
            { userId: session?.userId ?? "ANONYMOUS", characterId },
            "Unauthorized comment creation attempt"
        );
        return { success: false, error: "Unauthorized" };
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) 
    {
        return { success: false, error: "Comment cannot be empty" };
    }

    try {
        const newComment = await prisma.comment.create({
            data: {
                content: trimmedContent,
                userId: session.userId,
                characterId,
            },
            include: {
                user: {
                    select: { id: true, name: true, role: true },
                },
                likes: {
                    where: { userId: session.userId ?? "" },
                    select: { id: true },
                },
                _count: {
                    select: { likes: true },
                },
            },
        });

        logger.info(
            { commentId: newComment.id, userId: session.userId, characterId },
            "Comment created successfully"
        );

        revalidatePath("/characters");
        return { success: true, comment: {
            ...newComment,
            likeCount: newComment._count.likes,
            isLiked: newComment.likes.length > 0,
        } };
    } catch (error) {
        logger.error(
            {
                userId: session.userId,
                characterId,
                error: error instanceof Error ? error.message : String(error),
            },
            "Failed to add comment"
        );
        return { success: false, error: "Database error" };
    }
}

export async function editCommentAction( commentId: string, content: string)
{
    logger.info({ commentId }, "Edit comment action initiated");

    const session = await getSession();

    if (!session?.userId || session.role === "GUEST")
    {
        logger.warn(
            { userId: session?.userId ?? "ANONYMOUS", commentId },
            "Unauthorized comment edition attempt"
        );
        return { success: false, error: "Unauthorized" };
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) 
    {
        return { success: false, error: "Comment cannot be empty" };
    }

    try {
        const existingComment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { userId: true },
        });

        if (!existingComment) {
            return { success: false, error: "Comment not found" };
        }

        // Only allow the author (or optionally admins) to edit
        const isOwner = existingComment.userId === session.userId;
        const isAdmin = session.role === "ADMIN";

        if (!isOwner && !isAdmin) {
            logger.warn(
                { userId: session.userId, commentId },
                "User attempted to edit a comment they do not own"
            );
            return { success: false, error: "Forbidden: You cannot edit this comment" };
        }

        // 2. Perform the update
        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                content: trimmedContent,
                updatedAt: new Date(), // Fixed: Use JavaScript's Date object
            },
            include: {
                user: {
                    select: { id: true, name: true, role: true },
                },
                likes: {
                    where: { userId: session.userId ?? "" },
                    select: { id: true },
                },
                _count: {
                    select: { likes: true },
                },
            },
        });

        logger.info(
            { commentId, userId: session.userId },
            "Comment updated successfully"
        );

        revalidatePath("/characters");
        return { success: true, comment: {
            ...updatedComment,
            likeCount: updatedComment._count.likes,
            isLiked: updatedComment.likes.length > 0,
        } };
    } catch (error) {
        logger.error(
            {
                userId: session.userId,
                commentId,
                error: error instanceof Error ? error.message : String(error),
            },
            "Failed to update comment"
        );
        return { success: false, error: "Database error" };
    }
}

export async function deleteCommentAction(commentId: string) {
    logger.info({ commentId }, "Delete comment action initiated");

    const session = await getSession();

    if (!session?.userId || session.role === "GUEST") 
    {
        logger.warn(
            { userId: session?.userId ?? "ANONYMOUS", commentId },
            "Unauthorized comment deletion attempt"
        );
        return { success: false, error: "Unauthorized" };
    }

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { userId: true, characterId: true },
        });

        if (!comment) {
            return { success: false, error: "Comment not found" };
        }

        // Permission check: User must be owner OR an ADMIN
        const isOwner = comment.userId === session.userId;
        const isAdmin = session.role === "ADMIN";

        if (!isOwner && !isAdmin) {
            logger.warn(
                { userId: session.userId, commentId },
                "User forbidden from deleting comment"
            );
            return { success: false, error: "Forbidden" };
        }

        await prisma.comment.delete({
            where: { id: commentId },
        });

        logger.info(
            { commentId, deletedBy: session.userId },
            "Comment deleted successfully"
        );

        revalidatePath("/characters");
        return { success: true };
    } catch (error) {
        logger.error(
            {
                commentId,
                userId: session.userId,
                error: error instanceof Error ? error.message : String(error),
            },
            "Failed to delete comment"
        );
        return { success: false, error: "Database error" };
    }
}