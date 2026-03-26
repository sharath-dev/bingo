"use client";

import { useState, useEffect } from "react";
import { shuffle } from "@/lib/shuffle";

const GRID_SIZE = 5;

interface Props {
  cells: string[];
}

type CellState = "unmarked" | "marked";

export default function BingoCard({ cells }: Props) {
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [marks, setMarks] = useState<CellState[]>([]);
  const [bingo, setBingo] = useState(false);

  const initCard = (source: string[]) => {
    const s = shuffle(source);
    setShuffled(s);
    setMarks(Array(s.length).fill("unmarked"));
    setBingo(false);
  };

  useEffect(() => {
    initCard(cells);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkBingo = (newMarks: CellState[]) => {
    const isMarked = (i: number) => newMarks[i] === "marked";

    // rows
    for (let r = 0; r < GRID_SIZE; r++) {
      if (Array.from({ length: GRID_SIZE }, (_, c) => r * GRID_SIZE + c).every(isMarked))
        return true;
    }
    // cols
    for (let c = 0; c < GRID_SIZE; c++) {
      if (Array.from({ length: GRID_SIZE }, (_, r) => r * GRID_SIZE + c).every(isMarked))
        return true;
    }
    // main diagonal
    if (Array.from({ length: GRID_SIZE }, (_, i) => i * GRID_SIZE + i).every(isMarked))
      return true;
    // anti diagonal
    if (
      Array.from(
        { length: GRID_SIZE },
        (_, i) => i * GRID_SIZE + (GRID_SIZE - 1 - i)
      ).every(isMarked)
    )
      return true;

    return false;
  };

  const toggleMark = (index: number) => {
    setMarks((prev) => {
      const next = prev.slice();
      next[index] = next[index] === "marked" ? "unmarked" : "marked";
      if (checkBingo(next)) setBingo(true);
      else setBingo(false);
      return next;
    });
  };

  if (shuffled.length === 0) {
    return (
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bingo && (
        <div
          role="alert"
          className="rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-5 py-3 text-center"
        >
          <span className="text-2xl font-bold text-green-700 dark:text-green-400 tracking-widest">
            BINGO!
          </span>
        </div>
      )}

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        role="grid"
        aria-label="Bingo card"
      >
        {shuffled.map((text, i) => {
          const marked = marks[i] === "marked";
          const row = Math.floor(i / GRID_SIZE) + 1;
          const col = (i % GRID_SIZE) + 1;
          return (
            <button
              key={i}
              type="button"
              role="gridcell"
              aria-pressed={marked}
              aria-label={`${text}, row ${row} column ${col}${marked ? ", marked" : ""}`}
              onClick={() => toggleMark(i)}
              className={[
                "aspect-square w-full rounded-xl text-xs sm:text-sm font-medium px-2 py-2 transition-all duration-150 flex items-center justify-center text-center leading-tight select-none overflow-hidden",
                marked
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 scale-95 shadow-inner"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-500 hover:shadow-sm",
              ].join(" ")}
            >
              <span className="line-clamp-4 break-words w-full min-w-0">{text}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => initCard(cells)}
          className="h-9 px-5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Shuffle again
        </button>
        <button
          type="button"
          onClick={() => { setMarks(Array(shuffled.length).fill("unmarked")); setBingo(false); }}
          className="h-9 px-5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Clear marks
        </button>
      </div>
    </div>
  );
}
