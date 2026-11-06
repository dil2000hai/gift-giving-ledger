export type Band = 'LOW' | 'MID' | 'SPECIAL';
export type Occasion = 'BIRTHDAY' | 'HOLIDAY' | 'THANK YOU' | 'JUST BECAUSE';
export type ReactionId = 'LOVED' | 'ADORED' | 'WOWED' | 'THRILLED' | 'TOUCHED';

export type Person = {
  id: string;
  name: string;
  occasion: Occasion;
  /** month index 0-11 */
  month: number;
  day: number;
};

export type Idea = {
  id: string;
  personId: string | null;
  title: string;
  band: Band;
  createdAt: number;
  status: 'idea' | 'given';
  occasion?: Occasion;
  reaction?: ReactionId;
  photo?: number;
  givenYear?: number;
};

export type ReceivedItem = {
  id: string;
  title: string;
  fromPersonId: string;
  fromName: string;
  month: number;
  day: number;
  year: number;
  thanked: boolean;
};

export type GiftState = {
  people: Person[];
  ideas: Idea[];
  received: ReceivedItem[];
};

export type Recap = {
  given: number;
  receivedCount: number;
  ideaCount: number;
  best: Idea | null;
  bestPersonName: string;
};
