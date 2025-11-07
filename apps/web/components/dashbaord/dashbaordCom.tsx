"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, Search, Plus, DoorOpen, Menu, X } from "lucide-react";
import { Sidebar } from "./sidebar";

// Room Card Component
function RoomCard({
  room,
  index,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  getDisplayCount,
  variant = "default",
}: any) {
  const gradientClass =
    variant === "community"
      ? "from-cyan-600 to-purple-500"
      : "from-purple-600 to-cyan-500";

  const shadowColor = variant === "community" ? "cyan" : "purple";

  return (
    <div
      onClick={() => onSelect(room.id)}
      onMouseEnter={() => onHover(room.id)}
      onMouseLeave={() => onHover(null)}
      className={`group bg-white/4 backdrop-blur-xl border rounded-xl p-4 sm:p-5 lg:p-6 transition-all duration-300 cursor-pointer ${
        isSelected
          ? `border-white/2 bg-card/70 shadow-lg shadow-${shadowColor}-500/30`
          : isHovered
            ? `border-white/30 bg-card/60 shadow-lg shadow-${shadowColor}-500/20`
            : "border-white/20"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 ${variant === "community" ? "lg:w-16 lg:h-16" : ""} rounded-lg bg-white/10 p-3 sm:p-4 flex items-center justify-center text-2xl sm:text-3xl ${variant === "community" ? "lg:text-4xl" : ""} transform transition-all duration-300 group-hover:scale-110`}
        >
          {room.avatar}
        </div>
        <span className="text-xs font-semibold px-2 sm:px-3 py-1 bg-primary/20 text-primary rounded-full whitespace-nowrap">
          {room.genre}
        </span>
      </div>

      <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 truncate">{room.name}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 truncate">Host: {room.host}</p>

      <div className="flex items-center gap-2 text-xs sm:text-sm mb-3 sm:mb-4">
        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
        <span
          className={
            variant === "community"
              ? "font-semibold text-foreground"
              : "text-muted-foreground"
          }
        >
          {getDisplayCount(room.id, room.listeners).toLocaleString()}{" "}
          {variant === "community" ? "members" : "listening"}
        </span>
      </div>

      <Button
        className={`w-full bg-white/5 hover:bg-white/10 text-white text-sm sm:text-base group-hover:shadow-lg group-hover:shadow-${shadowColor}-500/30 transition-all duration-200`}
      >
        {variant === "community" ? "Join Community" : "Join Now"}
      </Button>
    </div>
  );
}

export default function DashboardComp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [animatedCounts, setAnimatedCounts] = useState<Record<number, number>>(
    {}
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const rooms = [
    {
      id: 1,
      name: "Midnight Vibes",
      host: "DJ Luna",
      listeners: 1243,
      genre: "Electronic",
      avatar: "🎵",
    },
    {
      id: 2,
      name: "Lo-Fi Study Session",
      host: "Alex Chen",
      listeners: 892,
      genre: "Lo-Fi",
      avatar: "🎧",
    },
    {
      id: 3,
      name: "Hip-Hop Classics",
      host: "Producer Mike",
      listeners: 2156,
      genre: "Hip-Hop",
      avatar: "🎤",
    },
    {
      id: 4,
      name: "Jazz Café",
      host: "Sarah Jazz",
      listeners: 654,
      genre: "Jazz",
      avatar: "🎹",
    },
    {
      id: 5,
      name: "Rock Revolution",
      host: "Metal Dave",
      listeners: 1876,
      genre: "Rock",
      avatar: "🎸",
    },
    {
      id: 6,
      name: "Pop Party Mix",
      host: "Sunny Days",
      listeners: 3421,
      genre: "Pop",
      avatar: "🎪",
    },
  ];

  const mostJoined = [
    {
      id: 7,
      name: "Global Beats",
      host: "World Music",
      listeners: 5432,
      genre: "World",
      avatar: "🌍",
    },
    {
      id: 8,
      name: "Reggae Sunset",
      host: "Island Vibes",
      listeners: 2987,
      genre: "Reggae",
      avatar: "🌴",
    },
    {
      id: 9,
      name: "Indie Underground",
      host: "Indie Hub",
      listeners: 1654,
      genre: "Indie",
      avatar: "🎭",
    },
    {
      id: 10,
      name: "EDM Energy",
      host: "Festival Mode",
      listeners: 4123,
      genre: "EDM",
      avatar: "⚡",
    },
  ];

  useEffect(() => {
    if (!hoveredRoom || hoveredRoom in animatedCounts) return;

    const room = [...rooms, ...mostJoined].find((r) => r.id === hoveredRoom);
    if (!room) return;

    let current = 0;
    const targetCount = room.listeners;
    const increment = Math.ceil(targetCount / 20);

    const interval = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setAnimatedCounts((prev) => ({ ...prev, [hoveredRoom]: targetCount }));
        clearInterval(interval);
      } else {
        setAnimatedCounts((prev) => ({ ...prev, [hoveredRoom]: current }));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [hoveredRoom, animatedCounts, rooms, mostJoined]);

  const getDisplayCount = (roomId: number, actualCount: number) => {
    return animatedCounts[roomId] ?? actualCount;
  };

  return (
    <div className="flex h-screen bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_70%)] text-white/80 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Navbar */}
        <nav className="bg-sidebar/30 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-secondary/20 rounded-lg transition-all duration-200"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search rooms..."
                className="w-full bg-secondary/20 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/33 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button className="bg-white/5 hover:shadow-lg text-white gap-2 transition-all duration-200 hover:bg-white/15 hidden sm:flex">
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Create Room</span>
            </Button>
            <Button className="bg-white/5 hover:shadow-lg text-white transition-all duration-200 hover:bg-white/15 sm:hidden p-2">
              <Plus className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-accent hover:bg-accent/10 gap-2 bg-transparent transition-all duration-200 hidden sm:flex"
            >
              <DoorOpen className="w-4 h-4" />
              <span className="hidden md:inline">Join Room</span>
            </Button>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/40 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-200">
              <span className="text-white font-semibold text-sm sm:text-base">A</span>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-10 lg:space-y-12">
            {/* Popular Rooms */}
            <section className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
                  Popular Rooms
                </h2>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Discover trending music sessions happening right now
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {rooms.map((room, idx) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    index={idx}
                    isSelected={selectedRoom === room.id}
                    isHovered={hoveredRoom === room.id}
                    onSelect={setSelectedRoom}
                    onHover={setHoveredRoom}
                    getDisplayCount={getDisplayCount}
                  />
                ))}
              </div>
            </section>

            {/* Most Joined Rooms */}
            <section className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">Most Joined Rooms</h2>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Experience the most active music communities
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                {mostJoined.map((room, idx) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    index={idx}
                    isSelected={selectedRoom === room.id}
                    isHovered={hoveredRoom === room.id}
                    onSelect={setSelectedRoom}
                    onHover={setHoveredRoom}
                    getDisplayCount={getDisplayCount}
                    variant="community"
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}