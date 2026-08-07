"use client";

import { useTransition, useState } from "react";
import { toggleLikeAction } from "../acrion";

type LikeButtonProps = {
    characterId: string;
    initialLikeCount: number;
    initialIsLiked: boolean;
    userRole?: string;
}

export default function LikeButton({
    characterId,
    initialLikeCount,
    initialIsLiked,
    userRole,
}: LikeButtonProps)
{
    const isGuest = !userRole || userRole === "GUEST";
    const [isPending, startTransition] = useTransition();

    // For UI
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);

    const handleLike = () => {
        if (isGuest) return;

        const nextIsLiked = !isLiked;
        setIsLiked(nextIsLiked);
        setLikeCount((prev) =>  (nextIsLiked ? prev + 1 : prev - 1));

        startTransition( async () => {
            const result = await toggleLikeAction(characterId);

            if (!result.success)
            {
                setIsLiked(initialIsLiked);
                setLikeCount(initialLikeCount);
            }

            initialIsLiked = isLiked;
            initialLikeCount = likeCount;
        });
    }

    return (
        <div className="relative group  inline-flex items-center">
            <button
                onClick={handleLike}
                disabled={isGuest || isPending}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isLiked
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : "bg-gray-800 text-gray-400 border border-gray-700 hover:text-white"
                } ${isGuest ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
            >
                <svg
                    className="w-5 h-5 transition-transform active:scale-125"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        className={
                        isLiked
                            ? "fill-rose-500 stroke-rose-500"
                            : "fill-none stroke-gray-400 hover:stroke-gray-200"
                        }
                    />
                </svg>
                <span>{likeCount}</span>
            </button>

            {/* TOOLTIP FOR GUESTS */}
            {isGuest && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-50 whitespace-nowrap px-2.5 py-1 text-[10px] font-medium text-white bg-gray-900 border border-gray-700 rounded-md shadow-xl">
                    Login to like
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900" />
                </div>
            )}
        </div>
    );
}