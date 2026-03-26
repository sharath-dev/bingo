import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 dark:bg-zinc-100">
            <svg
              className="w-8 h-8 text-white dark:text-zinc-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M3 14h18M10 3v18M14 3v18"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Bingo
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Create custom bingo boards and share them with friends. Every player
            gets their own uniquely shuffled card.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/create"
            className="h-11 px-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors flex items-center justify-center"
          >
            Create a board
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4">
          {[
            {
              heading: "Fill 25 cells",
              body: "Enter anything — events, phrases, inside jokes.",
            },
            {
              heading: "Share a link",
              body: "One link, unlimited players. No sign-up required.",
            },
            {
              heading: "Unique cards",
              body: "Every player sees a freshly shuffled layout.",
            },
          ].map(({ heading, body }) => (
            <div key={heading} className="text-left space-y-1">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {heading}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
