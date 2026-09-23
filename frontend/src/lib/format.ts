import type { Category, Trigger } from "@/lib/api";

export const CATEGORY_LABEL: Record<Category, string> = {
  daily: "Daily", weekly: "Weekly", seasonal: "Seasonal", permanent: "Permanent", event: "Event",
};

/** What one unit of progress means for each trigger. */
export const TRIGGER: Record<Trigger, { label: string; unit: (n: number) => string }> = {
  message: { label: "Messages", unit: (n) => `${n} message${n === 1 ? "" : "s"}` },
  reaction: { label: "Reactions", unit: (n) => `${n} reaction${n === 1 ? "" : "s"}` },
  voice: { label: "Voice time", unit: (n) => `${n} min in voice` },
  reputation: { label: "Reputation", unit: (n) => `${n} endorsement${n === 1 ? "" : "s"}` },
  manual: { label: "Staff-awarded", unit: () => "awarded by staff" },
};

export const nf = new Intl.NumberFormat("en-GB");
