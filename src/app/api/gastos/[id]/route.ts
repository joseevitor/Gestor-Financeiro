import { NextRequest, NextResponse } from "next/server";
import { deleteGasto } from "@/lib/store";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteGasto(id);
  return NextResponse.json({ ok: true });
}
