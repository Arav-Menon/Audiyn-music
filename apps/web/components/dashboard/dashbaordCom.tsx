"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Search, Plus, DoorOpen, Menu, Music, Users, Clock, Trash2, ExternalLink } from "lucide-react";
import Sidebar from "./sidebar";
import { useRouter } from "next/navigation";
import { getDashboardRooms, deleteRoom, type DashboardRoom } from "@/utils/dashboard_api/api";
import DeleteRoomModal from "./deleteRoomModal";

function RoomCard({
  room,
  onJoin,
  onDelete,
}: {
  room: DashboardRoom;
  onJoin: () => void;
  onDelete: () => void;
}) {
  const initials = room.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const createdDate = new Date(room.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group bg-white/4 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-5 transition-all duration-300 hover:border-white/30 hover:bg-card/60">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-white/10 p-3 flex items-center justify-center text-lg font-bold text-white/60 transform transition-all duration-300 group-hover:scale-110">
          {initials}
        </div>
        {room.isPrivate && (
          <span className="text-xs font-semibold px-2 py-1 bg-primary/20 text-primary rounded-full">
            Private
          </span>
        )}
      </div>

      <h3 className="text-base sm:text-lg font-bold mb-1 truncate">
        {room.name}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 truncate">
        Host: {room.host}
      </p>

      <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Music className="w-3 h-3" />
          {room.streamCount} song{room.streamCount !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {room.memberCount} member{room.memberCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
        <Clock className="w-3 h-3" />
        <span>Created {createdDate}</span>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onJoin}
          className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm"
        >
          <ExternalLink className="w-3 h-3" />
          Join Room
        </Button>
        <button
          onClick={onDelete}
          className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
          title="Delete room"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function DashboardComp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rooms, setRooms] = useState<DashboardRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingRoom, setDeletingRoom] = useState<DashboardRoom | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardRooms();
      setRooms(data);
    } catch {
      setError("Failed to load rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleDeleteConfirm = async () => {
    if (!deletingRoom) return;
    setDeleteLoading(true);
    try {
      await deleteRoom(deletingRoom.id);
      setRooms((prev) => prev.filter((r) => r.id !== deletingRoom.id));
      setDeletingRoom(null);
    } catch {
      setError("Failed to delete the room. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredRooms = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_70%)] text-white/80 overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <nav className="bg-sidebar/30 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-secondary/20 rounded-lg transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/20 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/33 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={() => router.push("/join-the-vibe")}
              className="px-8 py-5 bg-white/10 text-white rounded-xl hover:bg-white/15"
            >
              <DoorOpen className="w-4 h-4" />
              Join the Vibe
            </Button>
            <Button
              onClick={() => router.push("/create-the-vibe")}
              className="px-8 py-5 bg-white/10 text-white rounded-xl hover:bg-white/15"
            >
              <Plus className="w-4 h-4" />
              Create Room
            </Button>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/40 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-200">
              <span className="text-white font-semibold text-sm sm:text-base">
                A
              </span>
            </div>
          </div>
        </nav>

        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-10 lg:space-y-12">
            <section className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
                  Your Rooms
                </h2>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Manage the rooms you have created
                </p>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-24">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading your rooms...</p>
                  </div>
                </div>
              )}

              {!loading && error && (
                <div className="flex items-center justify-center py-24">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-sm text-red-400">{error}</p>
                    <Button
                      onClick={fetchRooms}
                      className="bg-white/10 hover:bg-white/20 text-white"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              )}

              {!loading && !error && filteredRooms.length === 0 && (
                <div className="flex items-center justify-center py-24">
                  <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                    <Music className="w-12 h-12 text-white/20" />
                    {searchQuery ? (
                      <>
                        <p className="text-sm text-muted-foreground">
                          No rooms match your search.
                        </p>
                        <Button
                          onClick={() => setSearchQuery("")}
                          className="bg-white/10 hover:bg-white/20 text-white"
                        >
                          Clear Search
                        </Button>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-white/60">
                          No rooms yet
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Create your first room and start sharing music with
                          friends.
                        </p>
                        <Button
                          onClick={() => router.push("/create-the-vibe")}
                          className="bg-white/10 hover:bg-white/20 text-white"
                        >
                          <Plus className="w-4 h-4" />
                          Create Your First Room
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {!loading && !error && filteredRooms.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {filteredRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onJoin={() => router.push(`/r/${room.id}`)}
                      onDelete={() => setDeletingRoom(room)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {deletingRoom && (
        <DeleteRoomModal
          roomName={deletingRoom.name}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingRoom(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
