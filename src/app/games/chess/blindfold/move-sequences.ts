// Curated short opening lines for move-sequence memory drills.
// `position` maps square -> piece label. Squares not in the map are empty.
// Pieces use figurine letters: K Q R B N for white, k q r b n for black, P/p for pawns.

export interface MoveSequence {
  moves: string;
  position: Record<string, string>;
}

export const MOVE_SEQUENCES: MoveSequence[] = [
  {
    moves: '1. e4 e5 2. Nf3 Nc6',
    position: { e4: 'P', e5: 'p', f3: 'N', c6: 'n' }
  },
  {
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5',
    position: { e4: 'P', e5: 'p', f3: 'N', c6: 'n', b5: 'B' }
  },
  {
    moves: '1. d4 d5 2. c4 e6',
    position: { d4: 'P', d5: 'p', c4: 'P', e6: 'p' }
  },
  {
    moves: '1. d4 Nf6 2. c4 g6',
    position: { d4: 'P', f6: 'n', c4: 'P', g6: 'p' }
  },
  {
    moves: '1. e4 c5 2. Nf3 d6',
    position: { e4: 'P', c5: 'p', f3: 'N', d6: 'p' }
  },
  {
    moves: '1. e4 c5 2. Nf3 Nc6 3. d4',
    position: { e4: 'P', c5: 'p', f3: 'N', c6: 'n', d4: 'P' }
  },
  {
    moves: '1. e4 e6 2. d4 d5',
    position: { e4: 'P', e6: 'p', d4: 'P', d5: 'p' }
  },
  {
    moves: '1. d4 f5 2. g3 Nf6',
    position: { d4: 'P', f5: 'p', g3: 'P', f6: 'n' }
  },
  {
    moves: '1. Nf3 d5 2. g3 Nf6',
    position: { f3: 'N', d5: 'p', g3: 'P', f6: 'n' }
  },
  {
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5',
    position: { e4: 'P', e5: 'p', f3: 'N', c6: 'n', c4: 'B', c5: 'b' }
  },
  {
    moves: '1. d4 d5 2. Nf3 Nf6 3. Bf4',
    position: { d4: 'P', d5: 'p', f3: 'N', f6: 'n', f4: 'B' }
  },
  {
    moves: '1. e4 d5 2. exd5 Qxd5',
    position: { d5: 'q' }
  }
];

export function pieceDisplayName(symbol: string): string {
  const lower = symbol.toLowerCase();
  const color = symbol === lower ? 'Black' : 'White';
  const map: Record<string, string> = {
    p: 'pawn',
    n: 'knight',
    b: 'bishop',
    r: 'rook',
    q: 'queen',
    k: 'king'
  };
  return `${color} ${map[lower] ?? '?'}`;
}
