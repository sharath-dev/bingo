import { db } from "@/lib/db";
import { boards } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [board] = await db
    .select()
    .from(boards)
    .where(eq(boards.id, id))
    .limit(1);

  if (!board) {
    return Response.json({ error: "Board not found" }, { status: 404 });
  }

  return Response.json({ cells: board.cells });
}
