"use client";

import { Gauge, ScrollText, Trophy } from "lucide-react";
import { Logo } from "@/components/brand";
import { AppShell, ShellAccount, type NavItem } from "@/components/kit/shell";
import { DEMO_GUILD_NAME, DEMO_MEMBER } from "@/lib/api";

const NAV: NavItem[] = [
  { href: "/dashboard", label: "My progress", icon: Gauge },
  { href: "/quests", label: "Quest board", icon: ScrollText },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function QuestShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell brand={<Logo />} items={NAV}
      footer={<ShellAccount name={DEMO_MEMBER.name} detail={DEMO_GUILD_NAME} note="Demo server — members and activity are generated; no Discord account is connected." />}>
      {children}
    </AppShell>
  );
}
