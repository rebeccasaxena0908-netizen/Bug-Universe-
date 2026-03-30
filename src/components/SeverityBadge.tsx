import { cn } from "@/lib/utils";
import type { Severity } from "@/data/mockData";

const styles: Record<Severity, string> = {
  Critical: "severity-critical text-white",
  High: "severity-high text-white",
  Medium: "severity-medium text-background",
  Low: "severity-low text-background",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", styles[severity])}>
      {severity}
    </span>
  );
}
