import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // Client joins a room per event to receive capacity updates for that event
    socket.on("join:event", (eventId) => {
      socket.join(`event:${eventId}`);
    });

    socket.on("leave:event", (eventId) => {
      socket.leave(`event:${eventId}`);
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

// Call this from RSVP controllers when attendance count changes
export const emitCapacityUpdate = (eventId, rsvpCount) => {
  if (!io) return;
  io.to(`event:${eventId}`).emit("capacity:update", { eventId, rsvpCount });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};
