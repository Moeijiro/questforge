"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swords, Trophy, Sparkles, Shield, ArrowRight, Heart, Flame } from "lucide-react";
import { api, MemberProfile } from "@/lib/api";
import ProfileCard from "@/components/ProfileCard";

export default function DashboardPage() {
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const data = await api.getProfile("quest-demo-888", "u_1");
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSeedDemo() {
    setSeeding(true);
    try {
      await api.seedDemo();
      await loadProfile();
    } catch (err) {
      alert("Failed to seed demo data.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-400" />
            Progression Admin Hub
          </h1>
          <p className="text-xs text-zinc-400">
            Telemetry and progression control for <strong className="text-white">Apex Community League</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedDemo}
            disabled={seeding}
            className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {seeding ? "Seeding..." : "Seed Demo Quests & XP"}
          </button>
          <Link
            href="/quests"
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition glow-gold"
          >
            <Swords className="w-3.5 h-3.5" />
            Mission Directives
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Profile Card Preview */}
        <div className="md:col-span-6 space-y-3">
          <span className="text-xs font-mono uppercase text-zinc-400">Discord Member Card Preview</span>
          {profile && <ProfileCard profile={profile} />}
        </div>

        {/* Quick Hub Navigation */}
        <div className="md:col-span-6 space-y-4">
          <span className="text-xs font-mono uppercase text-zinc-400">Quick Modules</span>

          <Link
            href="/quests"
            className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white group-hover:text-amber-400 transition">Missions Engine</h4>
                <p className="text-xs text-zinc-400">Configure daily, weekly, and seasonal quest triggers.</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition" />
          </Link>

          <Link
            href="/leaderboard"
            className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white group-hover:text-purple-400 transition">Competitive Leaderboards</h4>
                <p className="text-xs text-zinc-400">Filter rankings across Season XP, Lifetime XP, and Rep.</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
