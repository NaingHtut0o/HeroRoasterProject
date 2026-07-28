"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Rendering error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-red-400 mb-2">Something went wrong!</h2>
      <p className="text-gray-400 mb-6 max-w-md text-sm">
        {error.message || "An error occurred while rendering the character roster."}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium text-sm"
      >
        Try Again
      </button>
    </div>
  );
}