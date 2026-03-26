import { db } from "@/lib/db";
import { boards } from "@/lib/schema";
import { nanoid } from "nanoid";
import { z } from "zod";

const CreateBoardSchema = z.object({
  cells: z
    .array(z.string().min(1, "Cell cannot be empty").max(100))
    .length(25, "Board must have exactly 25 cells"),
  title: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = CreateBoardSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: result.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  const { cells } = result.data;
  const trimmed = cells.map((c) => c.trim());
  const empty = trimmed.findIndex((c) => c.length === 0);
  if (empty !== -1) {
    return Response.json(
      { error: `Cell ${empty + 1} is empty` },
      { status: 422 }
    );
  }

  const id = nanoid(10);
  try {
    await db.insert(boards).values({ id, cells: trimmed });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: `Failed to save board: ${msg}` }, { status: 500 });
  }

  return Response.json({ id }, { status: 201 });
}
