import { useState } from "react";
import { Rarity } from "@/src/generated/client";

export default function RarityPicker({ rarities, selectedRarity }: { rarities: Rarity[], selectedRarity: string | null }) {
  const [selectedRarityId, setSelectedRarityId] = useState<string>(selectedRarity || "");

  return (
    <div>
      <label className="block text-xs font-mono text-gray-400 mb-2">RARITY</label>
      
      {/* Hidden input preserves native form submission for Server Actions */}
      <input type="hidden" name="rarityId" value={selectedRarityId} required />

      <div className="grid grid-cols-4 gap-2">
        {rarities.map((r) => {
          const isSelected = selectedRarityId === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => isSelected? setSelectedRarityId("") : setSelectedRarityId(r.id)}
              className={`px-3 py-2 rounded-lg border text-sm font-bold transition-all text-left flex items-center justify-between ${
                isSelected
                  ? "border-indigo-500 bg-gray-900 ring-1 ring-indigo-500"
                  : "border-gray-800 bg-gray-950 hover:border-gray-700"
              }`}
            >
              {/* Actual Gradient Text Rendering */}
              <span className={`bg-gradient-to-r ${r.colorStyle} bg-clip-text text-transparent`}>
                ✦ {r.name}
              </span>
              {isSelected && <span className="text-xs text-indigo-400">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}