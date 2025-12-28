import { randomUUID } from "crypto";
import { eq, and, sql } from "drizzle-orm";
import { db } from "../db";
import { submission } from "../schema";
import { getNextIdFromShuffleBag } from "../shuffleBag";

// Create Submission
export async function createSubmission(userId: number, content: string) {
  await db.insert(submission).values({
    id: randomUUID(),
    userId,
    content,
    createdAt: new Date().toISOString(),
  });
}

async function getAllSubmissionIds(): Promise<string[]> {
  const rows = await db.select({ id: submission.id }).from(submission);

  return rows.map((r) => r.id);
}

// Read Submissions
export async function getRandomSubmission(userId: number) {
  const allIds = await getAllSubmissionIds();
  if (allIds.length === 0) return null;

  const nextId = getNextIdFromShuffleBag(userId, allIds);
  if (!nextId) return null;

  const result = await db
    .select()
    .from(submission)
    .where(eq(submission.id, nextId))
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
