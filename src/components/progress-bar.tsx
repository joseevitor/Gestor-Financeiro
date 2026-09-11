import { cn } from "@/lib/utils";
import { StatusDivida } from "@/lib/types";

const BAR_COLOR: Record<StatusDivida, string> = {
  nao_paga: "bg-status-unpaid",
  parcial: "bg-status-partial",
  paga: "bg-status-paid",
};

export default function ProgressBar({
  percent,
  status,
}: {
  percent: number;
  status: StatusDivida;
}) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
      <div
        className={cn("h-full rounded-full transition-all", BAR_COLOR[status])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
