"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/modal";
import NovoRendimentoForm from "./novo-rendimento-form";
import { Rendimento } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, RefreshCw, Trash2 } from "lucide-react";

const CATEGORIA_LABEL: Record<string, string> = {
  salario: "Salário",
  freelance: "Freelance",
  investimento: "Investimento",
  outros: "Outros",
};

export default function RendimentosClient({ rendimentos }: { rendimentos: Rendimento[] }) {
  const router = useRouter();
  const [modalNovo, setModalNovo] = useState(false);
  const [excluindo, setExcluindo] = useState<string | null>(null);

  const total = rendimentos.reduce((a, r) => a + r.valor, 0);

  async function handleExcluir(id: string) {
    setExcluindo(id);
    await fetch(`/api/rendimentos/${id}`, { method: "DELETE" });
    router.refresh();
    setExcluindo(null);
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="rounded-lg border border-line bg-paper-raised px-5 py-4">
          <p className="text-xs text-ink-muted">Total no período</p>
          <p className="font-mono text-xl font-medium text-status-paid">
            {formatCurrency(total)}
          </p>
        </div>
        <button
          onClick={() => setModalNovo(true)}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={15} />
          Novo rendimento
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-paper-raised">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-muted">
              <th className="px-5 py-3 font-medium">Fonte</th>
              <th className="px-5 py-3 font-medium">Categoria</th>
              <th className="px-5 py-3 font-medium">Data</th>
              <th className="px-5 py-3 text-right font-medium">Valor</th>
              <th className="w-10 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {rendimentos.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-ink">{r.fonte}</span>
                    {r.recorrente && (
                      <span title="Recorrente">
                        <RefreshCw size={12} className="text-ink-muted" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-ink-muted">
                  {CATEGORIA_LABEL[r.categoria]}
                </td>
                <td className="px-5 py-3.5 text-ink-muted">{formatDate(r.data)}</td>
                <td className="px-5 py-3.5 text-right font-mono text-status-paid">
                  +{formatCurrency(r.valor)}
                </td>
                <td className="px-3 py-3.5 text-right">
                  <button
                    onClick={() => handleExcluir(r.id)}
                    disabled={excluindo === r.id}
                    className="rounded-md p-1.5 text-ink-muted hover:bg-status-unpaid-soft hover:text-status-unpaid disabled:opacity-50"
                    aria-label="Excluir rendimento"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rendimentos.length === 0 && (
          <div className="py-16 text-center text-sm text-ink-muted">
            Nenhum rendimento cadastrado ainda — comece adicionando o primeiro.
          </div>
        )}
      </div>

      {modalNovo && (
        <Modal title="Novo rendimento" onClose={() => setModalNovo(false)}>
          <NovoRendimentoForm onDone={() => setModalNovo(false)} />
        </Modal>
      )}
    </>
  );
}
