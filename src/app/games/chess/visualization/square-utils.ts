export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

export type SquareColor = 'light' | 'dark';

export function randomSquare(exclude?: string): string {
  let next = exclude ?? '';
  while (next === (exclude ?? '')) {
    const file = FILES[Math.floor(Math.random() * 8)];
    const rank = Math.floor(Math.random() * 8) + 1;
    next = `${file}${rank}`;
  }
  return next;
}

export function fileIndex(square: string): number {
  return FILES.indexOf(square[0] as (typeof FILES)[number]);
}

export function rankOf(square: string): number {
  return parseInt(square.slice(1), 10);
}

export function colorOf(square: string): SquareColor {
  return (fileIndex(square) + rankOf(square)) % 2 === 0 ? 'light' : 'dark';
}

export function kingDistance(from: string, to: string): number {
  return Math.max(Math.abs(fileIndex(from) - fileIndex(to)), Math.abs(rankOf(from) - rankOf(to)));
}

export function isOnDiagonal(from: string, to: string): boolean {
  if (from === to) {
    return false;
  }
  return Math.abs(fileIndex(from) - fileIndex(to)) === Math.abs(rankOf(from) - rankOf(to));
}

export function diagonalSquaresOf(square: string): string[] {
  const f = fileIndex(square);
  const r = rankOf(square);
  const result: string[] = [];
  for (let df = -7; df <= 7; df++) {
    if (df === 0) {
      continue;
    }
    for (const dr of [df, -df]) {
      const nf = f + df;
      const nr = r + dr;
      if (nf >= 0 && nf < 8 && nr >= 1 && nr <= 8) {
        result.push(`${FILES[nf]}${nr}`);
      }
    }
  }
  return Array.from(new Set(result));
}

export function pickN<T>(items: T[], n: number): T[] {
  const pool = [...items];
  const out: T[] = [];
  while (out.length < n && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function allSquares(): string[] {
  const out: string[] = [];
  for (const f of FILES) {
    for (let r = 1; r <= 8; r++) {
      out.push(`${f}${r}`);
    }
  }
  return out;
}

export function squareAt(file: number, rank: number): string | null {
  if (file < 0 || file > 7 || rank < 1 || rank > 8) {
    return null;
  }
  return `${FILES[file]}${rank}`;
}

const KNIGHT_DELTAS: ReadonlyArray<readonly [number, number]> = [
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2]
];

export function knightMovesFrom(square: string): string[] {
  const f = fileIndex(square);
  const r = rankOf(square);
  const out: string[] = [];
  for (const [df, dr] of KNIGHT_DELTAS) {
    const sq = squareAt(f + df, r + dr);
    if (sq) {
      out.push(sq);
    }
  }
  return out;
}

export function isKnightMove(from: string, to: string): boolean {
  const df = Math.abs(fileIndex(from) - fileIndex(to));
  const dr = Math.abs(rankOf(from) - rankOf(to));
  return (df === 1 && dr === 2) || (df === 2 && dr === 1);
}

export function knightDistance(from: string, to: string): number {
  if (from === to) {
    return 0;
  }
  const visited = new Set<string>([from]);
  let frontier: string[] = [from];
  let depth = 0;
  while (frontier.length) {
    depth += 1;
    const next: string[] = [];
    for (const sq of frontier) {
      for (const hop of knightMovesFrom(sq)) {
        if (hop === to) {
          return depth;
        }
        if (!visited.has(hop)) {
          visited.add(hop);
          next.push(hop);
        }
      }
    }
    frontier = next;
  }
  return -1;
}

export type PieceType = 'bishop' | 'rook' | 'queen' | 'knight' | 'king' | 'pawn';

export function rookSquaresFrom(square: string): string[] {
  const f = fileIndex(square);
  const r = rankOf(square);
  const out: string[] = [];
  for (let i = 0; i < 8; i++) {
    if (i !== f) {
      out.push(`${FILES[i]}${r}`);
    }
    if (i + 1 !== r) {
      out.push(`${FILES[f]}${i + 1}`);
    }
  }
  return out;
}

export function bishopSquaresFrom(square: string): string[] {
  return diagonalSquaresOf(square);
}

export function queenSquaresFrom(square: string): string[] {
  return Array.from(new Set([...rookSquaresFrom(square), ...bishopSquaresFrom(square)]));
}

export function pieceAttacksFrom(piece: PieceType, square: string): string[] {
  switch (piece) {
    case 'bishop':
      return bishopSquaresFrom(square);
    case 'rook':
      return rookSquaresFrom(square);
    case 'queen':
      return queenSquaresFrom(square);
    case 'knight':
      return knightMovesFrom(square);
    case 'king':
      return allSquares().filter(sq => sq !== square && kingDistance(square, sq) === 1);
    case 'pawn':
      return [];
  }
}

export function pieceLabel(piece: PieceType): string {
  return piece.charAt(0).toUpperCase() + piece.slice(1);
}
