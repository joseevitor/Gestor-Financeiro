import { NextRequest, NextResponse } from "next/server";
import { getRendimentos, createRendimento } from "@/lib/store";
import { rendimentoSchema } from "@/lib/validation";

export async function GET() {
  const rendimentos = await getRendimentos();
  return NextResponse.json(rendimentos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = rendimentoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const rendimento = await createRendimento(parsed.data);
  return NextResponse.json(rendimento, { status: 201 });
}
