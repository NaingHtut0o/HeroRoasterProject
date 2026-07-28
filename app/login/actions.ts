"use server";

import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export type LoginState = {
    error?: string;
} | null;

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState>
{
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const redirectTo = (formData.get("redirectTo") as string) || "/";

    if (!email || !password)
    {
        return { error: "Please provide both email and password." };
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user)
    {
        return { error: "Invalid email or password." };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch)
    {
        return { error: "Invalid email or password." };
    }

    await createSession({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    redirect(redirectTo);
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}