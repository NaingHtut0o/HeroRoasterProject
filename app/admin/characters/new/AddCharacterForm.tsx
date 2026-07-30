"use client";

import { useActionState } from "react";
import { createCharacterAction, ActionState } from "../actions";
import { Job, Attribute, Rarity } from "@/src/generated/client";
import Link from "next/link";
import RarityPicker from "./RarityPicker";

type Props = {
    jobs: Job[];
    attributes: Attribute[];
    rarities: Rarity[];
};

export default function AddCharacterForm({ jobs, attributes, rarities}: Props)
{
    const [state, formAction, isPending] = useActionState<ActionState, FormData>(
        createCharacterAction,
        null
    );

    return(
        <form
            action={formAction}
            className="space-y-6 max-w-2xl mx-auto bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl"
            >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <h2 className="text-2xl font-bold text-white">Add New Hero</h2>
                <Link
                href="/"
                className="text-xs font-mono text-gray-400 hover:text-white transition-colors"
                >
                ← Cancel
                </Link>
            </div>

            {/* Error Message */}
            {state?.error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">
                {state.error}
                </div>
            )}

            {/* Name Input */}
            <div className="md:col-span-2">
                <label className="block text-xs font-mono text-gray-400 mb-1">HERO NAME</label>
                <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Kaelen Flameheart"
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
            </div>

            {/* Job Select */}
            <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">JOB / CLASS</label>
                <select
                    name="jobId"
                    required
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                    <option value="">Select Job...</option>
                    {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                        {j.name}
                    </option>
                    ))}
                </select>
            </div>

            {/* Attribute Select */}
            <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">ELEMENT / ATTRIBUTE</label>
                <select
                    name="attributeId"
                    required
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                    <option value="">Select Element...</option>
                    {attributes.map((a) => (
                    <option key={a.id} value={a.id}>
                        {a.name}
                    </option>
                    ))}
                </select>
            </div>

            {/* Rarity Select */}
            <RarityPicker rarities={rarities} />

            {/* Image URL Input */}
            <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">IMAGE FILE</label>
                <input
                    type="file"
                    name="imageFile"
                    required
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
            </div>

            {/* Bio Section */}
            <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">CHARACTER BIO</label>
                <textarea
                    name="bio"
                    rows={3}
                    placeholder="Write character backstory..."
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
            </div>

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
    );
}