import type { GiftState, Idea, Recap } from './types';

const REACTION_RANK: Record<string, number> = {
  TOUCHED: 5,
  ADORED: 4,
  THRILLED: 3,
  WOWED: 2,
  LOVED: 1,
};

export function recapForYear(state: GiftState, year: number): Recap {
  const givenThisYear = state.ideas.filter(
    i => i.status === 'given' && (i.givenYear ?? 0) === year,
  );
  const receivedThisYear = state.received.filter(r => r.year === year);
  const openIdeas = state.ideas.filter(i => i.status === 'idea');

  let best: Idea | null = null;
  let bestRank = -1;
  for (let i = 0; i < givenThisYear.length; i += 1) {
    const cur = givenThisYear[i];
    const curRank = REACTION_RANK[cur.reaction ?? ''] ?? 0;
    if (curRank > bestRank) {
      bestRank = curRank;
      best = cur;
    }
  }

  const person = best === null ? undefined : state.people.find(p => p.id === best!.personId);

  return {
    given: givenThisYear.length,
    receivedCount: receivedThisYear.length,
    ideaCount: openIdeas.length,
    best,
    bestPersonName: person ? person.name : 'someone dear',
  };
}
