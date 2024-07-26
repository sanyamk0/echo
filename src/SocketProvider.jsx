import { createContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";

export const SocketContext = createContext({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const options = {
      forceNew: true,
      reconnectionAttempts: Infinity,
      timeout: 10000,
      transports: ["websocket"],
    };

    const socketInstance = new ClientIO(
      import.meta.env.VITE_SERVER_URL,
      options
    );

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
