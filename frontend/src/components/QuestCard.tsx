import { Quest } from "@/lib/api";
import { Sparkles, Shield, Trophy } from "lucide-react";

interface QuestCardProps {
  quest: Quest;
}

const CATEGORY_COLORS: Record<string, string> = {
  daily: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  weekly: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  seasonal: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  permanent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  event: "bg-rose-500/10 text-rose-400 border-rose-500/30",
};

export default function QuestCard({ quest }: QuestCardProps) {
  const catColor = CATEGORY_COLORS[quest.category] || CATEGORY_COLORS.daily;

  return (
    <div className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700/80 transition flex flex-col justify-between space-y-4 shadow-sm">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${catColor}`}>
            {quest.category}
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            Target: {quest.target_value} {quest.trigger_type}
          </span>
        </div>

        <h4 className="font-semibold text-sm text-white">{quest.title}</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">{quest.description}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-800/60 text-xs">
        <span className="font-bold text-amber-400 flex items-center gap-1 font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          +{quest.reward_xp} XP
        </span>

        <div className="flex items-center gap-1.5">
          {quest.reward_badge_name && (
            <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-amber-300 font-mono flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              {quest.reward_badge_name}
            </span>
          )}
          {quest.reward_role_name && (
            <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-blue-300 font-mono flex items-center gap-1">
              <Shield className="w-3 h-3 text-blue-400" />
              @{quest.reward_role_name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
