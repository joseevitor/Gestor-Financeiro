import { NextRequest, NextResponse } from "next/server";
import { deleteDivida } from "@/lib/store";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteDivida(id);
  return NextResponse.json({ ok: true });
}
