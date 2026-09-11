import Link from "next/link";
import PageHeader from "@/components/page-header";
import StatusBadge from "@/components/status-badge";
import ProgressBar from "@/components/progress-bar";
import { getDividas, getGastos, getRendimentos } from "@/lib/store";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  percentualPago,
  saldoDevedor,
  statusDivida,
  totalPago,
} from "@/lib/types";
import { ArrowUpRight, ArrowDownRight, ScaleIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [dividas, gastos, rendimentos] = await Promise.all([
    getDividas(),
    getGastos(),
    getRendimentos(),
  ]);

  const totalRendimentos = rendimentos.reduce((a, r) => a + r.valor, 0);
  const totalGastos = gastos.reduce((a, g) => a + g.valor, 0);
  const saldoMes = totalRendimentos - totalGastos;

  const totalDividasAberto = dividas.reduce((a, d) => a + saldoDevedor(d), 0);
  const totalDividasOriginal = dividas.reduce((a, d) => a + d.valorTotal, 0);
  const totalJaPago = dividas.reduce((a, d) => a + totalPago(d), 0);
  const progressoGeralDividas =
    totalDividasOriginal > 0 ? (totalJaPago / totalDividasOriginal) * 100 : 0;

  const dividasPrioritarias = [...dividas]
    .filter((d) => statusDivida(d) !== "paga")
    .sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime())
    .slice(0, 3);

  return (
    <>
      <PageHeader
        title="Visão geral"
        subtitle="Um retrato rápido de para onde o dinheiro está indo — e o quanto falta para zerar as dívidas."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Saldo do mês"
          value={formatCurrency(saldoMes)}
          tone={saldoMes >= 0 ? "positive" : "negative"}
          icon={saldoMes >= 0 ? ArrowUpRight : ArrowDownRight}
          detail={`${formatCurrency(totalRendimentos)} entrou · ${formatCurrency(totalGastos)} saiu`}
        />
        <SummaryCard
          label="Dívidas em aberto"
          value={formatCurrency(totalDividasAberto)}
          tone="negative"
          icon={ScaleIcon}
          detail={`${dividas.filter((d) => statusDivida(d) !== "paga").length} pendentes de ${dividas.length} no total`}
        />
        <div className="rounded-lg border border-line bg-paper-raised p-5">
          <p className="text-sm text-ink-muted">Progresso geral da quitação</p>
          <p className="mt-2 font-mono text-2xl font-medium text-ink">
            {formatPercent(progressoGeralDividas)}
          </p>
          <div className="mt-3">
            <ProgressBar percent={progressoGeralDividas} status="parcial" />
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            {formatCurrency(totalJaPago)} já pago de {formatCurrency(totalDividasOriginal)}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-xl italic text-ink">Próximos vencimentos</h2>
          <Link href="/dividas" className="text-sm text-accent hover:underline">
            ver todas as dívidas
          </Link>
        </div>

        {dividasPrioritarias.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-line bg-paper-raised">
            {dividasPrioritarias.map((divida, i) => {
              const status = statusDivida(divida);
              const pct = percentualPago(divida);
              return (
                <div
                  key={divida.id}
                  className={`flex items-center gap-4 px-5 py-4 ${
                    i !== dividasPrioritarias.length - 1 ? "border-b border-line" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-ink">{divida.credor}</p>
                      <StatusBadge status={status} />
                    </div>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      vence em{" "}
                      {new Intl.DateTimeFormat("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      }).format(new Date(divida.vencimento))}
                    </p>
                    <div className="mt-2 max-w-xs">
                      <ProgressBar percent={pct} status={status} />
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-sm text-ink">{formatCurrency(saldoDevedor(divida))}</p>
                    <p className="text-xs text-ink-muted">restante</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-line py-16 text-center text-sm text-ink-muted">
            {dividas.length === 0
              ? "Nenhuma dívida cadastrada ainda — vá até a aba Dívidas para adicionar a primeira."
              : "Todas as dívidas estão quitadas 🎉"}
          </div>
        )}
      </section>
    </>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "positive" | "negative";
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-lg border border-line bg-paper-raised p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{label}</p>
        <Icon
          size={16}
          className={tone === "positive" ? "text-status-paid" : "text-status-unpaid"}
        />
      </div>
      <p className="mt-2 font-mono text-2xl font-medium text-ink">{value}</p>
      <p className="mt-2 text-xs text-ink-muted">{detail}</p>
    </div>
  );
}
