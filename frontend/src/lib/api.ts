const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface Quest {
  id: number;
  guild_id: string;
  title: string;
  description: string;
  trigger_type: string;
  category: "daily" | "weekly" | "seasonal" | "permanent" | "event";
  target_value: number;
  reward_xp: number;
  reward_role_id?: string;
  reward_role_name?: string;
  reward_badge_name?: string;
  is_repeatable: boolean;
  is_active: boolean;
  created_at: string;
}

export interface MemberProfile {
  guild_id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  lifetime_xp: number;
  season_xp: number;
  level: number;
  reputation: number;
  streak_days: number;
  xp_in_level: number;
  xp_for_next_level: number;
  badges: string[];
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  avatar_url: string | null;
  level: number;
  lifetime_xp: number;
  season_xp: number;
  reputation: number;
  streak_days: number;
}

export interface LeaderboardData {
  guild_id: string;
  filter_type: string;
  entries: LeaderboardEntry[];
}

export const api = {
  async getQuests(guildId: string = "quest-demo-888", category: string = "all"): Promise<Quest[]> {
    const res = await fetch(`${API_URL}/quests/${guildId}?category=${category}`);
    if (!res.ok) throw new Error("Failed to load quests.");
    return res.json();
  },

  async createQuest(guildId: string = "quest-demo-888", quest: Partial<Quest>): Promise<Quest> {
    const res = await fetch(`${API_URL}/quests/${guildId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quest),
    });
    if (!res.ok) throw new Error("Failed to create quest.");
    return res.json();
  },

  async getProfile(guildId: string = "quest-demo-888", userId: string = "u_1"): Promise<MemberProfile> {
    const res = await fetch(`${API_URL}/profiles/${guildId}/${userId}`);
    if (!res.ok) throw new Error("Failed to load profile.");
    return res.json();
  },

  async giveRep(
    guildId: string = "quest-demo-888",
    fromUserId: string,
    toUserId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_URL}/profiles/rep/${guildId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from_user_id: fromUserId, to_user_id: toUserId, reason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Failed to award reputation." }));
      throw new Error(err.detail || "Failed to award reputation.");
    }
    return res.json();
  },

  async getLeaderboard(
    guildId: string = "quest-demo-888",
    sortBy: "lifetime" | "season" | "reputation" = "lifetime"
  ): Promise<LeaderboardData> {
    const res = await fetch(`${API_URL}/leaderboards/${guildId}?sort_by=${sortBy}`);
    if (!res.ok) throw new Error("Failed to load leaderboard.");
    return res.json();
  },

  async seedDemo(): Promise<void> {
    const res = await fetch(`${API_URL}/demo/seed`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to seed demo data.");
  },
};
