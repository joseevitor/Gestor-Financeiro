import PageHeader from "@/components/page-header";
import DividasClient from "@/components/dividas/dividas-client";
import { getDividas } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function DividasPage() {
  const dividas = await getDividas();

  return (
    <>
      <PageHeader
        title="Dívidas"
        subtitle="Cada dívida mostra o quanto já foi pago em relação ao valor total — o status é calculado automaticamente."
      />
      <DividasClient dividas={dividas} />
    </>
  );
}
