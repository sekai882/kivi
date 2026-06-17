"use client";

import { useEffect, useState } from "react";

export function BackendStatus() {
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch("http://localhost:8000/health", { cache: "no-store" });
        if (res.ok) {
          setStatus("connected");
        } else {
          setStatus("disconnected");
        }
      } catch (error) {
        setStatus("disconnected");
      }
    };

    checkBackend();
    // Re-check every 10 seconds
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-3 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-full shadow-sm backdrop-blur-md">
      <div className="relative flex h-3 w-3">
        {status === "connected" && (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </>
        )}
        {status === "disconnected" && (
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        )}
        {status === "connecting" && (
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 animate-pulse"></span>
        )}
      </div>
      <span className="text-sm font-medium text-slate-200">
        Nodo Backend: {status === "connected" ? "Conectado" : status === "disconnected" ? "Desconectado" : "Conectando..."}
      </span>
    </div>
  );
}
