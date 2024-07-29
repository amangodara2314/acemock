"use client";
import Loader from "@/components/Loader";
import { getProviders, signIn } from "next-auth/react";

import { useEffect, useState } from "react";

export default function SignIn({ searchParams }) {
  const [providers, setProviders] = useState(null);
  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    fetchProviders();
  }, []);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/sunset.jpg')` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 bg-white bg-opacity-70 p-8 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg flex md:flex-row flex-col max-w-3xl w-full mx-4">
        <div className="w-full md:w-1/2 flex flex-col justify-center p-4">
          <h1 className="text-4xl font-bold text-purple-600 mb-4">
            Crack Your Next Interview!
          </h1>
          <p className="text-gray-800">
            Connect with us to explore new opportunities and experiences.
            Whether you are joining us for the first time or coming back, we are
            excited to have you here!
          </p>
        </div>
        <div className="w-full md:w-1/2 bg-white p-6 rounded-r-lg">
          <h2 className="text-2xl font-bold mb-6">Get Started with</h2>
          <div className="">
            <div className="mt-2 flex flex-col items-center space-y-3">
              {!providers && (
                <div className="my-[26px]">
                  <Loader />
                </div>
              )}
              {providers &&
                Object.values(providers).map((provider) => (
                  <button
                    key={provider.name}
                    onClick={() => signIn(provider.id)}
                    className="bg-gray-800 p-2 w-full rounded-md shadow-md text-sm font-medium text-gray-200 hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    {provider.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
