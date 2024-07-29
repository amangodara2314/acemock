"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
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
      </body>
    </html>
  );
}
