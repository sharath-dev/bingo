CREATE TABLE "boards" (
	"id" text PRIMARY KEY NOT NULL,
	"cells" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
