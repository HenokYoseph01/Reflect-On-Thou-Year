import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

//First ever drizzle schema def yippie
export const submission = sqliteTable("submissions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: text("createdAt").notNull(),
});
