"use client";

import { useState, useTransition } from "react";
import { toggleCommentLikeAction } from "../actions/commentLikes";

interface CommentLikeButtonProps {
  commentId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  isGuest: boolean;
}

export function CommentLikeButton({
  commentId,
  initialLikeCount,
  initialIsLiked,
  isGuest,
}: CommentLikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isPending, startTransition] = useTransition();

  const handleToggleLike = () => {
    if (isGuest || isPending) return;

    // Optimistic UI updates
    const nextIsLiked = !isLiked;
    setIsLiked(nextIsLiked);
    setLikeCount((prev) => (nextIsLiked ? prev + 1 : prev - 1));

    startTransition(async () => {
      const result = await toggleCommentLikeAction(commentId);
      if (!result.success) {
        // Revert optimistic updates if server fails
        setIsLiked(!nextIsLiked);
        setLikeCount((prev) => (nextIsLiked ? prev - 1 : prev + 1));
      }
    });
  };

  return (
    <div className="relative group  inline-flex items-center">
        <button
            onClick={handleToggleLike}
            disabled={isGuest || isPending}
            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-all cursor-pointer disabled:cursor-not-allowed ${
                isLiked
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                : "bg-gray-800/40 border-gray-700/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
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
            <span className="font-semibold text-[11px]">{likeCount}</span>
        </button>
    </div>
  );
}