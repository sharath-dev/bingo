"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

const GRID_SIZE = 5;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

const PLACEHOLDERS = [
  "Free space",
  "Someone says 'synergy'",
  "Meeting runs over",
  "Cat on a video call",
  "Reply-all email chain",
  "Someone is 'on mute'",
  "Coffee spill",
  "Unexpected plot twist",
  "Plot armor activated",
  "Someone checks their phone",
  "Power outage",
  "Awkward silence",
  "Background noise",
  "Tech support moment",
  "Inspirational quote",
  "Someone's late",
  "Rain on a sunny day",
  "Double rainbow",
  "WiFi drops",
  "Browser crash",
  "Elevator music",
  "Hold music kicks in",
  "Bad pun",
  "Dad joke",
  "Unexpected guest",
];

export default function CreatePage() {
  const [cells, setCells] = useState<string[]>(Array(TOTAL_CELLS).fill(""));
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [boardId, setBoardId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const shareUrl =
    typeof window !== "undefined" && boardId
      ? `${window.location.origin}/b/${boardId}`
      : boardId
        ? `/b/${boardId}`
        : "";

  const handleCellChange = useCallback((index: number, value: string) => {
    setCells((prev) => {
      const next = prev.slice();
      next[index] = value;
      return next;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;

      let next: number | null = null;
      if (e.key === "ArrowRight") next = col < GRID_SIZE - 1 ? index + 1 : null;
      else if (e.key === "ArrowLeft") next = col > 0 ? index - 1 : null;
      else if (e.key === "ArrowDown")
        next = row < GRID_SIZE - 1 ? index + GRID_SIZE : null;
      else if (e.key === "ArrowUp") next = row > 0 ? index - GRID_SIZE : null;
      else if (e.key === "Enter") next = index < TOTAL_CELLS - 1 ? index + 1 : null;

      if (next !== null) {
        e.preventDefault();
        inputRefs.current[next]?.focus();
      }
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmed = cells.map((c) => c.trim());
    const emptyIndex = trimmed.findIndex((c) => c.length === 0);
    if (emptyIndex !== -1) {
      const row = Math.floor(emptyIndex / GRID_SIZE) + 1;
      const col = (emptyIndex % GRID_SIZE) + 1;
      setErrorMsg(`Cell at row ${row}, column ${col} is empty.`);
      inputRefs.current[emptyIndex]?.focus();
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cells: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      setBoardId(data.id);
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the text
    }
  };

  const handleReset = () => {
    setCells(Array(TOTAL_CELLS).fill(""));
    setTitle("");
    setBoardId(null);
    setStatus("idle");
    setErrorMsg("");
  };

  if (status === "success" && boardId) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Board created!
            </h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm">
              Share this link — each person will get a unique shuffled card.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2">
            <span className="flex-1 truncate text-sm text-zinc-700 dark:text-zinc-300 font-mono">
              {shareUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/b/${boardId}`}
              className="flex-1 flex items-center justify-center h-10 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-sm hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
            >
              Open my card
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Create another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            ← Back
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create a bingo board
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Fill in all 25 cells, then share the link. Each player gets a
            uniquely shuffled card.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6">
            <label
              htmlFor="board-title"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Board title{" "}
              <span className="text-zinc-400 font-normal">(optional)</span>
            </label>
            <input
              id="board-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Office party bingo"
              maxLength={100}
              className="w-full h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
            />
          </div>

          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
            role="grid"
            aria-label="Bingo board cells"
          >
            {cells.map((cell, i) => {
              const row = Math.floor(i / GRID_SIZE) + 1;
              const col = (i % GRID_SIZE) + 1;
              return (
                <div key={i} role="gridcell">
                  <label htmlFor={`cell-${i}`} className="sr-only">
                    Row {row}, Column {col}
                  </label>
                  <input
                    id={`cell-${i}`}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    value={cell}
                    onChange={(e) => handleCellChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    placeholder={PLACEHOLDERS[i] ?? ""}
                    maxLength={100}
                    aria-label={`Row ${row}, Column ${col}`}
                    className="w-full aspect-square text-center text-xs sm:text-sm px-1 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 transition-colors resize-none leading-tight"
                    style={{ minHeight: "4rem" }}
                  />
                </div>
              );
            })}
          </div>

          {errorMsg && (
            <p
              className="mt-4 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {errorMsg}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-xs text-zinc-400">
              {cells.filter((c) => c.trim().length > 0).length} / {TOTAL_CELLS}{" "}
              cells filled
            </p>
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-10 px-6 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-sm hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === "loading" ? "Saving…" : "Generate share link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
