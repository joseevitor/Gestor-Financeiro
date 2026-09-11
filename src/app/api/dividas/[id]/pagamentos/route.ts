import { NextRequest, NextResponse } from "next/server";
import { addPagamento } from "@/lib/store";
import { pagamentoSchema } from "@/lib/validation";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = pagamentoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const divida = await addPagamento(id, parsed.data);
  if (!divida) {
    return NextResponse.json({ error: "Dívida não encontrada" }, { status: 404 });
  }
  return NextResponse.json(divida);
}
