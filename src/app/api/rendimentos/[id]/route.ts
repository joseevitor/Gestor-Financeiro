import { NextRequest, NextResponse } from "next/server";
import { deleteRendimento } from "@/lib/store";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteRendimento(id);
  return NextResponse.json({ ok: true });
}
