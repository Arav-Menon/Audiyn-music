"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Music, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Search, 
  Plus, 
  DoorOpen, 
  Menu, 
  X 
} from "lucide-react";

// Sidebar Component
function Sidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const navItems = [
    { icon: Music, label: "Dashboard", active: true },
    { icon: Users, label: "My Rooms", active: false },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  const footerItems = [
    { icon: HelpCircle, label: "Help" },
    { icon: LogOut, label: "Logout" },
  ];

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-20"} bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
    >
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          {isOpen && (
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Audiyn
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, i) => (
          <button
            key={i}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              item.active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-purple-600/30"
                : "text-sidebar-foreground hover:bg-sidebar-accent/20"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        {footerItems.map((item, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/20 transition-all duration-200"
          >
            <item.icon className="w-5 h-5" />
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}

// Room Card Component
function RoomCard({ 
  room, 
  index, 
  isSelected, 
  isHovered, 
  onSelect, 
  onHover, 
  getDisplayCount,
  variant = "default"
}: any) {
  const gradientClass = variant === "community" 
    ? "from-cyan-600 to-purple-500" 
    : "from-purple-600 to-cyan-500";
  
  const buttonGradient = variant === "community"
    ? "from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
    : "from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600";

  const shadowColor = variant === "community" ? "cyan" : "purple";

  return (
    <div
      onClick={() => onSelect(room.id)}
      onMouseEnter={() => onHover(room.id)}
      onMouseLeave={() => onHover(null)}
      className={`group bg-card/40 backdrop-blur-xl border rounded-xl p-6 transition-all duration-300 cursor-pointer ${
        isSelected
          ? `border-accent/70 bg-card/70 shadow-lg shadow-${shadowColor}-500/30`
          : isHovered
            ? `border-accent/50 bg-card/60 shadow-lg shadow-${shadowColor}-500/20`
            : "border-border"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-${variant === "community" ? "16" : "14"} h-${variant === "community" ? "16" : "14"} rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center text-${variant === "community" ? "3xl" : "2xl"} transform transition-all duration-300 group-hover:scale-110`}>
          {room.avatar}
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-primary/20 text-primary rounded-full">
          {room.genre}
        </span>
      </div>

      <h3 className="text-lg font-bold mb-2">{room.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Host: {room.host}
      </p>

      <div className="flex items-center gap-2 text-sm mb-4">
        <Users className="w-4 h-4 text-accent" />
        <span className={variant === "community" ? "font-semibold text-foreground" : "text-muted-foreground"}>
          {getDisplayCount(room.id, room.listeners).toLocaleString()}{" "}
          {variant === "community" ? "members" : "listening"}
        </span>
      </div>

      <Button className={`w-full bg-gradient-to-r ${buttonGradient} text-white group-hover:shadow-lg group-hover:shadow-${shadowColor}-500/30 transition-all duration-200`}>
        {variant === "community" ? "Join Community" : "Join Now"}
      </Button>
    </div>
  );
}

export default function DashboardComp() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [animatedCounts, setAnimatedCounts] = useState<Record<number, number>>({});

  const rooms = [
    { id: 1, name: "Midnight Vibes", host: "DJ Luna", listeners: 1243, genre: "Electronic", avatar: "🎵" },
    { id: 2, name: "Lo-Fi Study Session", host: "Alex Chen", listeners: 892, genre: "Lo-Fi", avatar: "🎧" },
    { id: 3, name: "Hip-Hop Classics", host: "Producer Mike", listeners: 2156, genre: "Hip-Hop", avatar: "🎤" },
    { id: 4, name: "Jazz Café", host: "Sarah Jazz", listeners: 654, genre: "Jazz", avatar: "🎹" },
    { id: 5, name: "Rock Revolution", host: "Metal Dave", listeners: 1876, genre: "Rock", avatar: "🎸" },
    { id: 6, name: "Pop Party Mix", host: "Sunny Days", listeners: 3421, genre: "Pop", avatar: "🎪" },
  ];

  const mostJoined = [
    { id: 7, name: "Global Beats", host: "World Music", listeners: 5432, genre: "World", avatar: "🌍" },
    { id: 8, name: "Reggae Sunset", host: "Island Vibes", listeners: 2987, genre: "Reggae", avatar: "🌴" },
    { id: 9, name: "Indie Underground", host: "Indie Hub", listeners: 1654, genre: "Indie", avatar: "🎭" },
    { id: 10, name: "EDM Energy", host: "Festival Mode", listeners: 4123, genre: "EDM", avatar: "⚡" },
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
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <nav className="bg-sidebar/30 backdrop-blur-md border-b border-border flex items-center justify-between px-6 py-4 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-secondary/20 rounded-lg transition-all duration-200"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search rooms..."
                className="w-full bg-secondary/20 border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/50">
              <Plus className="w-4 h-4" />
              Create Room
            </Button>
            <Button
              variant="outline"
              className="border-accent text-accent hover:bg-accent/10 gap-2 bg-transparent transition-all duration-200"
            >
              <DoorOpen className="w-4 h-4" />
              Join Room
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200">
              <span className="text-white font-semibold">A</span>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 space-y-12">
            {/* Popular Rooms */}
            <section className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold">Popular Rooms</h2>
                <p className="text-muted-foreground mt-1">
                  Discover trending music sessions happening right now
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <section className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold">Most Joined Rooms</h2>
                <p className="text-muted-foreground mt-1">
                  Experience the most active music communities
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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