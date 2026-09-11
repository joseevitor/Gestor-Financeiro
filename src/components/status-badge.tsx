import { StatusDivida } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<StatusDivida, { label: string; bg: string; text: string }> = {
  nao_paga: { label: "Não paga", bg: "bg-status-unpaid-soft", text: "text-status-unpaid" },
  parcial: { label: "Parcial", bg: "bg-status-partial-soft", text: "text-status-partial" },
  paga: { label: "Paga", bg: "bg-status-paid-soft", text: "text-status-paid" },
};

export default function StatusBadge({ status }: { status: StatusDivida }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        config.bg,
        config.text
      )}
    >
      {config.label}
    </span>
  );
}
