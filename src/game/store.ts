import { SEED } from './seed';
import type { Band, GiftState, Occasion, Person, ReactionId } from './types';

/**
 * Pure reducers over the ledger. Everything lives on the device — there is no
 * network layer anywhere in this app.
 */

let counter = 1000;
export const nextId = (prefix: string) => {
  counter += 1;
  return prefix + counter;
};

export const initialState = (): GiftState => ({
  people: SEED.people.slice(),
  ideas: SEED.ideas.slice(),
  received: SEED.received.slice(),
});

export function addIdea(
  state: GiftState,
  personId: string | null,
  title: string,
  band: Band,
): GiftState {
  const clean = title.trim();
  if (clean.length === 0) {
    return state;
  }
  counter += 1;
  return {
    ...state,
    ideas: [
      {
        id: 'i' + counter,
        personId,
        title: clean,
        band,
        createdAt: counter,
        status: 'idea',
      },
      ...state.ideas,
    ],
  };
}

export function markGiven(
  state: GiftState,
  ideaId: string,
  occasion: Occasion,
  reaction: ReactionId,
  photo: number,
  year: number,
): GiftState {
  return {
    ...state,
    ideas: state.ideas.map(i =>
      i.id === ideaId
        ? { ...i, status: 'given' as const, occasion, reaction, photo, givenYear: year }
        : i,
    ),
  };
}

export function logReceived(
  state: GiftState,
  person: Person,
  title: string,
  year: number,
): GiftState {
  const clean = title.trim();
  if (clean.length === 0) {
    return state;
  }
  counter += 1;
  const now = new Date();
  return {
    ...state,
    received: [
      {
        id: 'r' + counter,
        title: clean,
        fromPersonId: person.id,
        fromName: person.name,
        month: now.getMonth(),
        day: now.getDate(),
        year,
        thanked: false,
      },
      ...state.received,
    ],
  };
}

export function toggleThanks(state: GiftState, id: string): GiftState {
  return {
    ...state,
    received: state.received.map(r => (r.id === id ? { ...r, thanked: !r.thanked } : r)),
  };
}

export function addPerson(
  state: GiftState,
  name: string,
  occasion: Occasion,
  month: number,
  day: number,
): GiftState {
  const clean = name.trim();
  if (clean.length === 0) {
    return state;
  }
  counter += 1;
  return {
    ...state,
    people: [...state.people, { id: 'p' + counter, name: clean, occasion, month, day }],
  };
}

/* ---- selectors (pull one slice, never the whole state into a leaf) ---- */

export const ideasFor = (state: GiftState, personId: string) =>
  state.ideas.filter(i => i.personId === personId && i.status === 'idea');

export const givenFor = (state: GiftState, personId: string) =>
  state.ideas.filter(i => i.personId === personId && i.status === 'given');

export const receivedFrom = (state: GiftState, personId: string) =>
  state.received.filter(r => r.fromPersonId === personId);

export const openIdeaCount = (state: GiftState) =>
  state.ideas.filter(i => i.status === 'idea').length;

export const unassignedIdeas = (state: GiftState) =>
  state.ideas.filter(i => i.status === 'idea' && i.personId === null);
