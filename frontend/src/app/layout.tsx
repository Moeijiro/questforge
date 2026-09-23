import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "QuestForge | Discord Missions, Reputation & Progression Platform",
  description: "Rule-governed Discord community quests, streaks, reputation transfers, and role rewards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#09090B] text-[#FAFAFA] flex flex-col min-h-screen selection:bg-amber-500 selection:text-black">
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
