import { Server as SocketIOServer } from "socket.io";
import { Chess } from "chess.js";
import type { Server as HttpServer } from "http";
import { logger } from "../lib/logger";

interface GameRoom {
  chess: Chess;
  players: { white?: string; black?: string };
  status: "waiting" | "playing" | "finished";
}

const rooms = new Map<string, GameRoom>();

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function setupChessPvP(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    path: "/ws",
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    logger.info({ socketId: socket.id }, "PvP client connected");

    socket.on("create_room", () => {
      const roomId = generateRoomId();
      rooms.set(roomId, {
        chess: new Chess(),
        players: { white: socket.id },
        status: "waiting",
      });
      socket.join(roomId);
      socket.emit("room_created", { roomId, color: "white" });
      logger.info({ roomId, socketId: socket.id }, "Room created");
    });

    socket.on("join_room", ({ roomId }: { roomId: string }) => {
      const room = rooms.get(roomId.toUpperCase());
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }
      if (room.status !== "waiting") {
        socket.emit("error", { message: "Room is full or game over" });
        return;
      }
      room.players.black = socket.id;
      room.status = "playing";
      socket.join(roomId.toUpperCase());
      socket.emit("room_joined", { roomId: roomId.toUpperCase(), color: "black" });
      io.to(roomId.toUpperCase()).emit("game_start", {
        fen: room.chess.fen(),
        turn: "white",
      });
      logger.info({ roomId, socketId: socket.id }, "Player joined room");
    });

    socket.on("make_move", ({ roomId, move }: { roomId: string; move: string }) => {
      const room = rooms.get(roomId);
      if (!room || room.status !== "playing") return;

      const isWhite = room.players.white === socket.id;
      const isBlack = room.players.black === socket.id;
      const currentTurn = room.chess.turn() === "w";

      if ((currentTurn && !isWhite) || (!currentTurn && !isBlack)) {
        socket.emit("error", { message: "Not your turn" });
        return;
      }

      try {
        const result = room.chess.move(move);
        if (!result) {
          socket.emit("error", { message: "Invalid move" });
          return;
        }

        const isOver = room.chess.isGameOver();
        if (isOver) room.status = "finished";

        io.to(roomId).emit("move_made", {
          fen: room.chess.fen(),
          move: result.san,
          turn: room.chess.turn() === "w" ? "white" : "black",
          isOver,
          isCheckmate: room.chess.isCheckmate(),
          isDraw: room.chess.isDraw(),
        });
      } catch {
        socket.emit("error", { message: "Invalid move" });
      }
    });

    socket.on("disconnect", () => {
      for (const [roomId, room] of rooms.entries()) {
        if (room.players.white === socket.id || room.players.black === socket.id) {
          io.to(roomId).emit("opponent_disconnected");
          rooms.delete(roomId);
          logger.info({ roomId }, "Room closed due to disconnect");
        }
      }
    });
  });
}
