import { BrandMark } from "@/components/kit/brand";

/** A flag on a summit: a quest completed. */
export function Logo({ wordmark = true, className }: { wordmark?: boolean; className?: string }) {
  return (
    <BrandMark name="QuestForge" wordmark={wordmark} className={className}>
      <path d="M3 20l6-10 4 6 3-4 5 8z" />
      <path d="M13 10V3l4 2-4 2" />
    </BrandMark>
  );
}
