"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-black/60 dark:text-white/60">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
