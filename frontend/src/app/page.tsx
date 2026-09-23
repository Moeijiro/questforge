"use client";

import Link from "next/link";
import { ArrowRight, Award, CalendarRange, Flame, Hand, Repeat, ScrollText, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { Logo } from "@/components/brand";
import { LevelRing } from "@/components/quest-bits";
import { CtaBand, FeatureCard, Hero, HeroButton, HeroCard, InfoCard, Section, SiteFooter, SiteNav } from "@/components/kit/site";
import { Button } from "@/components/ui/button";

function Preview() {
  const quests = [
    { title: "Daily Technical Contributor", value: 3, target: 5, unit: "messages" },
    { title: "Community Guide", value: 1, target: 2, unit: "endorsements" },
    { title: "Voice Stage Enthusiast", value: 30, target: 30, unit: "min in voice", done: true },
  ];
  return (
    <HeroCard>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="flex items-center gap-4 md:flex-col md:items-start">
          <LevelRing level={19} progress={0.42} />
          <div className="space-y-1 text-sm">
            <p className="font-semibold">CyberValkyrie</p>
            <p className="flex items-center gap-1.5 text-muted-foreground"><Flame className="size-4 text-warn" />12-day streak</p>
            <p className="flex items-center gap-1.5 text-muted-foreground"><Award className="size-4 text-warn" />2 badges</p>
          </div>
        </div>
        <ul className="space-y-4">
          {quests.map((q) => (
            <li key={q.title} className="space-y-1.5">
              <div className="flex justify-between gap-3 text-sm"><span className="font-medium">{q.title}</span><span className="text-xs text-muted-foreground tabular">{q.value} / {q.target} {q.unit}</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${(q.value / q.target) * 100}%`, background: q.done ? "var(--ok)" : "var(--primary)" }} /></div>
            </li>
          ))}
        </ul>
      </div>
    </HeroCard>
  );
}

export default function Landing() {
  return (
    <>
      <SiteNav brand={<Logo />} links={[["#how", "How it works"], ["#features", "Features"], ["#use-cases", "Use cases"]]}
        actions={<Button asChild size="sm"><Link href="/dashboard">Open the demo</Link></Button>} />
      <main id="main">
        <Hero eyebrow="Quests for Discord communities"
          title="Reward the members who actually help."
          description="QuestForge replaces XP-per-message spam with quests you design — post in the right channels, help others, show up in voice — and pays out XP, roles and badges when they're done. Reputation has cooldowns, so it can't be farmed."
          actions={<><HeroButton href="/dashboard">See a member&apos;s progress<ArrowRight data-icon="inline-end" /></HeroButton><HeroButton href="#how" variant="outline">How it works</HeroButton></>}
          note="The demo server has quests in progress, badges and a leaderboard."
          visual={<Preview />} />

        <Section id="how" eyebrow="How it works" title="Activity in, rewards out">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={ScrollText} title="Design a quest" index={1}>Pick what counts — messages, voice minutes, endorsements — and a goal.</FeatureCard>
            <FeatureCard icon={Sparkles} title="The bot counts" index={2} delay={0.05}>Every event advances the member&apos;s quests; no commands to run.</FeatureCard>
            <FeatureCard icon={Award} title="Rewards pay out" index={3} delay={0.1}>XP, a role and a badge the moment the goal is reached.</FeatureCard>
            <FeatureCard icon={Trophy} title="Levels and boards" index={4} delay={0.15}>Levels follow one XP curve; boards rank all-time, season and reputation.</FeatureCard>
          </div>
        </Section>

        <Section id="features" eyebrow="Built to resist farming" title="Progression people can trust" tinted>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon={Hand} title="Reputation with cooldowns">One endorsement per giver per cooldown — including brand-new accounts. No self-rep.</FeatureCard>
            <FeatureCard icon={ShieldCheck} title="Bounded events" delay={0.05}>An event counts 1–100 units; negative or huge values are refused.</FeatureCard>
            <FeatureCard icon={Repeat} title="Repeatable quests" delay={0.1}>Daily quests reset after completing, keeping any overflow, and pay out again.</FeatureCard>
            <FeatureCard icon={Flame} title="Gentle streaks">A missed day restarts the streak at one — no punishing decay.</FeatureCard>
            <FeatureCard icon={CalendarRange} title="Seasons" delay={0.05}>Season XP ranks the current season while all-time XP keeps levels.</FeatureCard>
            <FeatureCard icon={Trophy} title="Honest leaderboard" delay={0.1}>Only members with real activity appear — looking someone up never adds them.</FeatureCard>
          </div>
        </Section>

        <Section id="use-cases" eyebrow="Use cases" title="For communities that want more than chatter" last>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard title="Open-source projects">Reward answering questions and reviewing, not just posting.</InfoCard>
            <InfoCard title="Gaming guilds" delay={0.05}>Weekly voice-night quests and seasonal ladders with role rewards.</InfoCard>
            <InfoCard title="Learning communities">Streaks and badges for showing up and helping classmates.</InfoCard>
            <InfoCard title="Brand communities" delay={0.05}>Event quests that turn launches into something members join in on.</InfoCard>
          </div>
          <CtaBand title="Complete a quest in the demo" description="Post a few messages, spend time in voice, get endorsed — and watch XP, badges and the level ring move."
            action={<Button asChild size="lg" variant="secondary" className="h-11 px-5"><Link href="/dashboard">Open the demo<ArrowRight data-icon="inline-end" /></Link></Button>} />
        </Section>
      </main>
      <SiteFooter brand={<Logo />} right={<><ShieldCheck className="size-3.5" />Reputation can&apos;t be farmed</>} />
    </>
  );
}
