"use client";

import Link from "next/link";
import { Sparkles, Trophy, Shield, Swords, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b border-[#27272A] bg-[#18181B]/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center group-hover:border-amber-400 transition">
            <Swords className="w-4 h-4 text-amber-400" />
          </div>
          <span className="font-bold tracking-tight text-white flex items-center gap-1.5">
            QuestForge
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono">
              Progression
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-medium">
          <Link
            href="/quests"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-zinc-950 transition font-bold glow-gold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Missions
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-zinc-300 hover:text-white transition"
          >
            <Trophy className="w-3.5 h-3.5" />
            Leaderboard
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-zinc-300 hover:text-white transition"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
