import { useState, useEffect, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { getBestMove, type Difficulty } from "@/lib/chess-ai";

interface Props {
  difficulty: Difficulty;
  onBack: () => void;
  onChangeDifficulty: (d: Difficulty) => void;
}

export default function ChessGame({ difficulty, onBack, onChangeDifficulty }: Props) {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(new Chess().fen());
  const [status, setStatus] = useState<string>("Your turn (White)");
  const [thinking, setThinking] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const updateStatus = useCallback((chess: Chess) => {
    if (chess.isCheckmate()) {
      setStatus(chess.turn() === "w" ? "Checkmate! AI wins!" : "Checkmate! You win!");
    } else if (chess.isDraw()) {
      setStatus("Draw!");
    } else if (chess.isStalemate()) {
      setStatus("Stalemate!");
    } else if (chess.isCheck()) {
      setStatus(chess.turn() === "w" ? "Check! Your turn" : "AI is in check");
    } else {
      setStatus(chess.turn() === "w" ? "Your turn (White)" : "AI thinking...");
    }
  }, []);

  const makeAIMove = useCallback(async (chess: Chess) => {
    if (chess.isGameOver() || chess.turn() === "w") return;
    setThinking(true);
    await new Promise(r => setTimeout(r, 400 + Math.random() * 600));
    const move = getBestMove(chess.fen(), difficulty);
    if (move) {
      const newGame = new Chess(chess.fen());
      const result = newGame.move(move);
      if (result) {
        setGame(newGame);
        setFen(newGame.fen());
        setHistory(h => [...h, result.san]);
        updateStatus(newGame);
      }
    }
    setThinking(false);
  }, [difficulty, updateStatus]);

  useEffect(() => {
    if (game.turn() === "b" && !game.isGameOver() && !thinking) {
      makeAIMove(game);
    }
  }, [game]);

  function onPieceDrop({ sourceSquare, targetSquare }: { piece: any; sourceSquare: string; targetSquare: string | null }) {
    if (thinking || game.turn() !== "w" || game.isGameOver() || !targetSquare) return false;
    const newGame = new Chess(game.fen());
    let move = null;
    try {
      move = newGame.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    } catch {
      return false;
    }
    if (!move) return false;
    setGame(newGame);
    setFen(newGame.fen());
    setHistory(h => [...h, move!.san]);
    updateStatus(newGame);
    return true;
  }

  function resetGame() {
    const fresh = new Chess();
    setGame(fresh);
    setFen(fresh.fen());
    setHistory([]);
    setStatus("Your turn (White)");
    setThinking(false);
  }

  const isOver = game.isGameOver();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
        {/* Board */}
        <div className="flex-shrink-0 w-full max-w-[500px] mx-auto lg:mx-0">
          <div className="glass rounded-2xl p-4 shadow-xl">
            <Chessboard
              options={{
                position: fen,
                onPieceDrop,
                darkSquareStyle: { backgroundColor: "#0284c7" },
                lightSquareStyle: { backgroundColor: "#e0f2fe" },
                allowDragging: !thinking && !isOver && game.turn() === "w",
                boardStyle: { borderRadius: "12px", overflow: "hidden" },
              }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex-1 min-w-[240px] space-y-4">
          {/* Status */}
          <div className="glass rounded-2xl p-4">
            <p className="text-xs uppercase tracking-widest text-sky-500 font-semibold mb-1">Status</p>
            <p className={`font-bold text-lg ${isOver ? "text-red-500" : "text-sky-700"}`}>{status}</p>
            {thinking && (
              <div className="mt-2 flex items-center gap-2 text-sky-500 text-sm">
                <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                AI thinking...
              </div>
            )}
          </div>

          {/* Difficulty */}
          <div className="glass rounded-2xl p-4">
            <p className="text-xs uppercase tracking-widest text-sky-500 font-semibold mb-2">Difficulty</p>
            <div className="flex gap-2">
              {(["easy", "normal", "hard"] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => { onChangeDifficulty(d); resetGame(); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    difficulty === d ? "bg-sky-600 text-white" : "bg-sky-100 text-sky-600 hover:bg-sky-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Move History */}
          <div className="glass rounded-2xl p-4">
            <p className="text-xs uppercase tracking-widest text-sky-500 font-semibold mb-2">Move History</p>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {history.length === 0 && <p className="text-sky-400 text-sm">No moves yet</p>}
              {history.map((move, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-sky-400 text-xs w-6">{Math.floor(i / 2) + 1}{i % 2 === 0 ? "." : ""}</span>
                  <span className={`font-mono font-semibold ${i % 2 === 0 ? "text-sky-700" : "text-blue-500"}`}>{move}</span>
                  <span className="text-sky-400 text-xs">{i % 2 === 0 ? "White" : "Black"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={resetGame} className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all">
              New Game
            </button>
            <button onClick={onBack} className="flex-1 py-2.5 bg-sky-100 hover:bg-sky-200 text-sky-700 font-bold rounded-xl transition-all">
              Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
