import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const useSocket = (onCapacityUpdate) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { withCredentials: true });

    if (onCapacityUpdate) {
      socketRef.current.on("capacity:update", onCapacityUpdate);
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const joinEvent = useCallback((eventId) => {
    socketRef.current?.emit("join:event", eventId);
  }, []);

  const leaveEvent = useCallback((eventId) => {
    socketRef.current?.emit("leave:event", eventId);
  }, []);

  return { joinEvent, leaveEvent };
};

export default useSocket;
