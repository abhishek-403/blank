"use client";
import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:8080";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    console.log("----useSocket used-----");

    const ws = new WebSocket(`${WS_URL}`);

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      if (ws.readyState === 1) {
        console.log("-----useSocket closed-----");

        ws.close();
      }
    };
  }, []);

  return socket;
};
