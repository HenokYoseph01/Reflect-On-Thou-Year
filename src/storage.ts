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
