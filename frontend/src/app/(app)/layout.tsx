import { QuestShell } from "@/components/quest-shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <QuestShell>{children}</QuestShell>;
}
