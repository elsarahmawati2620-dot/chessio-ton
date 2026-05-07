import { Chess } from "chess.js";

export type Difficulty = "easy" | "normal" | "hard";

const pieceValues: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const pawnTable = [
  0, 0, 0, 0, 0, 0, 0, 0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5, 5, 10, 25, 25, 10, 5, 5,
  0, 0, 0, 20, 20, 0, 0, 0,
  5, -5, -10, 0, 0, -10, -5, 5,
  5, 10, 10, -20, -20, 10, 10, 5,
  0, 0, 0, 0, 0, 0, 0, 0,
];

const knightTable = [
  -50, -40, -30, -30, -30, -30, -40, -50,
  -40, -20, 0, 0, 0, 0, -20, -40,
  -30, 0, 10, 15, 15, 10, 0, -30,
  -30, 5, 15, 20, 20, 15, 5, -30,
  -30, 0, 15, 20, 20, 15, 0, -30,
  -30, 5, 10, 15, 15, 10, 5, -30,
  -40, -20, 0, 5, 5, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
];

function evaluateBoard(chess: Chess): number {
  let score = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const val = pieceValues[piece.type] ?? 0;
      const idx = piece.color === "w" ? (7 - r) * 8 + c : r * 8 + c;
      let bonus = 0;
      if (piece.type === "p") bonus = pawnTable[idx] ?? 0;
      if (piece.type === "n") bonus = knightTable[idx] ?? 0;
      const total = val + bonus;
      score += piece.color === "b" ? total : -total;
    }
  }

  return score;
}

function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean
): number {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }

  const moves = chess.moves();
  if (maximizing) {
    let max = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const val = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      max = Math.max(max, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return max;
  } else {
    let min = Infinity;
    for (const move of moves) {
      chess.move(move);
      const val = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      min = Math.min(min, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return min;
  }
}

export function getBestMove(fen: string, difficulty: Difficulty): string | null {
  const chess = new Chess(fen);
  const moves = chess.moves();
  if (moves.length === 0) return null;

  if (difficulty === "easy") {
    const randomIdx = Math.floor(Math.random() * moves.length);
    return moves[randomIdx] ?? null;
  }

  const depth = difficulty === "normal" ? 2 : 4;
  let bestMove: string | null = null;
  let bestVal = -Infinity;

  for (const move of moves) {
    chess.move(move);
    const val = minimax(chess, depth - 1, -Infinity, Infinity, false);
    chess.undo();
    if (val > bestVal) {
      bestVal = val;
      bestMove = move;
    }
  }

  return bestMove;
}
