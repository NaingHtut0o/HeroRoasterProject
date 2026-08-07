"use client";

import { useEffect, useState, useTransition } from "react";
import { addCommentAction, editCommentAction, deleteCommentAction, getCharacterComments } from "../actions/commentActions";
import { CommentLikeButton } from "./CommentLikeButton";

type CommentItem = {
    id: string;
    content: string;
    createdAt: Date | string;
    user: {
        id: string;
        name: string;
        role: string;
    } | null;
    likeCount: number;
    isLiked: boolean;
};

type CommentSectionProps = {
    characterId: string;
    currentUserId?: string;
    currentUserRole?: string;
};

export default function CommentSection({
    characterId,
    currentUserId,
    currentUserRole,
}: CommentSectionProps) {
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [loadedCharacterId, setLoadedCharacterId] = useState<string | null>(null);
    const [inputContent, setInputContent] = useState("");
    const [isPending, startTransition] = useTransition();
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState<string>("");

    const isGuest = !currentUserRole || currentUserRole === "GUEST";
    const isAdmin = currentUserRole === "ADMIN";

    useEffect(() => {
        let isMounted = true;

        getCharacterComments(characterId).then((res) => {
            if (isMounted) {
                setComments(res.comments as CommentItem[]);
                setLoadedCharacterId(characterId);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [characterId]);

    const isLoading = loadedCharacterId !== characterId;

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (isGuest || !inputContent.trim()) return;

        const contentToSubmit = inputContent;
        setInputContent("");

        startTransition(async () => {
            const result = await addCommentAction(characterId, contentToSubmit);

            if (result.success && result.comment) {
                setComments((prev) => [result.comment as CommentItem, ...prev]);
                console.log("[COMMENT_CLIENT] Comment added", result.comment.id);
            } else {
                console.error("[COMMENT_CLIENT] Failed to add comment:", result.error);
                setInputContent(contentToSubmit); // Restore on error
            }
        });
    };

    const handleDeleteComment = (commentId: string) => {
        startTransition(async () => {
            const result = await deleteCommentAction(commentId);

            if (result.success) {
                setComments((prev) => prev.filter((c) => c.id !== commentId));
                console.log("[COMMENT_CLIENT] Deleted comment", commentId);
            } else {
                console.error("[COMMENT_CLIENT] Failed to delete comment:", result.error);
            }
        });
    };

    const handleStartEdit = (commentId: string, currentContent: string) => {
        setEditingCommentId(commentId);
        setEditContent(currentContent);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditContent("");
    };

    const handleSaveEdit = (commentId: string) => {
        if (!editContent.trim()) return;
        const contentToSubmit = editContent;

        startTransition(async () => {
            const result = await editCommentAction(commentId, contentToSubmit);

            if (result.success && result.comment) {
                setComments((prev) =>
                    prev.map((item) =>
                    item.id === commentId ? (result.comment as CommentItem) : item
                    )
                );
                console.log("[COMMENT_CLIENT] Comment edited", result.comment.id);
                setEditContent("");
                setEditingCommentId(null);
            } else {
                console.error("[COMMENT_CLIENT] Failed to edit comment:", result.error);
            }
        });
        // Trigger your update server action or function here
        // updateComment({ commentId, content: editContent });
    };

    return (
    <div className="flex flex-col h-full overflow-hidden">
      
        {/* 2. FIXED TOP SECTION: Header & Form */}
        <div className="flex-shrink-0 pb-4 border-b border-gray-800">
            <h3 className="text-xl font-bold text-white">Comments ({comments.length})</h3>

            {/* COMMENT INPUT FORM */}
            <form onSubmit={handleAddComment} className="relative">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputContent}
                        onChange={(e) => setInputContent(e.target.value)}
                        disabled={isGuest || isPending}
                        placeholder={isGuest ? "Login to leave a comment..." : "Write a comment..."}
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={isGuest || isPending || !inputContent.trim()}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:bg-gray-800 disabled:text-gray-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>

        {/* COMMENTS LIST */}
        {isLoading ? (
            <div className="text-xs text-gray-500 animate-pulse py-4">Loading comments...</div>
            ) : (
            <div className="space-y-3 overflow-y-auto custom-scrollbar">
                {comments.length === 0 ? (
                <p className="text-xs text-gray-500 py-4">No comments yet. Be the first to comment!</p>
                ) : (
                comments.map((comment) => {
                    const canDelete = isAdmin || (currentUserId && comment.user?.id === currentUserId);
                    const canEdit = currentUserId && comment.user?.id === currentUserId;
                    const isEditing = editingCommentId === comment.id;

                    return (
                    <div
                        key={comment.id}
                        className="relative group bg-gray-900/60 border border-gray-800/80 hover:border-gray-700/80 rounded-2xl p-4 transition-all"
                    >
                        {/* FLOATING ACTION BUTTONS (Top Right) */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        {/* EDIT BUTTON */}
                        {canEdit && !isEditing && (
                            <button
                                onClick={() => handleStartEdit(comment.id, comment.content)}
                                disabled={isPending}
                                title="Edit Comment"
                                className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-indigo-600/80 text-gray-400 hover:text-white border border-gray-700/60 transition-colors cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        )}

                        {/* DELETE BUTTON */}
                        {canDelete && !isEditing && (
                            <button
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={isPending}
                                title="Delete Comment"
                                className="p-1.5 rounded-lg bg-gray-800/80 hover:bg-rose-600/80 text-gray-400 hover:text-white border border-gray-700/60 transition-colors cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                        </div>

                        {/* HEADER: USER & DATE */}
                        <div className="flex items-center gap-2 mb-2 pr-16">
                            <span className="text-xs font-semibold text-white">
                                {comment.user?.name ?? "[Deleted User]"}
                            </span>
                            {comment.user?.role === "ADMIN" && (
                                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                                ADMIN
                                </span>
                            )}
                            <span className="text-[10px] text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {/* BODY: EDIT MODE VS VIEW MODE */}
                        {isEditing ? (
                            <div className="space-y-2 mt-2">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full bg-gray-950 border border-indigo-500/50 rounded-xl p-2.5 text-xs text-white focus:outline-none resize-none"
                                    rows={2}
                                />
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-2.5 py-1 text-xs text-gray-400 hover:text-white rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleSaveEdit(comment.id)}
                                        disabled={isPending || !editContent.trim()}
                                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-300 leading-relaxed break-words">
                                {comment.content}
                            </p>
                        )}
                        
                        {/* COMMENT FOOTER / LIKE BUTTON */}
                        <div className="flex items-center justify-between pt-1 border-t border-gray-800/40">
                            <CommentLikeButton
                                commentId={comment.id}
                                initialLikeCount={comment.likeCount}
                                initialIsLiked={comment.isLiked}
                                isGuest={isGuest}
                            />
                        </div>
                    </div>
                    );
                })
                )}
            </div>
            )}
        {/* {isLoading ? (
            <div className="text-sm text-gray-500 animate-pulse">Loading comments...</div>
        ) : (
            <div className="space-y-3">
                {comments.length === 0 ? (
                    <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
                ) : (
                comments.map((comment) => {
                    const canDelete = isAdmin || (currentUserId && comment.user?.id === currentUserId);

                    return (
                        <div
                            key={comment.id}
                            className="flex items-start justify-between border border-none p-4"
                        >
                            <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white">
                                    {comment.user?.name ?? "[Deleted User]"}
                                </span>
                                {comment.user?.role === "ADMIN" && (
                                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                                        ADMIN
                                    </span>
                                )}
                                <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                            </div>

                            {canDelete && (
                            <button
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={isPending}
                                className="text-gray-500 hover:text-rose-400 text-xs font-medium px-2 py-1 rounded transition-colors"
                            >
                                Delete
                            </button>
                            )}
                        </div>
                    );
                }))}
            </div>
        )} */}
    </div>
    );
}