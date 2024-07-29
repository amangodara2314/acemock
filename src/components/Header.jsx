"use client";

import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function Header() {
  const router = useRouter();
  const { data } = useSession();
  return (
    <header className="py-4 px-0 sm:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold">AcePrep</h1>
        <div className="flex items-center gap-4">
          <nav className="flex space-x-3 sm:space-x-4">
            <a href="#features" className="text-gray-200 hover:text-white">
              Features
            </a>
            <a href="#pricing" className="text-gray-200 hover:text-white">
              Pricing
            </a>
          </nav>
          <button
            onClick={() => {
              if (!data || !data.user) {
                router.push("/signin");
              } else {
                router.push("/dashboard");
              }
            }}
            className="bg-white py-2 px-4 rounded font-semibold text-black hidden sm:inline"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
