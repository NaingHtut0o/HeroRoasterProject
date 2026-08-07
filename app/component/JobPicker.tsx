import { useState } from "react";
import { Job } from "@/src/generated/client";

export default function JobPicker({ jobs, selectedJob }: { jobs: Job[], selectedJob: string | null })
{
    const [selectedJobId, setSelectedJobId] = useState<string>(selectedJob || "");

    return(
        <div>
            <label className="block text-xs font-mono text-gray-400 mb-2">JOB / CLASS</label>
            
            {/* Hidden input preserves native form submission for Server Actions */}
            <input type="hidden" name="jobId" value={selectedJobId} required />

            <div className="grid sm:grid-cols-4 grid-cols-2 gap-2">
                { 
                    jobs.map((r) => {
                        const isSelected = selectedJobId === r.id;
                        return (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => isSelected ? setSelectedJobId("") : setSelectedJobId(r.id)}
                                className={`px-3 py-2 rounded-lg border text-sm font-bold transition-all text-left flex items-center justify-between ${
                                    isSelected
                                    ? "border-indigo-500 bg-gray-900 ring-1 ring-indigo-500"
                                    : "border-gray-800 bg-gray-950 hover:border-gray-700"
                                }`}
                            >
                            {/* Actual Gradient Text Rendering */}
                            <div className="flex items-center gap-2">
                                {/* Render icon if it exists */}
                                {r.iconUrl && (
                                    <img
                                    src={r.iconUrl}
                                    alt={r.name}
                                    className="w-6 h-6 object-contain shrink-0"
                                    />
                                )}

                                {/* Apply gradient styling ONLY to the text */}
                                <span className={`bg-gradient-to-r ${r.colorStyle} bg-clip-text text-transparent font-bold`}>
                                    {r.name}
                                </span>
                            </div>
                            {isSelected && <span className="text-xs text-indigo-400">✓</span>}
                            </button>
                        );
                    })
                }
            </div>
        </div>
    );
}