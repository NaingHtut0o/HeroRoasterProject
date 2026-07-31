"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction } from "./actions";

export default function LoginPage()
{
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/";
    const registered = searchParams.get("registered") === "true";

    const [state, formAction, isPending] = useActionState(loginAction, null);
    
    return (
        <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold mb-2 text-center text-white">Welcome Back</h1>
                <p className="text-sm text-gray-400 mb-6 text-center">
                    Sign in to manage your character roster
                </p>

                {/* Success message on redirect from register */}
                {registered && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg text-center">
                    Account created successfully! Please sign in.
                </div>
                )}

                {state?.error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center">
                        {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-4">
                    <input type="hidden" name="redirectTo" value={redirectTo} />
                    
                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-1">EMAIL</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="admin@game.com"
                            className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-1">PASSWORD</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isPending ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                        Register
                    </Link>
                </p>
            </div>
        </main>
  );
}