import { useState } from "react";
import { Attribute } from "@/src/generated/client";

export default function AttributePicker({ attributes, selectedAttribute }: { attributes: Attribute[], selectedAttribute: string | null })
{
    const [selectedAttributeId, setSelectedAttributeId] = useState<string>(selectedAttribute || "");

    return(
        <div>
            <label className="block text-xs font-mono text-gray-400 mb-2">ELEMENT / ATTRIBUTE</label>
            
            {/* Hidden input preserves native form submission for Server Actions */}
            <input type="hidden" name="attributeId" value={selectedAttributeId} required />

            <div className="grid grid-cols-5 gap-2">
                { 
                    attributes.map((r) => {
                        const isSelected = selectedAttributeId === r.id;
                        return (
                            <button
                            key={r.id}
                            type="button"
                            onClick={() => isSelected? setSelectedAttributeId("") : setSelectedAttributeId(r.id)}
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