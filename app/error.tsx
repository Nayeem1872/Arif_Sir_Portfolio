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
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="bg-bg relative flex h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-gradient text-6xl font-bold sm:text-8xl">Error</h1>
      <pre className="text-text-muted bg-secondary/10 mt-2 mb-8 max-w-md rounded p-4 text-left text-xs whitespace-pre-wrap sm:text-base">
        {error?.message}
      </pre>

      <button
        onClick={() => reset()}
        className="text-fg border-fg hover:bg-fg hover:text-bg mb-6 inline-flex items-center gap-2 rounded border px-4 py-2 transition"
      >
        Try again
      </button>
    </div>
  );
}
