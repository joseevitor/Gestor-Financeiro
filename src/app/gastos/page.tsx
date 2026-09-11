import PageHeader from "@/components/page-header";
import GastosClient from "@/components/gastos/gastos-client";
import { getGastos } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function GastosPage() {
  const gastos = await getGastos();

  return (
    <>
      <PageHeader
        title="Gastos"
        subtitle="Onde o dinheiro está saindo, mês a mês — separado por categoria."
      />
      <GastosClient gastos={gastos} />
    </>
  );
}
