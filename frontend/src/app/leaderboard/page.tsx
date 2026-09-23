"use client";

import { useEffect, useState } from "react";
import { Trophy, Flame, Heart, Medal, Sparkles } from "lucide-react";
import { api, LeaderboardEntry } from "@/lib/api";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<"lifetime" | "season" | "reputation">("lifetime");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [sortBy]);

  async function loadLeaderboard() {
    setLoading(true);
    try {
      const data = await api.getLeaderboard("quest-demo-888", sortBy);
      setEntries(data.entries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Guild Leaderboard
          </h1>
          <p className="text-xs text-zinc-400">
            Real competitive rankings across verified missions, XP, and reputation points.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setSortBy("lifetime")}
            className={`px-3 py-1.5 rounded-lg transition ${
              sortBy === "lifetime" ? "bg-amber-500 text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            All-Time XP
          </button>
          <button
            onClick={() => setSortBy("season")}
            className={`px-3 py-1.5 rounded-lg transition ${
              sortBy === "season" ? "bg-amber-500 text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Season 1 XP
          </button>
          <button
            onClick={() => setSortBy("reputation")}
            className={`px-3 py-1.5 rounded-lg transition ${
              sortBy === "reputation" ? "bg-amber-500 text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Reputation
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs text-zinc-400 font-mono">Calculating rank positions...</div>
      ) : entries.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-500 font-mono">
          No leaderboard entries recorded.
        </div>
      ) : (
        <div className="border border-zinc-800 rounded-xl bg-zinc-900/40 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4 font-mono">XP Score</th>
                <th className="py-3 px-4">Reputation</th>
                <th className="py-3 px-4">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {entries.map((entry) => {
                const isTop1 = entry.rank === 1;
                const isTop2 = entry.rank === 2;
                const isTop3 = entry.rank === 3;

                return (
                  <tr key={entry.user_id} className="hover:bg-zinc-900/80 transition">
                    <td className="py-3 px-4 text-center font-bold font-mono">
                      {isTop1 && <span className="text-yellow-400 text-base">🥇</span>}
                      {isTop2 && <span className="text-zinc-300 text-base">🥈</span>}
                      {isTop3 && <span className="text-amber-600 text-base">🥉</span>}
                      {!isTop1 && !isTop2 && !isTop3 && (
                        <span className="text-zinc-500">#{entry.rank}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2.5">
                      {entry.avatar_url ? (
                        <img src={entry.avatar_url} alt="" className="w-7 h-7 rounded-full bg-zinc-800" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                          {entry.username.slice(0, 1)}
                        </div>
                      )}
                      <span className="font-semibold text-white">{entry.username}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-300">
                      <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-amber-400 font-bold">
                        LVL {entry.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {sortBy === "season" ? entry.season_xp.toLocaleString() : entry.lifetime_xp.toLocaleString()} XP
                    </td>
                    <td className="py-3 px-4 font-mono text-rose-400 font-bold flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
                      +{entry.reputation}
                    </td>
                    <td className="py-3 px-4 font-mono text-orange-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {entry.streak_days}d
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
