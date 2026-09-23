import { MemberProfile } from "@/lib/api";
import { Award, Flame, Heart, Shield, Sparkles, Trophy } from "lucide-react";

interface ProfileCardProps {
  profile: MemberProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const pct = Math.min(100, Math.max(0, Math.round((profile.xp_in_level / (profile.xp_for_next_level || 1)) * 100)));

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Ambient background accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Avatar & Level */}
      <div className="flex items-center gap-4">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.username}
            className="w-16 h-16 rounded-2xl border-2 border-amber-500/40 object-cover shadow"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold text-amber-400">
            {profile.username.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-white">{profile.username}</h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold">
              LVL {profile.level}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            {profile.lifetime_xp.toLocaleString()} Lifetime XP
          </p>
        </div>
      </div>

      {/* XP Level Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-zinc-400">Level {profile.level}</span>
          <span className="text-amber-400 font-semibold">
            {profile.xp_in_level} / {profile.xp_for_next_level} XP ({pct}%)
          </span>
        </div>
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <p className="text-zinc-400 font-mono text-[10px] uppercase">Reputation</p>
            <p className="font-bold text-white text-sm">+{profile.reputation} Rep</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <p className="text-zinc-400 font-mono text-[10px] uppercase">Streak</p>
            <p className="font-bold text-white text-sm">{profile.streak_days} Days</p>
          </div>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="space-y-2 pt-2 border-t border-zinc-800/60">
        <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
          Unlocked Badges ({profile.badges.length})
        </span>
        <div className="flex flex-wrap gap-1.5">
          {profile.badges.length > 0 ? (
            profile.badges.map((b) => (
              <span
                key={b}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700/60 text-xs text-amber-300 font-medium flex items-center gap-1.5 shadow-sm"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                {b}
              </span>
            ))
          ) : (
            <span className="text-xs text-zinc-500 italic">No achievements unlocked yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}
