export type Submission = {
  id: string;
  userId: number;
  content: string;
  createdAt: Date;
};

export const submissions: Submission[] = [];

//For now track who is currently submitting
export const awaitingSubmission = new Set<number>();

//Functionality for reading messages
export function getRandomSubmission() {
  if (submissions.length === 0) return null;

  const index = Math.floor(Math.random() * submissions.length);
  return submissions[index];
}

//Functionality for Own Entry
export function getUserSubmission(userId: number) {
  return submissions.filter((s) => s.userId === userId);
}

//Functionality for Deleting Entry
export function deleteSubmissionById(id: string) {
  const index = submissions.findIndex((s) => s.id === id);

  if (index !== -1) {
    submissions.splice(index, 1);
    return true;
  }

  return false;
}

// Track deletion
export const awaitingDeletion = new Map<number, string[]>(); //Avoiding mismatch b/n user and submissions
