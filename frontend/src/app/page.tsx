import Link from "next/link";
import { Swords, Trophy, Sparkles, ArrowRight, ShieldCheck, Heart, Flame, Zap, Award } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Event-Driven Discord Progression • Rule Engine Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Level up your community with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300">
            meaningful quests.
          </span>
        </h1>

        <p className="text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Replace noisy XP spam bots with configurable missions, peer reputation endorsements, seasonal resets, and automated Discord role provisioning.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/quests"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold flex items-center justify-center gap-2 transition glow-gold"
          >
            Explore Active Quests
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/leaderboard"
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-200 font-medium transition"
          >
            View Guild Leaderboard
          </Link>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white">Discord Event Engine</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Trigger progress on real community interactions: constructive technical messages, voice stage participation, and event attendance.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white">Peer Reputation Transfer</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Empower members to award <code>/rep</code> with strict 12-hour cooldowns, anti-self-rep safeguards, and daily quotas to eliminate gaming.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white">Seasonal Resets & Roles</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Run competitive 90-day seasons that archive leaderboards while preserving all-time status, rewarding top contributors with exclusive roles.
          </p>
        </div>
      </section>
    </div>
  );
}
