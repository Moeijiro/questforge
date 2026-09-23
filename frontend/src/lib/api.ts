export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1").replace(/\/$/, "");
export const DEMO_GUILD = "quest-demo-888";
export const DEMO_GUILD_NAME = "Apex Community League";
/** The member whose progress the demo shows. */
export const DEMO_MEMBER = { id: "u_1", name: "CyberValkyrie" };

export type Trigger = "message" | "reaction" | "voice" | "reputation" | "manual";
export type Category = "daily" | "weekly" | "seasonal" | "permanent" | "event";

export interface Quest {
  id: number;
  guild_id: string;
  title: string;
  description: string;
  trigger_type: Trigger;
  category: Category;
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

export interface QuestProgress {
  quest: Quest;
  current_value: number;
  target_value: number;
  is_completed: boolean;
  percentage: number;
}

export interface Reward {
  quest_id: number;
  quest_title: string;
  reward_xp: number;
  reward_role_name: string | null;
  reward_badge: string | null;
  did_level_up: boolean;
  new_level: number;
}

export type NewQuest = Pick<Quest, "title" | "description" | "trigger_type" | "category" | "target_value" | "reward_xp" | "is_repeatable"> & { reward_role_name?: string; reward_badge_name?: string };
export type Board = "lifetime" | "season" | "reputation";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers: init?.body ? { "Content-Type": "application/json" } : undefined });
  } catch {
    throw new ApiError("Can't reach the QuestForge API. Is the backend running on port 8000?", 0);
  }
  if (!res.ok) {
    let message = `Request failed (HTTP ${res.status}).`;
    try {
      const data = await res.json();
      if (typeof data?.detail === "string") message = data.detail;
      else if (Array.isArray(data?.detail) && data.detail[0]?.msg) message = String(data.detail[0].msg);
    } catch {
      /* not JSON */
    }
    throw new ApiError(message, res.status);
  }
  return res.json() as Promise<T>;
}

const post = (body?: unknown): RequestInit => ({ method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });

export const api = {
  getQuests: (category = "all", guild = DEMO_GUILD) => request<Quest[]>(`/quests/${guild}?category=${category}`),
  createQuest: (quest: NewQuest, guild = DEMO_GUILD) => request<Quest>(`/quests/${guild}`, post(quest)),
  getProgress: (userId: string, guild = DEMO_GUILD) => request<QuestProgress[]>(`/quests/${guild}/progress/${userId}`),
  sendEvent: (userId: string, eventType: Trigger, value = 1, guild = DEMO_GUILD) =>
    request<{ rewards_unlocked: Reward[] }>(`/quests/${guild}/event?${new URLSearchParams({ user_id: userId, event_type: eventType, value: String(value) })}`, post()),
  getProfile: (userId: string, guild = DEMO_GUILD) => request<MemberProfile>(`/profiles/${guild}/${userId}`),
  giveRep: (fromUserId: string, toUserId: string, reason?: string, guild = DEMO_GUILD) =>
    request<{ new_reputation: number; message: string }>(`/profiles/rep/${guild}`, post({ from_user_id: fromUserId, to_user_id: toUserId, reason })),
  getLeaderboard: (sortBy: Board = "lifetime", guild = DEMO_GUILD) => request<LeaderboardData>(`/leaderboards/${guild}?sort_by=${sortBy}`),
  seedDemo: () => request<{ message: string }>(`/demo/seed`, post()),
};
