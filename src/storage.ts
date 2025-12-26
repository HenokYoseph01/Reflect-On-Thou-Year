export type Submission = {
  id: string;
  userId: number;
  content: string;
  createdAt: Date;
};

export const submissions: Submission[] = [];

//For now track who is currently submitting
export const awaitingSubmission = new Set<number>();
