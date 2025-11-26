"use client";

import { SOCKET_URL } from "@/utils/api_url";
import { createRoom } from "@/utils/join_room_api/api";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function JoinRoomModal() {
  const [code, setCode] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();
  const wsRef = useRef<WebSocket | null>(null);

  const onHandlerWsClick = () => {
    const ws = new WebSocket(SOCKET_URL, [
      "token",
      localStorage.getItem("token") as string,
    ]);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          payload: { code: code, password: password ?? null },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "JOIN_SUCCESS") {
        router.push(`/r/${data.roomId}`);
        localStorage.setItem("roomId", data.roomId);
      }
    };
  };

  return (
    <div className="w-full max-w-[500px] mx-auto px-4 sm:px-0">
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-6 shadow-xl text-white">
        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-semi-bold text-white/70 mb-4 sm:mb-6">
          Audiyn / join room
        </h1>

        <div className="space-y-4 sm:space-y-5">
          <div>
            <label className="text-xs sm:text-sm opacity-70">Room Code</label>
            <input
              placeholder="Enter code"
              className="w-full mt-1 bg-white/10 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-white/20 transition-colors"
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm opacity-70">
              Password (if required)
            </label>
            <input
              type="password"
              placeholder="Optional"
              className="w-full mt-1 bg-white/10 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm outline-none focus:border-white/20 transition-colors"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Bottom Button */}
        <button
          className="w-full mt-6 sm:mt-8 bg-white/20 hover:bg-white/30 active:bg-white/25 transition rounded-xl py-2.5 sm:py-3 text-sm font-medium"
          onClick={onHandlerWsClick}
        >
          Tune In
        </button>
      </div>
    </div>
  );
}
