import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const boards = pgTable("boards", {
  id: text("id").primaryKey(),
  cells: jsonb("cells").$type<string[]>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Board = typeof boards.$inferSelect;
