"use client";

import { useActionState } from "react";
import { createCharacterAction, ActionState } from "../actions";
import { Job, Attribute, Rarity } from "@/src/generated/client";
import Link from "next/link";

type Props = {
    jobs: Job[];
    attributes: Attribute[];
    rarities: Rarity[];
};

export default function AddCharacterForm({ jobs, attributes, rarities}: Props)
{
    const [state, formAction, isPending] = useActionState(
        createCharacterAction,
        null
    );

    return(
        <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold mb-2 text-center text-white">Welcome Back</h1>
                <p className="text-sm text-gray-400 mb-6 text-center">
                    Sign in to manage your character roster
                </p>

                {state?.error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center">
                        {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-4">

                    {/* Base Stats */}
                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-2">BASE STATS (1 - 100)</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-950 p-4 rounded-xl border border-gray-800">
                        {[
                            { label: "HP", name: "hp", def: 85 },
                            { label: "ATTACK", name: "attack", def: 90 },
                            { label: "DEFENSE", name: "defense", def: 70 },
                            { label: "SPEED", name: "speed", def: 60 },
                        ].map((stat) => (
                            <div key={stat.name}>
                            <label className="block text-[10px] font-mono text-gray-400 mb-1">{stat.label}</label>
                            <input
                                type="number"
                                name={stat.name}
                                min={1}
                                max={100}
                                defaultValue={stat.def}
                                className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                            </div>
                        ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isPending ? "Adding Hero..." : "Create Hero"}
                    </button>
                </form>
            </div>
        </main>
    );
}