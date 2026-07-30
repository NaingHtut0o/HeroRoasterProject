"use client";

import { useState } from "react";
import { CharacterData } from "./page";

export default function RosterClient({ characters }: { characters: CharacterData[] }) {
  const [selectedChar, setSelectedChar] = useState<CharacterData | null>(null);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Select Hero</h1>
          <p className="text-gray-400">Click a character avatar to view stats and combat profile.</p>
        </header>

        {/* Circular Avatars Grid */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
          {characters.map((char) => (
            <div
              key={char.id}
              onClick={() => setSelectedChar(char)}
              className="group cursor-pointer flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-indigo-500 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all duration-300 bg-gray-900 mb-3 flex items-center justify-center">
                <div className={`absolute inset-0 bg-gradient-to-br ${char.rarity.colorStyle} opacity-30 group-hover:opacity-60 transition-opacity`} />
                <img 
                  src={char.imageUrl} 
                  alt={char.name}
                  className="w-full h-full object-cover object-top scale-125 pt-2 relative z-10 transition-transform duration-300 group-hover:scale-135"
                />
              </div>

              <h2 className="text-lg font-bold text-gray-200 group-hover:text-indigo-400 transition-colors">
                {char.name}
              </h2>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
                {char.job.name} • {char.attribute.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ENLARGED MODAL VIEW */}
      {selectedChar && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedChar(null)}
        >
          <div 
            className="relative w-full max-w-5xl bg-gray-900/80 border border-gray-700/50 rounded-3xl shadow-2xl flex flex-col md:flex-row items-stretch"
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={() => setSelectedChar(null)}
              className="absolute -top-4 -right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg border-2 border-gray-900"
            >
              ✕
            </button>

            {/* LEFT COLUMN: Basic Info */}
            <div className="w-full md:w-1/3 p-8 flex flex-col justify-center z-10">
              <div className="inline-block px-3 py-1 mb-4 rounded-full bg-gray-800 text-xs font-bold uppercase tracking-wider text-gray-300 w-fit border border-gray-700">
                {selectedChar.job.name} • {selectedChar.attribute.name}
              </div>
              <h2 className={`text-5xl font-bold mb-6 bg-gradient-to-r ${selectedChar.rarity.colorStyle} text-transparent bg-clip-text`}>
                {selectedChar.name}
              </h2>
              <p className="text-gray-300 text-base leading-relaxed">
                {selectedChar.bio}
              </p>
            </div>

            {/* CENTER COLUMN: Breaking-out Image */}
            <div className="w-full md:w-1/3 relative h-64 md:h-auto flex justify-center items-center z-20 pointer-events-none">
              <img 
                src={selectedChar.imageUrl} 
                alt={selectedChar.name}
                className="absolute top-1/2 -translate-y-1/2 w-[120%] h-[130%] max-w-none object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              />
            </div>

            {/* RIGHT COLUMN: Stats & Chart */}
            <div className="w-full md:w-1/3 p-8 flex flex-col justify-center z-10 bg-gray-950/50 rounded-r-3xl">
              <h3 className="text-xl font-bold text-white mb-6">Combat Profiler</h3>
              
              <div className="space-y-4 mb-8">
                <StatBar label="HP" value={selectedChar.stats.hp} color="bg-green-500" />
                <StatBar label="ATK" value={selectedChar.stats.attack} color="bg-red-500" />
                <StatBar label="DEF" value={selectedChar.stats.defense} color="bg-blue-500" />
                <StatBar label="SPD" value={selectedChar.stats.speed} color="bg-yellow-500" />
              </div>

              <div className="flex-grow flex items-center justify-center bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <RadarChart stats={selectedChar.stats} />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1 font-mono">
        <span className="text-gray-400">{label}</span>
        <span className="font-bold text-gray-200">{value}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function RadarChart({ stats }: { stats: CharacterData["stats"] }) {
  const size = 160;
  const center = size / 2;
  const maxRadius = (size / 2) - 20; 

  // Map 0-100 stats to coordinate points
  const hpY = center - (stats.hp / 100) * maxRadius;
  const atkX = center + (stats.attack / 100) * maxRadius;
  const defY = center + (stats.defense / 100) * maxRadius;
  const spdX = center - (stats.speed / 100) * maxRadius;

  const points = `${center},${hpY} ${defY},${center} ${center},${atkX} ${spdX},${center}`;

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid (Diamond shape) */}
        <polygon points={`${center},20 ${size-20},${center} ${center},${size-20} 20,${center}`} fill="none" stroke="#374151" strokeWidth="1" />
        <polygon points={`${center},${center - maxRadius/2} ${center + maxRadius/2},${center} ${center},${center + maxRadius/2} ${center - maxRadius/2},${center}`} fill="none" stroke="#374151" strokeWidth="1" opacity="0.5" />
        
        {/* Axis Lines */}
        <line x1={center} y1="20" x2={center} y2={size-20} stroke="#374151" strokeWidth="1" />
        <line x1="20" y1={center} x2={size-20} y2={center} stroke="#374151" strokeWidth="1" />

        {/* The Data Polygon */}
        <polygon 
          points={points} 
          fill="rgba(99, 102, 241, 0.4)" 
          stroke="#818cf8" 
          strokeWidth="2" 
          className="transition-all duration-500 ease-out"
        />
        
        {/* Data Points */}
        <circle cx={center} cy={hpY} r="3" fill="#818cf8" />
        <circle cx={defY} cy={center} r="3" fill="#818cf8" />
        <circle cx={center} cy={atkX} r="3" fill="#818cf8" />
        <circle cx={spdX} cy={center} r="3" fill="#818cf8" />
      </svg>
      
      {/* Labels */}
      <span className="absolute top-0 text-[10px] text-green-400 font-mono font-bold">HP</span>
      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-red-400 font-mono font-bold">DEF</span>
      <span className="absolute bottom-0 text-[10px] text-blue-400 font-mono font-bold">ATK</span>
      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-yellow-400 font-mono font-bold">SPD</span>
    </div>
  );
}