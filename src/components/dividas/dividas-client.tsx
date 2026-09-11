"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/status-badge";
import ProgressBar from "@/components/progress-bar";
import Modal from "@/components/ui/modal";
import NovaDividaForm from "./nova-divida-form";
import PagamentoForm from "./pagamento-form";
import {
  Divida,
  StatusDivida,
  percentualPago,
  saldoDevedor,
  statusDivida,
  totalPago,
} from "@/lib/types";
import { formatCurrency, formatDate, formatPercent, cn } from "@/lib/utils";
import { Plus, Trash2, CircleDollarSign } from "lucide-react";

const FILTERS: { value: StatusDivida | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "nao_paga", label: "Não pagas" },
  { value: "parcial", label: "Parciais" },
  { value: "paga", label: "Pagas" },
];

export default function DividasClient({ dividas }: { dividas: Divida[] }) {
  const router = useRouter();
  const [filtro, setFiltro] = useState<StatusDivida | "todas">("todas");
  const [modalNova, setModalNova] = useState(false);
  const [dividaPagamento, setDividaPagamento] = useState<Divida | null>(null);
  const [excluindo, setExcluindo] = useState<string | null>(null);

  const lista = useMemo(() => {
    return dividas
      .filter((d) => filtro === "todas" || statusDivida(d) === filtro)
      .sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime());
  }, [dividas, filtro]);

  async function handleExcluir(id: string) {
    setExcluindo(id);
    await fetch(`/api/dividas/${id}`, { method: "DELETE" });
    router.refresh();
    setExcluindo(null);
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                filtro === f.value
                  ? "bg-ink text-paper"
                  : "border border-line text-ink-muted hover:border-ink/30"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setModalNova(true)}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={15} />
          Nova dívida
        </button>
      </div>

      <div className="space-y-3">
        {lista.map((divida) => {
          const status = statusDivida(divida);
          const pct = percentualPago(divida);
          const pago = totalPago(divida);
          const restante = saldoDevedor(divida);

          return (
            <div
              key={divida.id}
              className="flex flex-col gap-4 rounded-lg border border-line bg-paper-raised p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-ink">{divida.credor}</p>
                  <StatusBadge status={status} />
                  {divida.categoria && (
                    <span className="rounded border border-line px-1.5 py-0.5 text-[11px] text-ink-muted">
                      {divida.categoria}
                    </span>
                  )}
                </div>
                {divida.descricao && (
                  <p className="mt-1 text-sm text-ink-muted">{divida.descricao}</p>
                )}

                <div className="mt-3 max-w-sm">
                  <div className="mb-1 flex items-center justify-between text-xs text-ink-muted">
                    <span>
                      {formatCurrency(pago)} pago de {formatCurrency(divida.valorTotal)}
                    </span>
                    <span className="font-mono">{formatPercent(pct)}</span>
                  </div>
                  <ProgressBar percent={pct} status={status} />
                </div>

                <p className="mt-2 text-xs text-ink-muted">
                  vencimento em {formatDate(divida.vencimento)}
                  {divida.taxaJurosMensal ? ` · juros de ${divida.taxaJurosMensal}% a.m.` : ""}
                </p>
              </div>

              <div className="flex shrink-0 flex-row items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                <div className="text-right">
                  <div className="font-mono text-lg text-ink">{formatCurrency(restante)}</div>
                  <div className="text-xs text-ink-muted">saldo restante</div>
                </div>
                <div className="flex items-center gap-1">
                  {status !== "paga" && (
                    <button
                      onClick={() => setDividaPagamento(divida)}
                      className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs font-medium text-ink hover:border-accent hover:text-accent"
                    >
                      <CircleDollarSign size={13} />
                      Registrar pagamento
                    </button>
                  )}
                  <button
                    onClick={() => handleExcluir(divida.id)}
                    disabled={excluindo === divida.id}
                    className="rounded-md p-1.5 text-ink-muted hover:bg-status-unpaid-soft hover:text-status-unpaid disabled:opacity-50"
                    aria-label="Excluir dívida"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {lista.length === 0 && (
          <div className="rounded-lg border border-dashed border-line py-16 text-center text-sm text-ink-muted">
            {dividas.length === 0
              ? "Nenhuma dívida cadastrada ainda — comece adicionando a primeira."
              : "Nenhuma dívida nesse filtro."}
          </div>
        )}
      </div>

      {modalNova && (
        <Modal title="Nova dívida" onClose={() => setModalNova(false)}>
          <NovaDividaForm onDone={() => setModalNova(false)} />
        </Modal>
      )}

      {dividaPagamento && (
        <Modal
          title={`Registrar pagamento — ${dividaPagamento.credor}`}
          onClose={() => setDividaPagamento(null)}
        >
          <PagamentoForm
            dividaId={dividaPagamento.id}
            saldoRestante={saldoDevedor(dividaPagamento)}
            onDone={() => setDividaPagamento(null)}
          />
        </Modal>
      )}
    </>
  );
}
