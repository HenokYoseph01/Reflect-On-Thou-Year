import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
// Dev
// const sqlite = new Database("db.sqlite");
// Prod
const sqlite = new Database("/data/db.sqlite");

export const db = drizzle(sqlite);
