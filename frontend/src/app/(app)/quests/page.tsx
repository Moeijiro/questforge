"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, ScrollText } from "lucide-react";
import { QuestMeta, Rewards } from "@/components/quest-bits";
import { SelectField } from "@/components/kit/select-field";
import { Empty, ErrorState, PageTitle, RowsLoading } from "@/components/kit/ui";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import { api, type Category, type NewQuest, type Trigger } from "@/lib/api";
import { CATEGORY_LABEL, TRIGGER } from "@/lib/format";
import { cn } from "@/lib/utils";

const CATEGORIES = ["all", "daily", "weekly", "seasonal", "permanent", "event"] as const;
const EMPTY: NewQuest = { title: "", description: "", trigger_type: "message", category: "daily", target_value: 5, reward_xp: 150, is_repeatable: false };

export default function QuestBoardPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("all");
  const quests = useApi(() => api.getQuests(category), category);
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageTitle title="Quest board" description="Missions members can complete for XP, roles and badges." actions={<Button onClick={() => setOpen(true)}><Plus />New quest</Button>} />
      <div className="mb-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Category">
        {CATEGORIES.map((c) => (
          <button key={c} type="button" role="tab" aria-selected={category === c} onClick={() => setCategory(c)}
            className={cn("rounded-full border px-3 py-1 text-sm transition-colors", category === c ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground")}>
            {c === "all" ? "All" : CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>
      {quests.error ? <ErrorState message={quests.error} onRetry={quests.reload} /> : !quests.data ? <div className="rounded-xl border bg-card"><RowsLoading /></div>
        : quests.data.length === 0 ? <div className="rounded-xl border bg-card"><Empty icon={ScrollText} title="No quests here" description="Create one, or load the demo from My progress." /></div>
        : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {quests.data.map((q) => (
              <article key={q.id} className="flex flex-col rounded-xl border bg-card p-5">
                <QuestMeta quest={q} />
                <h2 className="mt-3 font-semibold tracking-tight">{q.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{q.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">Goal: <span className="font-medium text-foreground">{TRIGGER[q.trigger_type]?.unit(q.target_value) ?? q.target_value}</span></p>
                <div className="mt-auto pt-4"><Rewards quest={q} /></div>
              </article>
            ))}
          </div>
        )}
      <NewQuestDialog open={open} onOpenChange={setOpen} onCreated={quests.reload} />
    </>
  );
}

function NewQuestDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: () => void }) {
  const [q, setQ] = useState<NewQuest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof NewQuest>(key: K, value: NewQuest[K]) => setQ((c) => ({ ...c, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createQuest({ ...q, reward_role_name: q.reward_role_name || undefined, reward_badge_name: q.reward_badge_name || undefined });
      toast.success("Quest published");
      onCreated();
      onOpenChange(false);
      setQ(EMPTY);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>New quest</DialogTitle><DialogDescription>Counted automatically from the activity the bot sees.</DialogDescription></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5"><Label htmlFor="q-title">Title</Label><Input id="q-title" required minLength={2} maxLength={255} value={q.title} onChange={(e) => set("title", e.target.value)} placeholder="Weekend helper" /></div>
          <div className="space-y-1.5"><Label htmlFor="q-desc">Description</Label><Textarea id="q-desc" required minLength={2} rows={2} value={q.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label htmlFor="q-trig">Counts</Label><SelectField id="q-trig" label="Counts" value={q.trigger_type} onChange={(v) => set("trigger_type", v as Trigger)} options={Object.entries(TRIGGER).map(([value, t]) => ({ value, label: t.label }))} /></div>
            <div className="space-y-1.5"><Label htmlFor="q-cat">Category</Label><SelectField id="q-cat" label="Category" value={q.category} onChange={(v) => set("category", v as Category)} options={Object.entries(CATEGORY_LABEL).map(([value, label]) => ({ value, label }))} /></div>
            <div className="space-y-1.5"><Label htmlFor="q-target">Goal</Label><Input id="q-target" type="number" min={1} max={10000} required value={q.target_value} onChange={(e) => set("target_value", Number(e.target.value))} /></div>
            <div className="space-y-1.5"><Label htmlFor="q-xp">Reward XP</Label><Input id="q-xp" type="number" min={10} max={10000} required value={q.reward_xp} onChange={(e) => set("reward_xp", Number(e.target.value))} /></div>
            <div className="space-y-1.5"><Label htmlFor="q-role">Role reward</Label><Input id="q-role" value={q.reward_role_name ?? ""} onChange={(e) => set("reward_role_name", e.target.value)} placeholder="Optional" /></div>
            <div className="space-y-1.5"><Label htmlFor="q-badge">Badge</Label><Input id="q-badge" value={q.reward_badge_name ?? ""} onChange={(e) => set("reward_badge_name", e.target.value)} placeholder="Optional" /></div>
          </div>
          <label className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-sm">Repeatable — can be earned again after completing<Switch checked={q.is_repeatable} onCheckedChange={(v) => set("is_repeatable", v)} /></label>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Publishing…" : "Publish quest"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
