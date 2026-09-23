import { Swords } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#27272A] bg-[#18181B] py-10 mt-20 text-xs text-zinc-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-amber-500" />
          <span>QuestForge — Discord Missions, Reputation & Progression Platform.</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/Moeijiro/questforge"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
          >
            GitHub Repository
          </a>
          <span>MIT License © 2026</span>
        </div>
      </div>
    </footer>
  );
}
