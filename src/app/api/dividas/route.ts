import { NextRequest, NextResponse } from "next/server";
import { getDividas, createDivida } from "@/lib/store";
import { dividaSchema } from "@/lib/validation";

export async function GET() {
  const dividas = await getDividas();
  return NextResponse.json(dividas);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = dividaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const divida = await createDivida(parsed.data);
  return NextResponse.json(divida, { status: 201 });
}
