import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { boards } from "@/lib/schema";
import { eq } from "drizzle-orm";
import BingoCard from "./BingoCard";

export default async function PlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [board] = await db
    .select()
    .from(boards)
    .where(eq(boards.id, id))
    .limit(1);

  if (!board) notFound();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              ← Home
            </Link>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Your bingo card
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Click a cell when it happens. First to complete a row, column, or
              diagonal wins!
            </p>
          </div>
        </div>

        <BingoCard cells={board.cells as string[]} />

        <p className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-600">
          Board{" "}
          <span className="font-mono">{id}</span> &middot;{" "}
          <Link
            href="/create"
            className="underline underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
          >
            create your own
          </Link>
        </p>
      </div>
    </div>
  );
}
