"use client";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
export default function Hero() {
  const router = useRouter();
  const { data } = useSession();
  return (
    <section className="flex flex-col justify-center items-center text-center py-20 sm:py-[150px] w-full">
      {/* <h2 className="text-5xl font-extrabold mb-4">AcePrep</h2> */}
      <h1 className="text-5xl font-normal mb-4">Ace Your Tech Interviews</h1>

      <p className="text-xl font-thin mb-8 w-[80%] md:w-[65%]">
        Our AI-driven platform provides the most comprehensive interview
        preparation experience. With personalized feedback and tailored
        practice, you are set to excel in your next interview and secure your
        dream job offer.
      </p>
      <button
        onClick={() => {
          if (!data || !data.user) {
            router.push("/signin");
          } else {
            router.push("/dashboard");
          }
        }}
        className="bg-white py-2 px-4 rounded font-semibold text-black"
      >
        Get Started
      </button>
    </section>
  );
}
