"use client";

import { useState } from "react";
import { CharacterData } from "./page";
import Link from "next/link";
import { Role } from "@/src/generated/enums";
import LikeButton from "./component/LikeButton";
import CommentSection from "./component/CommentSection";

export default function RosterClient({ characters, userRole, userId }: { characters: CharacterData[], userRole: Role | undefined, userId: string | undefined }) {
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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedChar(null)}
        >
          {/* MODAL CONTAINER */}
          <div 
            className="relative w-full max-w-4xl h-[90vh] md:h-[85vh] border border-none shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* TOP-RIGHT ACTION BUTTONS */}
            <div className="absolute -top-4 -right-4 md:-top-5 md:-right-4 z-50 flex items-center gap-1 md:gap-2 mx-1">
              {userRole === "ADMIN" && (
                <Link
                  href={`/admin/characters/${selectedChar.id}/edit`}
                  title="Edit Character"
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg border-2 border-gray-900"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
              )}
              <button
                onClick={() => setSelectedChar(null)}
                title="Close"
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg border-2 border-gray-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="w-full relative h-64 flex justify-center items-center z-20 pointer-events-none">
              <img 
                src={selectedChar.imageUrl} 
                alt={selectedChar.name}
                className="absolute top-1/2 -translate-y-1/2 w-[120%] h-[130%] max-w-none object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              />
            </div>

            {/* ROW 2: CONTENT SECTION */}
            <div className="flex-1 flex flex-col md:flex-row shrink-0 border border-gray-700/60 rounded-2xl overflow-y-auto md:shrink md:overflow-hidden">
              
              {/* COLUMN 1: INFO & STATS */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between md:overflow-y-auto border-b md:border-b-0 md:border-r border-gray-800/80 custom-scrollbar space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/80 text-xs font-bold uppercase tracking-wider text-gray-300 border border-gray-700/80 w-fit">
                    <span className={`bg-gradient-to-r ${selectedChar.job.colorStyle} bg-clip-text text-transparent`}>
                      {selectedChar.job.name}
                    </span>
                    <span>•</span>
                    <span className={`bg-gradient-to-r ${selectedChar.attribute.colorStyle} bg-clip-text text-transparent`}>
                      {selectedChar.attribute.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <h2 className={`text-3xl font-extrabold bg-gradient-to-r ${selectedChar.rarity.colorStyle} text-transparent bg-clip-text`}>
                      {selectedChar.name}
                    </h2>
                    <LikeButton 
                      characterId={selectedChar.id} 
                      initialIsLiked={selectedChar.isLiked} 
                      initialLikeCount={selectedChar.likeCount} 
                      userRole={userRole}
                    />
                  </div>

                  <div className="relative block">
                    {/* FLOATED STATS BLOCK (Floats to the right so text flows around and underneath it) */}
                    <div className="float-right ml-6 mb-4 w-37 p-3.5 bg-gray-950/70 rounded-2xl border border-gray-800/80 space-y-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Combat Stats</h4>
                      <StatBar label="HP" value={selectedChar.stats.hp} color="bg-green-500" />
                      <StatBar label="ATK" value={selectedChar.stats.attack} color="bg-red-500" />
                      <StatBar label="DEF" value={selectedChar.stats.defense} color="bg-blue-500" />
                      <StatBar label="SPD" value={selectedChar.stats.speed} color="bg-yellow-500" />
                    </div>

                    {/* BIO TEXT */}
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedChar.bio}
                    </p>

                    {/* Clear float spacing fix */}
                    <div className="clear-both"></div>
                  </div>
                </div>
              </div>

              {/* COLUMN 2: COMMENTS */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 bg-gray-950/40 flex flex-col md:overflow-hidden">
                <CommentSection
                  characterId={selectedChar.id}
                  currentUserId={userId}
                  currentUserRole={userRole}
                />
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
      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-blue-400 font-mono font-bold">DEF</span>
      <span className="absolute bottom-0 text-[10px] text-red-400 font-mono font-bold">ATK</span>
      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-yellow-400 font-mono font-bold">SPD</span>
    </div>
  );
}