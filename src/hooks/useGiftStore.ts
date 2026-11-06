import { useCallback, useMemo, useState } from 'react';
import { Vibration } from 'react-native';
import { HAPTIC_MS, RECAP_YEAR } from '../constants/config';
import {
  addIdea,
  addPerson,
  initialState,
  logReceived,
  markGiven,
  toggleThanks,
} from '../game/store';
import { recapForYear } from '../game/recap';
import type { Band, GiftState, Occasion, Person, ReactionId } from '../game/types';

/** Single source of truth. Screens receive only the slices they need. */
export function useGiftStore() {
  const [state, setState] = useState<GiftState>(initialState);

  const createIdea = useCallback(
    (personId: string | null, title: string, band: Band) => {
      setState(prev => addIdea(prev, personId, title, band));
    },
    [],
  );

  const tieTheBow = useCallback(
    (ideaId: string, occasion: Occasion, reaction: ReactionId, photo: number) => {
      Vibration.vibrate(HAPTIC_MS);
      setState(prev => markGiven(prev, ideaId, occasion, reaction, photo, RECAP_YEAR));
    },
    [],
  );

  const createReceived = useCallback((person: Person, title: string) => {
    setState(prev => logReceived(prev, person, title, RECAP_YEAR));
  }, []);

  const flipThanks = useCallback((id: string) => {
    Vibration.vibrate(HAPTIC_MS);
    setState(prev => toggleThanks(prev, id));
  }, []);

  const createPerson = useCallback(
    (name: string, occasion: Occasion, month: number, day: number) => {
      setState(prev => addPerson(prev, name, occasion, month, day));
    },
    [],
  );

  const recap = useMemo(() => recapForYear(state, RECAP_YEAR), [state]);

  return {
    state,
    recap,
    createIdea,
    tieTheBow,
    createReceived,
    flipThanks,
    createPerson,
  };
}

export type GiftStore = ReturnType<typeof useGiftStore>;

export default useGiftStore;
