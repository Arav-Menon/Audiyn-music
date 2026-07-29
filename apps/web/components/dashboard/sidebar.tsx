"use client";

import {
  X,
  Music,
  Settings,
  LogOut,
  ChevronRight,
  History,
  Plus,
  DoorOpen,
} from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  getRecentRooms,
  removeRecentRoom,
  type RecentRoom,
} from "@/utils/dashboard_api/recentRooms";
import { getRoom } from "@/utils/join_room_api/api";

function RecentRoomsSection() {
  const [rooms, setRooms] = useState<RecentRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecentRooms();
      setRooms(data);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleClick = async (room: RecentRoom) => {
    try {
      const result = await getRoom(room.roomId);
      const exists = result?.room || result?.userRoom;
      if (exists) {
        router.push(`/r/${room.roomId}`);
      } else {
        throw new Error("Room not found");
      }
    } catch (err: any) {
      const userRoom = err?.response?.data?.userRoom;
      if (userRoom) {
        router.push(`/r/${room.roomId}`);
        return;
      }
      Toast.show("This room no longer exists");
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
      removeRecentRoom(room.roomId).catch(() => {});
    }
  };

  const handleRemove = async (e: React.MouseEvent, room: RecentRoom) => {
    e.stopPropagation();
    setRemovingId(room.id);
    try {
      await removeRecentRoom(room.roomId);
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
    } catch {
      Toast.show("Failed to remove room");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-2 px-2 mb-2">
        <History className="w-3.5 h-3.5 text-white/40" />
        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
          Recent Rooms
        </span>
      </div>

      {loading && (
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-xs text-white/30">Loading...</span>
        </div>
      )}

      {!loading && rooms.length === 0 && (
        <div className="px-2 py-2">
          <p className="text-xs text-white/30">No recent rooms</p>
          <p className="text-[11px] text-white/20 mt-0.5">
            Join a room to quickly access it later.
          </p>
        </div>
      )}

      {!loading && rooms.length > 0 && (
        <div className="space-y-0.5 max-h-[280px] overflow-y-auto scrollbar-thin">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleClick(room)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200 group text-left"
            >
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs font-bold text-white/40 flex-shrink-0">
                {room.roomName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate">{room.roomName}</p>
                {room.hostName && (
                  <p className="text-[10px] text-white/30 truncate">
                    {room.hostName}
                  </p>
                )}
              </div>
              <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-white/40 transition-all flex-shrink-0" />
              {removingId === room.id ? (
                <div className="w-4 h-4 border border-white/20 border-t-white rounded-full animate-spin flex-shrink-0" />
              ) : (
                <span
                  onClick={(e) => handleRemove(e, room)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 transition-all flex-shrink-0 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRemove(e as any, room); }}
                  title="Remove from recent"
                >
                  <X className="w-3 h-3 text-white/40 hover:text-white/60" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Simple toast singleton
class Toast {
  static el: HTMLDivElement | null = null;
  static timer: ReturnType<typeof setTimeout> | null = null;

  static show(message: string) {
    if (!Toast.el) {
      Toast.el = document.createElement("div");
      Toast.el.className =
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] px-4 py-2 rounded-xl bg-red-500/30 backdrop-blur-xl border border-red-500/20 text-sm text-red-200 shadow-xl transition-all duration-300";
      document.body.appendChild(Toast.el);
    }
    Toast.el.textContent = message;
    Toast.el.style.opacity = "1";
    Toast.el.style.transform = "translateX(-50%) translateY(0)";

    if (Toast.timer) clearTimeout(Toast.timer);
    Toast.timer = setTimeout(() => {
      if (Toast.el) {
        Toast.el.style.opacity = "0";
        Toast.el.style.transform = "translateX(-50%) translateY(8px)";
      }
    }, 3000);
  }
}

export default function Sidebar({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();

  const navItems = [
    { icon: Music, label: "Dashboard", path: "/dashboard" },
    { icon: Plus, label: "Create Room", path: "/create-the-vibe" },
    { icon: DoorOpen, label: "Join the Vibe", path: "/join-the-vibe" },
  ];

  const footerItems = [
    { icon: LogOut, label: "Logout" },
  ];

  const onHandleClick = () => {
    Cookies.remove("token");
    router.push("/");
  };

  return (
    <aside
      className={`
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        fixed lg:relative inset-y-0 left-0 z-50
        w-64 lg:w-64
        bg-sidebar border-r border-white/10 
        transition-transform duration-300 ease-in-out
        flex flex-col
      `}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <img src="./audiyn.png" alt="" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              Audiyn
            </span>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navItems.map((item, i) => (
          <button
            key={i}
            onClick={() => router.push(item.path)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-white/10" />

      {/* Recent Rooms */}
      <div className="flex-1 overflow-hidden flex flex-col pt-2">
        <RecentRoomsSection />
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 space-y-1">
        {footerItems.map((item, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
            onClick={onHandleClick}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
