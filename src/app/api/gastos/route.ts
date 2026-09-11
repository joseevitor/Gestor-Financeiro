import { NextRequest, NextResponse } from "next/server";
import { getGastos, createGasto } from "@/lib/store";
import { gastoSchema } from "@/lib/validation";

export async function GET() {
  const gastos = await getGastos();
  return NextResponse.json(gastos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = gastoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const gasto = await createGasto(parsed.data);
  return NextResponse.json(gasto, { status: 201 });
}
