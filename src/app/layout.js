import { Inter } from "next/font/google";
import "./globals.css";
import GlobalContext from "@/context/GlobalContext";
import "tailwindcss/tailwind.css";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Ace Prep - AI-Powered Developer Interview Preparation",
  description:
    "Prepare for your next developer interview with our AI-powered app. Access unlimited personalized interviews, get detailed feedback with correct answers, and track your progress. Ideal for FullStack developers using React, Node.js, and Express.js. Upgrade your plan now for the best interview practice.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/ace-logo.png" />
      </head>
      <SessionWrapper>
        <body className={inter.className}>
          <main className={`${inter.variable} font-sans`}>
            <GlobalContext>{children}</GlobalContext>
          </main>
        </body>
      </SessionWrapper>
    </html>
  );
}
