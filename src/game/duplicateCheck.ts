import type { Idea } from './types';

const normalise = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * The anti-repeat guard: has this person already been given something with
 * (effectively) the same title? Returns the year, or 0 when the idea is clear.
 */
export function alreadyGivenYear(
  ideas: Idea[],
  personId: string | null,
  title: string,
): number {
  const key = normalise(title);
  if (key.length === 0) {
    return 0;
  }
  for (let i = 0; i < ideas.length; i += 1) {
    const it = ideas[i];
    if (it.status === 'given' && it.personId === personId && normalise(it.title) === key) {
      return it.givenYear ?? 0;
    }
  }
  return 0;
}
