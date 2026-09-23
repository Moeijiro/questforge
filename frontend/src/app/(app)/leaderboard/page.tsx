"use client";

import { useState } from "react";
import { Crown, Flame, Trophy } from "lucide-react";
import { Empty, ErrorState, PageTitle, Panel, RowsLoading, Table, Td, Th } from "@/components/kit/ui";
import { useApi } from "@/hooks/use-api";
import { api, type Board, DEMO_MEMBER } from "@/lib/api";
import { nf } from "@/lib/format";
import { cn } from "@/lib/utils";

const BOARDS: { value: Board; label: string }[] = [
  { value: "lifetime", label: "All-time XP" },
  { value: "season", label: "This season" },
  { value: "reputation", label: "Reputation" },
];

const MEDAL = ["var(--warn)", "oklch(0.7 0.02 260)", "oklch(0.6 0.1 55)"];

export default function LeaderboardPage() {
  const [board, setBoard] = useState<Board>("lifetime");
  const data = useApi(() => api.getLeaderboard(board), board);
  const entries = data.data?.entries ?? [];
  const metric = (e: (typeof entries)[number]) => board === "reputation" ? `${e.reputation} rep` : `${nf.format(board === "season" ? e.season_xp : e.lifetime_xp)} XP`;

  return (
    <>
      <PageTitle title="Leaderboard" description="Ranked from real activity — levels come from XP, never set by hand." />
      <div className="mb-4 inline-flex rounded-lg border bg-card p-0.5" role="tablist" aria-label="Board">
        {BOARDS.map((b) => (
          <button key={b.value} type="button" role="tab" aria-selected={board === b.value} onClick={() => setBoard(b.value)}
            className={cn("rounded-md px-3 py-1.5 text-sm transition-colors", board === b.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>{b.label}</button>
        ))}
      </div>
      {data.error ? <ErrorState message={data.error} onRetry={data.reload} /> : (
        <>
          {entries.length >= 3 ? (
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {entries.slice(0, 3).map((e, i) => (
                <div key={e.user_id} className={cn("flex items-center gap-3 rounded-xl border bg-card px-5 py-4", i === 0 && "border-warn/40 bg-warn/5")}>
                  <span className="flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ background: MEDAL[i] }}>{i === 0 ? <Crown className="size-5" /> : i + 1}</span>
                  <span className="min-w-0"><span className="block truncate font-semibold">{e.username}</span><span className="text-sm text-muted-foreground">{metric(e)} · level {e.level}</span></span>
                </div>
              ))}
            </div>
          ) : null}
          <Panel bodyClassName="p-0">
            {!data.data ? <RowsLoading /> : entries.length === 0 ? <Empty icon={Trophy} title="Nobody on the board yet" description="Load the demo from My progress." /> : (
              <Table>
                <thead><tr><Th className="w-14">Rank</Th><Th>Member</Th><Th className="text-right">Level</Th><Th className="text-right">All-time XP</Th><Th className="text-right">Season XP</Th><Th className="text-right">Reputation</Th><Th className="text-right">Streak</Th></tr></thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.user_id} className={e.user_id === DEMO_MEMBER.id ? "bg-accent/60" : undefined}>
                      <Td className="font-mono text-xs text-muted-foreground">#{e.rank}</Td>
                      <Td><span className="flex items-center gap-2.5"><span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{e.username.slice(0, 2).toUpperCase()}</span><span className="font-medium">{e.username}</span>{e.user_id === DEMO_MEMBER.id ? <span className="text-xs text-muted-foreground">(you)</span> : null}</span></Td>
                      <Td className="text-right font-medium tabular">{e.level}</Td>
                      <Td className={cn("text-right tabular", board === "lifetime" && "font-semibold")}>{nf.format(e.lifetime_xp)}</Td>
                      <Td className={cn("text-right tabular", board === "season" && "font-semibold")}>{nf.format(e.season_xp)}</Td>
                      <Td className={cn("text-right tabular", board === "reputation" && "font-semibold")}>{e.reputation}</Td>
                      <Td className="text-right tabular"><span className="inline-flex items-center gap-1">{e.streak_days}<Flame className="size-3.5 text-warn" /></span></Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Panel>
        </>
      )}
    </>
  );
}
