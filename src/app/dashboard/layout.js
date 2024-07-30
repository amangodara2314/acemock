import { Inter } from "next/font/google";
import "../globals.css";
import DashHeader from "@/components/DashboardHeader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }) {
  return (
    <main className={`${inter.variable} font-sans`}>
      <DashHeader />
      {children}
    </main>
  );
}
