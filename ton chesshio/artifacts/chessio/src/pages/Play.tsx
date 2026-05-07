import { useState } from "react";
import { Link } from "wouter";
import { TonConnectButton } from "@tonconnect/ui-react";
import { FaArrowLeft } from "react-icons/fa";
import ChessGame from "@/components/ChessGame";
import PvPGame from "@/components/PvPGame";
import type { Difficulty } from "@/lib/chess-ai";

type Mode = "menu" | "vs-ai" | "pvp";

export default function Play() {
  const [mode, setMode] = useState<Mode>("menu");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-sky-200/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sky-700 hover:text-sky-900 transition-colors font-semibold">
            <FaArrowLeft /> Back to Chessio
          </Link>
          <span className="text-lg font-black text-sky-700">♟ CHESS ARENA</span>
          <TonConnectButton />
        </div>
      </nav>

      <div className="pt-20 pb-10 px-4">
        {mode === "menu" && (
          <div className="max-w-lg mx-auto mt-16 text-center">
            <div className="text-6xl mb-4">♛</div>
            <h1 className="text-4xl font-black text-sky-700 mb-2">Chess Arena</h1>
            <p className="text-sky-500 mb-10">Choose your battle mode</p>
            <div className="grid gap-4">
              {/* VS AI Card */}
              <div className="glass rounded-2xl p-6 text-left">
                <h2 className="text-xl font-bold text-sky-700 mb-3">vs AI</h2>
                <p className="text-sky-500 text-sm mb-4">Challenge the Chessio AI engine. Pick your difficulty level.</p>
                <div className="flex gap-2 mb-4">
                  {(["easy", "normal", "hard"] as Difficulty[]).map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                        difficulty === d
                          ? "bg-sky-600 text-white shadow-md"
                          : "bg-sky-100 text-sky-600 hover:bg-sky-200"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setMode("vs-ai")}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all hover:scale-105"
                >
                  Play vs AI ({difficulty})
                </button>
              </div>

              {/* PvP Card */}
              <div className="glass rounded-2xl p-6 text-left">
                <h2 className="text-xl font-bold text-sky-700 mb-3">PvP Online</h2>
                <p className="text-sky-500 text-sm mb-4">Create a room and share the code with a friend, or join an existing game.</p>
                <button
                  onClick={() => setMode("pvp")}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:scale-105"
                >
                  Play PvP Online
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === "vs-ai" && (
          <ChessGame
            difficulty={difficulty}
            onBack={() => setMode("menu")}
            onChangeDifficulty={setDifficulty}
          />
        )}

        {mode === "pvp" && (
          <PvPGame onBack={() => setMode("menu")} />
        )}
      </div>
    </div>
  );
}
