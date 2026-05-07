import { useState, useEffect, useRef, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { io, type Socket } from "socket.io-client";

interface Props {
  onBack: () => void;
}

type GamePhase = "lobby" | "waiting" | "playing" | "over";

const WS_URL = window.location.origin;

export default function PvPGame({ onBack }: Props) {
  const [phase, setPhase] = useState<GamePhase>("lobby");
  const [roomId, setRoomId] = useState("");
  const [joinId, setJoinId] = useState("");
  const [color, setColor] = useState<"white" | "black">("white");
  const [fen, setFen] = useState(new Chess().fen());
  const [status, setStatus] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [currentTurn, setCurrentTurn] = useState<"white" | "black">("white");
  const socketRef = useRef<Socket | null>(null);
  const colorRef = useRef<"white" | "black">("white");

  useEffect(() => { colorRef.current = color; }, [color]);

  const initSocket = useCallback(() => {
    if (socketRef.current?.connected) return socketRef.current;
    const socket = io(WS_URL, {
      path: "/ws",
      transports: ["websocket", "polling"],
    });
    socket.on("connect", () => setError(""));
    socket.on("connect_error", () =>
      setError("Cannot connect to server. The API server may not be running.")
    );
    socket.on("room_created", ({ roomId: id, color: c }: { roomId: string; color: "white" | "black" }) => {
      setRoomId(id);
      setColor(c);
      colorRef.current = c;
      setPhase("waiting");
      setStatus(`Room created! Share code: ${id}`);
    });
    socket.on("room_joined", ({ roomId: id, color: c }: { roomId: string; color: "white" | "black" }) => {
      setRoomId(id);
      setColor(c);
      colorRef.current = c;
    });
    socket.on("game_start", ({ fen: f, turn }: { fen: string; turn: "white" | "black" }) => {
      setFen(f);
      setCurrentTurn(turn);
      setPhase("playing");
      setStatus(turn === colorRef.current ? "Your turn!" : "Opponent's turn");
    });
    socket.on("move_made", ({ fen: f, move, turn, isOver, isCheckmate, isDraw }: any) => {
      setFen(f);
      setCurrentTurn(turn);
      setHistory(h => [...h, move]);
      if (isOver) {
        setPhase("over");
        if (isCheckmate) setStatus(turn === colorRef.current ? "You lost! Checkmate." : "You won! Checkmate!");
        else if (isDraw) setStatus("Draw!");
        else setStatus("Game over!");
      } else {
        setStatus(turn === colorRef.current ? "Your turn!" : "Opponent's turn...");
      }
    });
    socket.on("opponent_disconnected", () => {
      setStatus("Opponent disconnected. Game over.");
      setPhase("over");
    });
    socket.on("error", ({ message }: { message: string }) => setError(message));
    socketRef.current = socket;
    return socket;
  }, []);

  useEffect(() => {
    const socket = initSocket();
    return () => { socket.disconnect(); };
  }, []);

  function createRoom() {
    const socket = initSocket();
    socket.emit("create_room");
  }

  function joinRoom() {
    if (!joinId.trim()) { setError("Enter a room code"); return; }
    const socket = initSocket();
    socket.emit("join_room", { roomId: joinId.trim() });
  }

  function onPieceDrop({ sourceSquare, targetSquare }: { piece: any; sourceSquare: string; targetSquare: string | null }) {
    if (phase !== "playing" || !targetSquare) return false;
    const chess = new Chess(fen);
    if ((chess.turn() === "w" && colorRef.current !== "white") ||
        (chess.turn() === "b" && colorRef.current !== "black")) return false;
    if (currentTurn !== colorRef.current) return false;
    let move = null;
    try {
      move = chess.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    } catch { return false; }
    if (!move) return false;
    socketRef.current?.emit("make_move", { roomId, move: move.san });
    return true;
  }

  function reset() {
    setPhase("lobby");
    setRoomId("");
    setJoinId("");
    setFen(new Chess().fen());
    setHistory([]);
    setStatus("");
    setError("");
  }

  return (
    <div className="max-w-5xl mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">{error}</div>
      )}

      {phase === "lobby" && (
        <div className="max-w-md mx-auto glass rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🌐</div>
          <h2 className="text-2xl font-black text-sky-700 mb-6">PvP Online</h2>
          <div className="space-y-4">
            <button onClick={createRoom} className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all hover:scale-105">
              Create New Room
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-sky-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white/70 px-3 text-sky-400 text-sm">or join existing</span></div>
            </div>
            <div className="flex gap-2">
              <input
                value={joinId}
                onChange={e => setJoinId(e.target.value.toUpperCase())}
                placeholder="Room code (e.g. ABC123)"
                className="flex-1 px-4 py-3 rounded-xl border border-sky-200 bg-white/70 text-sky-700 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                maxLength={6}
              />
              <button onClick={joinRoom} className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
                Join
              </button>
            </div>
            <button onClick={onBack} className="w-full py-2 text-sky-500 hover:text-sky-700 text-sm font-medium transition-colors">
              Back to Menu
            </button>
          </div>
        </div>
      )}

      {phase === "waiting" && (
        <div className="max-w-md mx-auto glass rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4 animate-bounce">⏳</div>
          <h2 className="text-2xl font-black text-sky-700 mb-2">Waiting for Opponent</h2>
          <p className="text-sky-500 mb-6">Share this code with your friend:</p>
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl py-5 px-8 mb-6">
            <p className="text-4xl font-black font-mono text-sky-700 tracking-widest">{roomId}</p>
          </div>
          <button onClick={() => navigator.clipboard.writeText(roomId)} className="px-6 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 font-semibold rounded-xl transition-all text-sm">
            Copy Code
          </button>
          <div className="mt-4">
            <button onClick={reset} className="text-sky-400 hover:text-sky-600 text-sm underline">Cancel</button>
          </div>
        </div>
      )}

      {(phase === "playing" || phase === "over") && (
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          <div className="flex-shrink-0 w-full max-w-[500px] mx-auto lg:mx-0">
            <div className="glass rounded-2xl p-4 shadow-xl">
              <Chessboard
                options={{
                  position: fen,
                  onPieceDrop,
                  boardOrientation: color,
                  darkSquareStyle: { backgroundColor: "#0284c7" },
                  lightSquareStyle: { backgroundColor: "#e0f2fe" },
                  allowDragging: phase === "playing" && currentTurn === color,
                  boardStyle: { borderRadius: "12px", overflow: "hidden" },
                }}
              />
            </div>
          </div>
          <div className="flex-1 min-w-[240px] space-y-4">
            <div className="glass rounded-2xl p-4">
              <p className="text-xs uppercase tracking-widest text-sky-500 font-semibold mb-1">Game Status</p>
              <p className={`font-bold text-lg ${phase === "over" ? "text-red-500" : "text-sky-700"}`}>{status}</p>
              <div className="mt-2 flex gap-3 text-sm flex-wrap">
                <span className="px-2 py-1 rounded-lg bg-sky-100 text-sky-600 font-semibold">You: {color}</span>
                <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-500 font-semibold">Room: {roomId}</span>
              </div>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs uppercase tracking-widest text-sky-500 font-semibold mb-2">Move History</p>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {history.length === 0 && <p className="text-sky-400 text-sm">No moves yet</p>}
                {history.map((move, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-sky-400 text-xs w-6">{Math.floor(i / 2) + 1}{i % 2 === 0 ? "." : ""}</span>
                    <span className={`font-mono font-semibold ${i % 2 === 0 ? "text-sky-700" : "text-blue-500"}`}>{move}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={reset} className="w-full py-2.5 bg-sky-100 hover:bg-sky-200 text-sky-700 font-bold rounded-xl transition-all">
              {phase === "over" ? "Play Again" : "Leave Game"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
