import { cn } from "@/lib/utils";
import type { Status } from "@/data/mockData";

const styles: Record<Status, string> = {
  Open: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30",
  "In Progress": "bg-neon-purple/20 text-neon-purple border-neon-purple/30",
  Resolved: "bg-neon-pink/20 text-neon-pink border-neon-pink/30",
  Verified: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  Closed: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status])}>
      {status}
    </span>
  );
}
