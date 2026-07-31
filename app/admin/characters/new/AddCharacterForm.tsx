"use client";

import { useActionState, useState } from "react";
import { createCharacterAction, ActionState } from "../actions";
import { Job, Attribute, Rarity, Character } from "@/src/generated/client";
import Link from "next/link";
import RarityPicker from "./RarityPicker";
import AttributePicker from "./AttributePicker";
import JobPicker from "./JobPicker";

type Props = {
    jobs: Job[];
    attributes: Attribute[];
    rarities: Rarity[];
    initialData?: Character | null;
};

export default function AddCharacterForm({ jobs, attributes, rarities, initialData }: Props)
{
    const isEditing = Boolean(initialData?.id);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        initialData?.imageUrl || null
    );

    // Optional: Dynamic live preview when user selects a new file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

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
                <h2 className="text-2xl font-bold text-white">{isEditing ? `Edit ${initialData?.name}` : "Add New Hero"}</h2>
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

            {isEditing && <input type="hidden" name="characterId" value={initialData?.id} />}

            {/* Name Input */}
            <div className="md:col-span-2">
                <label className="block text-xs font-mono text-gray-400 mb-1">HERO NAME</label>
                <input
                    type="text"
                    name="name"
                    required
                    defaultValue={initialData?.name || ""}
                    placeholder="e.g. Kaelen Flameheart"
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
            </div>

            {/* Job Select */}
            <JobPicker jobs={jobs} selectedJob={initialData?.jobId || ""} />

            {/* Attribute Select */}
            <AttributePicker attributes={attributes} selectedAttribute={initialData?.attributeId || ""} />

            {/* Rarity Select */}
            <RarityPicker rarities={rarities} selectedRarity={initialData?.rarityId || ""} />

            {/* Image URL Input */}
            <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">IMAGE FILE</label>

                {previewUrl && (
                    <div className="flex items-center gap-4 p-3 bg-gray-950 border border-gray-800 rounded-lg">
                        <img
                            src={previewUrl}
                            alt="Character preview"
                            className="w-16 h-16 object-cover rounded-md border border-gray-700"
                        />
                        <span className="text-xs text-gray-400 font-mono">
                            {isEditing ? "Current image active" : "New upload preview"}
                        </span>
                    </div>
                    )}

                <input
                    type="file"
                    name="imageFile"
                    required={!isEditing}
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
            </div>

            {/* Bio Section */}
            <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">CHARACTER BIO</label>
                <textarea
                    name="bio"
                    rows={3}
                    defaultValue={initialData?.bio || ""}
                    placeholder="Write character backstory..."
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
            </div>

            {/* Base Stats */}
            <div>
                <label className="block text-xs font-mono text-gray-400 mb-2">BASE STATS (1 - 100)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-950 p-4 rounded-xl border border-gray-800">
                {[
                    { label: "HP", name: "hp", def: initialData?.hp || 85 },
                    { label: "ATTACK", name: "attack", def: initialData?.attack || 90 },
                    { label: "DEFENSE", name: "defense", def: initialData?.defense || 70 },
                    { label: "SPEED", name: "speed", def: initialData?.speed || 60 },
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
                {isPending ? "Saving..." : isEditing ? "Update Hero" : "Create Hero"}
            </button>
        </form>
    );
}