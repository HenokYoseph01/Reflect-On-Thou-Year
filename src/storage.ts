export type Submission = {
  id: string;
  userId: number;
  content: string;
  createdAt: Date;
};

export const submissions: Submission[] = [];

//For now track who is currently submitting
export const awaitingSubmission = new Set<number>();

// Track deletion
export const awaitingDeletion = new Map<number, string[]>(); //Avoiding mismatch b/n user and submissions
