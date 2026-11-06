import type { GiftState } from './types';

/** Seed data so no screen is ever empty for review. */
export const SEED: GiftState = {
  people: [
    { id: 'p1', name: 'Maya', occasion: 'BIRTHDAY', month: 11, day: 12 },
    { id: 'p2', name: 'Theo', occasion: 'HOLIDAY', month: 11, day: 24 },
    { id: 'p3', name: 'Rosa', occasion: 'BIRTHDAY', month: 10, day: 29 },
    { id: 'p4', name: 'Ellis', occasion: 'THANK YOU', month: 0, day: 8 },
    { id: 'p5', name: 'Noor', occasion: 'JUST BECAUSE', month: 2, day: 3 },
    { id: 'p6', name: 'Bram', occasion: 'BIRTHDAY', month: 5, day: 17 },
  ],
  ideas: [
    { id: 'i1', personId: 'p1', title: 'Linen apron', band: 'MID', createdAt: 11, status: 'idea' },
    { id: 'i2', personId: 'p1', title: 'Ceramic mug set', band: 'LOW', createdAt: 10, status: 'idea' },
    { id: 'i3', personId: 'p1', title: 'Weekend in the hills', band: 'SPECIAL', createdAt: 9, status: 'idea' },
    { id: 'i4', personId: 'p2', title: 'Wool scarf', band: 'MID', createdAt: 8, status: 'idea' },
    { id: 'i5', personId: 'p2', title: 'Pour-over kettle', band: 'MID', createdAt: 7, status: 'idea' },
    { id: 'i6', personId: 'p3', title: 'Watercolour set', band: 'LOW', createdAt: 6, status: 'idea' },
    { id: 'i7', personId: 'p4', title: 'Herb planter', band: 'LOW', createdAt: 5, status: 'idea' },
    { id: 'i8', personId: null, title: 'Hand-bound notebook', band: 'LOW', createdAt: 4, status: 'idea' },
    { id: 'i9', personId: null, title: 'Vinyl of their first concert', band: 'SPECIAL', createdAt: 3, status: 'idea' },
    { id: 'i10', personId: 'p5', title: 'Beeswax candles', band: 'LOW', createdAt: 2, status: 'idea' },
    { id: 'i11', personId: 'p6', title: 'Bike repair kit', band: 'MID', createdAt: 1, status: 'idea' },

    { id: 'g1', personId: 'p1', title: 'Poetry anthology', band: 'LOW', createdAt: 0, status: 'given', occasion: 'BIRTHDAY', reaction: 'TOUCHED', photo: 2, givenYear: 2026 },
    { id: 'g2', personId: 'p1', title: 'Copper planter', band: 'MID', createdAt: 0, status: 'given', occasion: 'JUST BECAUSE', reaction: 'LOVED', photo: 0, givenYear: 2025 },
    { id: 'g3', personId: 'p2', title: 'Espresso cups', band: 'MID', createdAt: 0, status: 'given', occasion: 'HOLIDAY', reaction: 'ADORED', photo: 3, givenYear: 2026 },
    { id: 'g4', personId: 'p3', title: 'Dried flower frame', band: 'MID', createdAt: 0, status: 'given', occasion: 'BIRTHDAY', reaction: 'WOWED', photo: 1, givenYear: 2026 },
    { id: 'g5', personId: 'p4', title: 'Soy candle trio', band: 'LOW', createdAt: 0, status: 'given', occasion: 'THANK YOU', reaction: 'THRILLED', photo: 4, givenYear: 2026 },
    { id: 'g6', personId: 'p5', title: 'Travel journal', band: 'LOW', createdAt: 0, status: 'given', occasion: 'JUST BECAUSE', reaction: 'TOUCHED', photo: 2, givenYear: 2026 },
    { id: 'g7', personId: 'p6', title: 'Climbing chalk bag', band: 'MID', createdAt: 0, status: 'given', occasion: 'BIRTHDAY', reaction: 'LOVED', photo: 0, givenYear: 2026 },
  ],
  received: [
    { id: 'r1', title: 'Hand-thrown bowl', fromPersonId: 'p1', fromName: 'Maya', month: 9, day: 4, year: 2026, thanked: true },
    { id: 'r2', title: 'Bundle of letters', fromPersonId: 'p3', fromName: 'Rosa', month: 8, day: 21, year: 2026, thanked: false },
    { id: 'r3', title: 'Olive wood board', fromPersonId: 'p2', fromName: 'Theo', month: 11, day: 25, year: 2026, thanked: false },
    { id: 'r4', title: 'Pressed fern print', fromPersonId: 'p6', fromName: 'Bram', month: 5, day: 18, year: 2026, thanked: true },
  ],
};
