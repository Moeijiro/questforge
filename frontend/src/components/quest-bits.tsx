import { Award, Repeat, Shield, Sparkles } from "lucide-react";
import { Tag } from "@/components/kit/ui";
import type { Quest } from "@/lib/api";
import { CATEGORY_LABEL, nf, TRIGGER } from "@/lib/format";

/** The rewards a quest pays out: XP, plus an optional role and badge. */
export function Rewards({ quest }: { quest: Quest }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 font-medium text-primary"><Sparkles className="size-3" />{nf.format(quest.reward_xp)} XP</span>
      {quest.reward_role_name ? <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground"><Shield className="size-3" />@{quest.reward_role_name}</span> : null}
      {quest.reward_badge_name ? <span className="inline-flex items-center gap-1 rounded-md bg-warn/15 px-1.5 py-0.5 text-foreground/80"><Award className="size-3 text-warn" />{quest.reward_badge_name}</span> : null}
    </div>
  );
}

export function QuestMeta({ quest }: { quest: Quest }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Tag>{CATEGORY_LABEL[quest.category] ?? quest.category}</Tag>
      <Tag>{TRIGGER[quest.trigger_type]?.label ?? quest.trigger_type}</Tag>
      {quest.is_repeatable ? <Tag className="gap-1"><Repeat className="size-3" />Repeatable</Tag> : null}
    </div>
  );
}

/** Level shown as a ring filled by progress to the next level. */
export function LevelRing({ level, progress }: { level: number; progress: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-24 shrink-0">
      <svg viewBox="0 0 80 80" className="size-24 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--muted)" strokeWidth="7" />
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--primary)" strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} className="transition-[stroke-dashoffset] duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-medium text-muted-foreground">LEVEL</span>
        <span className="text-2xl leading-none font-semibold tabular">{level}</span>
      </div>
    </div>
  );
}
