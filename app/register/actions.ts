"use server";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = { error?: string } | null;

export async function registerAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> 
{
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        logger.warn({ email }, "Registration failed: Missing email or password");
        return { error: "Email and password are required." };
    }

    try
    {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            logger.warn({ email }, "Registration failed: User already exists");
            return { error: "An account with this email already exists." };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        logger.info({ userId: user.id, email: user.email }, "New user registered successfully");
    }
    catch (error) 
    {
        logger.error({ error, email }, "Database error during registration");
        return { error: "Something went wrong. Please try again." };
    }

    // Redirect to login page upon success
    revalidatePath("/login");
    redirect("/login?registered=true");
}