import Image from "next/image";
import Header from "@/components/header";
import Hero from "@/components/hero";
import LatestSection from "@/components/latest";
import BestNewMusic from "@/components/bestNewMusic";
import NewsSection from "@/components/newsection";
import SongsSection from "@/components/song";
import Footer from "@/components/footer";
import { Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* HEADER — full width, top */}
      <Header />
      <Hero />
      <LatestSection />
      <BestNewMusic />
      <NewsSection />
      <SongsSection />
      <Footer />


      {/* PAGE CONTENT */}
     
    </div>
  );
}