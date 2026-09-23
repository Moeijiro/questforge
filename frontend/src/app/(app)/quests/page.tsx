"use client";

import { useEffect, useState } from "react";
import { Sparkles, Plus, Filter, Trophy, Swords, Shield } from "lucide-react";
import { api, Quest } from "@/lib/api";
import QuestCard from "@/components/QuestCard";

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Quest Form
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [trigger, setTrigger] = useState("message");
  const [cat, setCat] = useState<"daily" | "weekly" | "seasonal" | "permanent" | "event">("daily");
  const [target, setTarget] = useState(5);
  const [xp, setXp] = useState(150);
  const [badge, setBadge] = useState("");
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    loadQuests();
  }, [selectedCategory]);

  async function loadQuests() {
    setLoading(true);
    try {
      const data = await api.getQuests("quest-demo-888", selectedCategory);
      setQuests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.createQuest("quest-demo-888", {
        title,
        description: desc,
        trigger_type: trigger,
        category: cat,
        target_value: target,
        reward_xp: xp,
        reward_badge_name: badge.trim() || undefined,
        reward_role_name: roleName.trim() || undefined,
        reward_role_id: roleName.trim() ? "role-custom" : undefined,
      });
      setShowCreateModal(false);
      setTitle("");
      setDesc("");
      await loadQuests();
    } catch (err) {
      alert("Failed to create quest.");
    }
  }

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Swords className="w-6 h-6 text-amber-400" />
            Community Missions Board
          </h1>
          <p className="text-xs text-zinc-400">
            Active rule-governed quests for <strong className="text-white">Apex Community League</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories</option>
            <option value="daily">Daily Quests</option>
            <option value="weekly">Weekly Quests</option>
            <option value="seasonal">Seasonal</option>
            <option value="permanent">Permanent</option>
          </select>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition glow-gold"
          >
            <Plus className="w-4 h-4" />
            New Quest
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs text-zinc-400 font-mono">Loading mission directives...</div>
      ) : quests.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-500 font-mono">
          No quests found for category &apos;{selectedCategory}&apos;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests.map((q) => (
            <QuestCard key={q.id} quest={q} />
          ))}
        </div>
      )}

      {/* Create Quest Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Create Community Quest
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Quest Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bug Squasher Challenge"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Description</label>
              <textarea
                rows={2}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Explain the mission requirements clearly..."
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Trigger Type</label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="message">Discord Message</option>
                  <option value="voice">Voice Stage Session</option>
                  <option value="reputation">Reputation Endorsement</option>
                  <option value="manual">Staff Verification</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Category</label>
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="permanent">Permanent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Target Count</label>
                <input
                  type="number"
                  min={1}
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">XP Reward</label>
                <input
                  type="number"
                  min={10}
                  step={50}
                  value={xp}
                  onChange={(e) => setXp(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Optional Trophy / Badge Name</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Master Bug Hunter"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-xs text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs"
              >
                Deploy Quest
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
