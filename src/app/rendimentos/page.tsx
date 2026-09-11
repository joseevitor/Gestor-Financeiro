import PageHeader from "@/components/page-header";
import RendimentosClient from "@/components/rendimentos/rendimentos-client";
import { getRendimentos } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function RendimentosPage() {
  const rendimentos = await getRendimentos();

  return (
    <>
      <PageHeader
        title="Rendimentos"
        subtitle="Tudo que entra: salário, freelas, rendimentos de investimento e outras fontes."
      />
      <RendimentosClient rendimentos={rendimentos} />
    </>
  );
}
