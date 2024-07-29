"use client";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-black text-white relative"
      style={{ background: 'url("/not-found.jpg") fixed center right' }}
    >
      <div className="absolute flex flex-col items-center right-32">
        <h1 className="text-4xl font-bold mb-1">Page Not Found</h1>
        <p className="text-xl text-gray-400 font-semibold">
          The page you are looking for does not exist.
        </p>
        <Link href="/" className="mt-4 px-4 py-2 bg-black text-white rounded">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
