"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Award, CheckCircle2, Flame, Hand, Headphones, MessageSquare, Sparkles, Star, Trophy } from "lucide-react";
import { LevelRing, QuestMeta, Rewards } from "@/components/quest-bits";
import { Empty, ErrorState, PageLoading, PageTitle, Panel, Stat } from "@/components/kit/ui";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { api, DEMO_GUILD_NAME, DEMO_MEMBER, type Reward, type Trigger } from "@/lib/api";
import { nf, TRIGGER } from "@/lib/format";

export default function ProgressPage() {
  const data = useApi(() => Promise.all([api.getProfile(DEMO_MEMBER.id), api.getProgress(DEMO_MEMBER.id)]), "progress");
  const [busy, setBusy] = useState(false);

  function announce(rewards: Reward[]) {
    for (const r of rewards) {
      toast.success(`Quest complete: ${r.quest_title}`, { description: `+${r.reward_xp} XP${r.reward_badge ? ` · badge “${r.reward_badge}”` : ""}${r.did_level_up ? ` · level ${r.new_level}!` : ""}` });
    }
  }

  async function act(action: () => Promise<Reward[] | void>, success: string) {
    setBusy(true);
    try {
      const rewards = await action();
      if (rewards && rewards.length) announce(rewards);
      else toast.success(success);
      data.reload();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const activity = (trigger: Trigger, value: number, label: string) =>
    act(async () => (await api.sendEvent(DEMO_MEMBER.id, trigger, value)).rewards_unlocked, label);

  async function seed() {
    await act(async () => { await api.seedDemo(); }, "Demo server loaded");
  }

  if (data.error) {
    return (
      <>
        <PageTitle title="My progress" />
        {data.error.includes("not found") ? (
          <div className="rounded-xl border bg-card"><Empty icon={Trophy} title="No progress yet" description="Load the demo server to see a member with levels, quests and badges." action={<Button onClick={seed} disabled={busy}><Sparkles />Load demo</Button>} /></div>
        ) : <ErrorState message={data.error} onRetry={data.reload} />}
      </>
    );
  }
  if (!data.data) return <PageLoading />;
  const [p, progress] = data.data;
  const pct = p.xp_for_next_level ? p.xp_in_level / p.xp_for_next_level : 0;

  return (
    <>
      <PageTitle title="My progress" description={<>{p.username} on <strong className="font-medium text-foreground">{DEMO_GUILD_NAME}</strong>.</>}
        actions={<Button variant="outline" onClick={seed} disabled={busy}><Sparkles />Load demo</Button>} />

      <div className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
        <div className="flex items-center gap-5 rounded-xl border bg-card px-5 py-4">
          <LevelRing level={p.level} progress={pct} />
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">Next level</p>
            <p className="mt-1 text-xl font-semibold tabular">{nf.format(p.xp_in_level)} <span className="text-sm font-normal text-muted-foreground">/ {nf.format(p.xp_for_next_level)} XP</span></p>
            <p className="mt-0.5 text-xs text-muted-foreground">{nf.format(p.lifetime_xp)} XP all-time</p>
          </div>
        </div>
        <Stat label="Season XP" icon={Sparkles} value={nf.format(p.season_xp)} />
        <Stat label="Reputation" icon={Star} value={p.reputation} hint="Endorsements from members" />
        <Stat label="Daily streak" icon={Flame} value={`${p.streak_days} day${p.streak_days === 1 ? "" : "s"}`} tone={p.streak_days >= 7 ? "warn" : undefined} />
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel title="Quests" description="Progress towards every active quest.">
          <ul className="divide-y">
            {progress.map((q) => (
              <li key={q.quest.id} className="space-y-2.5 px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 font-medium">{q.is_completed ? <CheckCircle2 className="size-4 text-ok" /> : null}{q.quest.title}</p>
                    <p className="text-sm text-muted-foreground">{q.quest.description}</p>
                  </div>
                  <QuestMeta quest={q.quest} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${q.percentage}%`, background: q.is_completed ? "var(--ok)" : "var(--primary)" }} /></div>
                  <span className="w-28 text-right text-xs text-muted-foreground tabular">{q.quest.trigger_type === "manual" ? (q.is_completed ? "awarded" : "staff-awarded") : `${q.current_value} / ${TRIGGER[q.quest.trigger_type]?.unit(q.target_value) ?? q.target_value}`}</span>
                </div>
                <Rewards quest={q.quest} />
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-5">
          <Panel title="Simulate activity" description="What the bot records as this member chats. Quests complete and pay out automatically." bodyClassName="grid grid-cols-1 gap-2 p-4">
            <Button variant="outline" disabled={busy} onClick={() => activity("message", 1, "+1 message counted")} className="justify-start"><MessageSquare />Post a message</Button>
            <Button variant="outline" disabled={busy} onClick={() => activity("voice", 10, "+10 voice minutes counted")} className="justify-start"><Headphones />Spend 10 min in voice</Button>
            <Button variant="outline" disabled={busy} onClick={() => act(async () => { await api.giveRep("u_2", DEMO_MEMBER.id, "Helped with a bug"); }, "RustaceanMax endorsed you")} className="justify-start"><Hand />Get endorsed by RustaceanMax</Button>
            <p className="text-xs text-muted-foreground">Endorsements have a cooldown per giver, so the third button works once.</p>
          </Panel>
          <Panel title="Badges">
            {p.badges.length === 0 ? <Empty title="No badges yet" description="Complete quests that award badges." /> : (
              <ul className="flex flex-wrap gap-2 p-4">
                {p.badges.map((b) => <li key={b} className="inline-flex items-center gap-1.5 rounded-lg border bg-warn/10 px-2.5 py-1.5 text-sm"><Award className="size-4 text-warn" />{b}</li>)}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
