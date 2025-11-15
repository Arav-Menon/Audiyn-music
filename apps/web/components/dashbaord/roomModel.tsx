"use client";

import { useState } from "react";

export default function RoomModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className="w-[400px] rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl text-white">
      {/* Header */}
      <h1 className="text-center text-2xl font-light mb-6">Audiyn</h1>

      {/* Tabs */}
      <div className="flex mb-6 bg-white/10 rounded-full p-1">
        <button
          onClick={() => setMode("create")}
          className={`flex-1 py-2 rounded-full text-sm transition ${
            mode === "create"
              ? "bg-white/20"
              : "opacity-60 hover:opacity-100"
          }`}
        >
          Create Room
        </button>

        <button
          onClick={() => setMode("join")}
          className={`flex-1 py-2 rounded-full text-sm transition ${
            mode === "join"
              ? "bg-white/20"
              : "opacity-60 hover:opacity-100"
          }`}
        >
          Join Room
        </button>
      </div>

      {/* CREATE ROOM UI */}
      {mode === "create" && (
        <div className="space-y-5">

          {/* Room Name */}
          <div>
            <label className="text-sm opacity-70">Room Name</label>
            <input
              placeholder="Enter a unique name"
              className="w-full mt-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-white/20"
            />
          </div>

          {/* Room Code */}
          <div>
            <label className="text-sm opacity-70">Room Code</label>
            <input
              placeholder="Auto-generated or custom"
              className="w-full mt-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-white/20"
            />
          </div>

          {/* Private Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-70">Make Private</span>
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`w-10 h-5 flex items-center rounded-full transition ${
                isPrivate ? "bg-purple-500" : "bg-white/20"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transform transition ${
                  isPrivate ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Password only if private */}
          {isPrivate && (
            <div>
              <label className="text-sm opacity-70">Password</label>
              <input
                placeholder="Enter room password"
                className="w-full mt-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-white/20"
              />
            </div>
          )}
        </div>
      )}

      {/* JOIN ROOM UI */}
      {mode === "join" && (
        <div className="space-y-5">

          <div>
            <label className="text-sm opacity-70">Room Code</label>
            <input
              placeholder="Enter code"
              className="w-full mt-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-white/20"
            />
          </div>

          <div>
            <label className="text-sm opacity-70">Password (if required)</label>
            <input
              placeholder="Optional"
              className="w-full mt-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-white/20"
            />
          </div>
        </div>
      )}

      {/* Bottom Button */}
      <button className="w-full mt-8 bg-white/20 hover:bg-white/30 transition rounded-xl py-3 text-sm">
        Tune In
      </button>
    </div>
  );
}
