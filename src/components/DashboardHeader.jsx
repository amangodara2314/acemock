"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

function DashHeader() {
  const { data } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  return (
    <header className="flex justify-between items-center shadow-md px-6 py-3 bg-[#F8F8F8] relative">
      <h1 className="text-xl font-bold text-purple-600">AcePrep</h1>
      <div
        onClick={() => {
          setIsVisible(!isVisible);
        }}
        className="cursor-pointer sm:hidden block"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </div>

      {isVisible && (
        <div
          className={`absolute bottom-[-55px] w-full flex justify-center left-0 transition-all duration-500 ease-in-out`}
        >
          <ul className="flex gap-3 text-sm rounded bg-[#F8F8F8] shadow py-2 px-2">
            <li>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/upgrade"
                className="text-gray-700 hover:text-gray-900"
              >
                Upgrade
              </Link>
            </li>
            <li>
              <Link
                href="/how-it-works"
                className="text-gray-700 hover:text-gray-900"
              >
                How it Works
              </Link>
            </li>
            {data && (
              <li>
                <span
                  onClick={() => {
                    signOut();
                  }}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Logout
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
      <nav className="sm:block hidden">
        <ul className="flex space-x-6">
          <li>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-gray-900"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/upgrade" className="text-gray-700 hover:text-gray-900">
              Upgrade
            </Link>
          </li>
          <li>
            <Link
              href="/how-it-works"
              className="text-gray-700 hover:text-gray-900"
            >
              How it Works
            </Link>
          </li>
          {data && (
            <li>
              <span
                onClick={() => {
                  signOut();
                }}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                Logout
              </span>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default DashHeader;
