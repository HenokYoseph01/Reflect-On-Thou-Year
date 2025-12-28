type ShuffleState = {
  bag: string[];
  knownIds: Set<string>;
};

const shuffleStates = new Map<number, ShuffleState>();

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((v) => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ v }) => v);
}

/**
 * Returns the next submission ID for a user using a shuffle bag.
 * New IDs are injected into the bag at random positions.
 */
export function getNextIdFromShuffleBag(
  userId: number,
  allIds: string[]
): string | null {
  let state = shuffleStates.get(userId);

  // First time or exhausted
  if (!state || state.bag.length === 0) {
    const shuffled = shuffle(allIds);
    state = {
      bag: shuffled,
      knownIds: new Set(allIds),
    };
    shuffleStates.set(userId, state);
  }

  // Inject new submissions
  const newIds = allIds.filter((id) => !state!.knownIds.has(id));
  for (const id of newIds) {
    const insertAt = Math.floor(Math.random() * (state!.bag.length + 1));
    state!.bag.splice(insertAt, 0, id);
    state!.knownIds.add(id);
  }

  return state!.bag.shift() ?? null;
}
