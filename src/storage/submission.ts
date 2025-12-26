import { randomUUID } from "crypto";
import { eq, and, sql } from "drizzle-orm";
import { db } from "../db";
import { submission } from "../schema";

// Create Submission
export async function createSubmission(userId: number, content: string) {
  await db.insert(submission).values({
    id: randomUUID(),
    userId,
    content,
    createdAt: new Date().toISOString(),
  });
}

// Read Submissions
export async function getRandomSubmission() {
  const result = await db
    .select()
    .from(submission)
    .orderBy(sql`RANDOM()`)
    .limit(1);

  return result[0] ?? null;
}

// Get own Submissions (For delete flow)
export async function getUserSubmissions(userId: number) {
  return db
    .select()
    .from(submission)
    .where(eq(submission.userId, userId))
    .orderBy(submission.createdAt);
}

// Delete Submission
export async function deleteSubmissionById(id: string, userId: number) {
  await db
    .delete(submission)
    .where(and(eq(submission.id, id), eq(submission.userId, userId)));
}
