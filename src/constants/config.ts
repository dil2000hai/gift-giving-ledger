import { Dimensions } from 'react-native';

export const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/** Splash length. EXACT 8000 — shorter races the UI-test screenshot window. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_FADE_MS = 280;

/** Board geometry — parent padding + border are accounted for (rule #4). */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 10;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 12
export const CAL_COLS = 3;
export const CAL_TILE = Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / CAL_COLS);
export const CAL_BOARD_W = CAL_TILE * CAL_COLS + 2 * BOARD_FRAME;

export const BENTO_W = BOARD_MAX_W;
export const BENTO_GAP = 12;

export const HEADER_TOP_PAD = 44;
export const HEADER_H = 72;

export const BOW_TIE_MS = 420;
export const SHEET_SPRING = { tension: 65, friction: 11 };
export const PRESS_SPRING = { tension: 300, friction: 12 };
export const ENTER_SPRING = { tension: 46, friction: 7 };
export const STAGGER_MS = 60;
export const REACTION_POP_MS = 150;
export const FADE_MS = 240;
export const TOAST_MS = 1400;
export const HAPTIC_MS = 12;

export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export const QUICK_SHEET_H = 340;
export const GIVEN_SHEET_H = 500;
export const MONTH_SHEET_H = 320;

export const BANDS = ['LOW', 'MID', 'SPECIAL'] as const;
export const OCCASIONS = ['BIRTHDAY', 'HOLIDAY', 'THANK YOU', 'JUST BECAUSE'] as const;
export const RECAP_YEAR = 2026;
