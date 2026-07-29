"use client";

import { Trash2, X } from "lucide-react";

export default function DeleteRoomModal({
  roomName,
  onConfirm,
  onClose,
  loading,
}: {
  roomName: string;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-[400px] rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl text-white animate-[popIn_0.2s_forwards]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-all"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold">Delete Room</h2>
        </div>

        <p className="text-sm text-white/60 mb-6">
          Are you sure you want to delete <span className="text-white font-medium">&ldquo;{roomName}&rdquo;</span>? This will remove all songs, votes, and members from the room. This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm text-white/80 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/30 hover:bg-red-500/40 text-sm text-red-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Delete Room"
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
