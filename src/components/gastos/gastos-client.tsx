"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/modal";
import NovoGastoForm from "./novo-gasto-form";
import { Gasto, CategoriaGasto } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Pin, Trash2 } from "lucide-react";

const CATEGORIA_LABEL: Record<CategoriaGasto, string> = {
  moradia: "Moradia",
  alimentacao: "Alimentação",
  transporte: "Transporte",
  saude: "Saúde",
  lazer: "Lazer",
  educacao: "Educação",
  outros: "Outros",
};

export default function GastosClient({ gastos }: { gastos: Gasto[] }) {
  const router = useRouter();
  const [modalNovo, setModalNovo] = useState(false);
  const [excluindo, setExcluindo] = useState<string | null>(null);

  const total = gastos.reduce((a, g) => a + g.valor, 0);
  const porCategoria = Object.entries(
    gastos.reduce<Record<string, number>>((acc, g) => {
      acc[g.categoria] = (acc[g.categoria] ?? 0) + g.valor;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  async function handleExcluir(id: string) {
    setExcluindo(id);
    await fetch(`/api/gastos/${id}`, { method: "DELETE" });
    router.refresh();
    setExcluindo(null);
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setModalNovo(true)}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={15} />
          Novo gasto
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-lg border border-line bg-paper-raised">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-muted">
                <th className="px-5 py-3 font-medium">Descrição</th>
                <th className="px-5 py-3 font-medium">Categoria</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 text-right font-medium">Valor</th>
                <th className="w-10 px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {gastos.map((g) => (
                <tr key={g.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 text-ink">
                      {g.fixo && (
                        <span title="Gasto fixo">
                          <Pin size={12} className="text-ink-muted" />
                        </span>
                      )}
                      {g.descricao}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-ink-muted">
                    {CATEGORIA_LABEL[g.categoria]}
                  </td>
                  <td className="px-5 py-3.5 text-ink-muted">{formatDate(g.data)}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-status-unpaid">
                    -{formatCurrency(g.valor)}
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <button
                      onClick={() => handleExcluir(g.id)}
                      disabled={excluindo === g.id}
                      className="rounded-md p-1.5 text-ink-muted hover:bg-status-unpaid-soft hover:text-status-unpaid disabled:opacity-50"
                      aria-label="Excluir gasto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {gastos.length === 0 && (
            <div className="py-16 text-center text-sm text-ink-muted">
              Nenhum gasto cadastrado ainda — comece adicionando o primeiro.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-line bg-paper-raised p-5">
            <p className="text-sm text-ink-muted">Total no período</p>
            <p className="mt-1 font-mono text-2xl font-medium text-status-unpaid">
              {formatCurrency(total)}
            </p>
          </div>

          {porCategoria.length > 0 && (
            <div className="rounded-lg border border-line bg-paper-raised p-5">
              <p className="mb-3 text-sm text-ink-muted">Por categoria</p>
              <div className="space-y-3">
                {porCategoria.map(([categoria, valor]) => {
                  const pct = (valor / total) * 100;
                  return (
                    <div key={categoria}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-ink">
                          {CATEGORIA_LABEL[categoria as CategoriaGasto]}
                        </span>
                        <span className="font-mono text-ink-muted">
                          {formatCurrency(valor)}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {modalNovo && (
        <Modal title="Novo gasto" onClose={() => setModalNovo(false)}>
          <NovoGastoForm onDone={() => setModalNovo(false)} />
        </Modal>
      )}
    </>
  );
}
