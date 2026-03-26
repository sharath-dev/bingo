/**
 * Fisher-Yates shuffle using crypto.getRandomValues for uniform randomness.
 * Returns a new shuffled array (does not mutate the input).
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = arr.slice();
  const randomValues = new Uint32Array(result.length);
  crypto.getRandomValues(randomValues);

  for (let i = result.length - 1; i > 0; i--) {
    const j = randomValues[i] % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
