"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h2 className="text-2xl font-semibold mb-4">Something went wrong!</h2>
      <p className="mb-4">{error?.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
