import { InferModel } from "drizzle-orm";
import {
  bigint,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

// Stores each shortened link with ownership and lifecycle metadata.
export const links = pgTable(
  "links",
  {
    id: bigint("id", { mode: "number" })
      .generatedAlwaysAsIdentity()
      .primaryKey(),
    clerkUserId: varchar("clerk_user_id", { length: 256 }).notNull(),
    shortCode: varchar("short_code", { length: 32 }).notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    shortCodeUniqueIdx: uniqueIndex("links_short_code_idx").on(table.shortCode),
  }),
);

export type Link = InferModel<typeof links>;
export type NewLink = InferModel<typeof links, "insert">;
