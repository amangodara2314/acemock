import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Head from "next/head";

export default function Home() {
  return (
    <div className="bg-[#070707] text-white min-h-screen">
      <Head>
        <title>AcePrep</title>
        <meta
          name="description"
          content="AcePrep - AI Interview Prep SaaS for Developers"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
