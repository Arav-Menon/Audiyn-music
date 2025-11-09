"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
}

interface UpcomingSong {
  id: string;
  title: string;
  artist: string;
  votes: number;
  thumbnail: string;
  progress: number;
  addedBy: string;
}

export default function RoomPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "Alex",
      avatar: "👨",
      text: "This track is fire! 🔥",
      timestamp: "2:34 PM",
    },
    {
      id: "2",
      user: "Jordan",
      avatar: "👩",
      text: "Love this vibe, can we vote it to number 1?",
      timestamp: "2:35 PM",
    },
    {
      id: "3",
      user: "Casey",
      avatar: "👨‍🦱",
      text: "Already voted! Keep the energy up 🎵",
      timestamp: "2:36 PM",
    },
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddSong, setShowAddSong] = useState(false);

  const [participants] = useState<Participant[]>([
    { id: "1", name: "Sarah", avatar: "👩", isHost: true },
    { id: "2", name: "Mike", avatar: "👨" },
    { id: "3", name: "Emma", avatar: "👩‍🦰" },
    { id: "4", name: "Dev", avatar: "🧑‍💻" },
    { id: "5", name: "Alex", avatar: "👨" },
    { id: "6", name: "Jordan", avatar: "👩" },
    { id: "7", name: "Casey", avatar: "👨‍🦱" },
    { id: "8", name: "Taylor", avatar: "🧑" },
  ]);

  const [upcomingSongs, setUpcomingSongs] = useState<UpcomingSong[]>([
    {
      id: "1",
      title: "Midnight Dreams",
      artist: "Luna Echo",
      votes: 1247,
      thumbnail: "🎵",
      progress: 65,
      addedBy: "Sarah",
    },
    {
      id: "2",
      title: "Neon Nights",
      artist: "Cyber Pulse",
      votes: 892,
      thumbnail: "🎶",
      progress: 45,
      addedBy: "Mike",
    },
    {
      id: "3",
      title: "Electric Soul",
      artist: "Synth Wave",
      votes: 756,
      thumbnail: "🎸",
      progress: 30,
      addedBy: "Emma",
    },
    {
      id: "4",
      title: "Crystal Horizon",
      artist: "Aurora Sky",
      votes: 634,
      thumbnail: "🎹",
      progress: 20,
      addedBy: "Dev",
    },
    {
      id: "5",
      title: "Sunset Boulevard",
      artist: "Dream State",
      votes: 521,
      thumbnail: "🎼",
      progress: 15,
      addedBy: "Alex",
    },
  ]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        user: "You",
        avatar: "👤",
        text: messageInput,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");
    }
  };

  const handleVote = (songId: string) => {
    setUpcomingSongs(
      upcomingSongs
        .map((song) =>
          song.id === songId ? { ...song, votes: song.votes + 1 } : song
        )
        .sort((a, b) => b.votes - a.votes)
    );
  };

  const handleRemoveSong = (songId: string) => {
    setUpcomingSongs(upcomingSongs.filter((song) => song.id !== songId));
  };

  return (
    <div className="min-h-screen bg-white/10 text-white overflow-hidden">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-950/95 to-slate-950/80 backdrop-blur-xl border-b border-purple-500/20 shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                🎵 Audiyn
              </span>
              <div className="h-8 w-px bg-purple-500/30" />
              <span className="text-sm text-cyan-400 px-3 py-1.5 bg-cyan-500/10 rounded-full border border-cyan-500/30 font-medium">
                Summer Vibes Room
              </span>
            </div>
            <div className="flex items-center gap-4 ml-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Host:</span>
                <span className="font-semibold text-cyan-400">Sarah 👩</span>
              </div>
              <div className="h-4 w-px bg-purple-500/30" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-slate-400">Listeners:</span>
                <span className="font-semibold text-purple-400">2,847</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="hover:bg-purple-500/20 border border-purple-500/30 text-slate-300 hover:text-white transition-all"
            >
              📤 Invite
            </Button>
            <Button
              variant="destructive"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border-0"
            >
              🚪 Leave Room
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-6 px-6">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-7rem)]">
          {/* Left: Video Player and Queue */}
          <div className="lg:col-span-8 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
            {/* Now Playing */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-slate-800/90 to-purple-900/60 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-2xl">
                {/* Video Player Area */}
                <div className="bg-gradient-to-br from-black/60 to-purple-950/40 rounded-2xl aspect-video flex items-center justify-center mb-6 border border-cyan-500/30 relative overflow-hidden group/player">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
                  <div className="text-8xl animate-pulse">🎵</div>
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-red-500/50">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-red-400">
                      LIVE
                    </span>
                  </div>

                  {/* Playback Controls */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-slate-950/80 backdrop-blur-md rounded-xl p-3 border border-purple-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-slate-400">1:23</span>
                        <div className="flex-1 bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-300"
                            style={{ width: "45%" }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">3:45</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Song Info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Midnight Dreams
                      </h2>
                      <p className="text-slate-400 text-lg">Luna Echo</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Added by Sarah 👩
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="bg-purple-500/20 px-4 py-2 rounded-xl border border-purple-500/30">
                        <p className="text-xs text-purple-300">Total Votes</p>
                        <p className="text-2xl font-bold text-purple-400">
                          2,847
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vote Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 hover:from-purple-500 hover:via-purple-600 hover:to-purple-500 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/30">
                      <span className="text-xl mr-2">👍</span>
                      Upvote (2,847)
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 bg-red-950/20 shadow-lg shadow-red-500/10"
                    >
                      <span className="text-xl mr-2">👎</span>
                      Skip (342)
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Queue Section */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-slate-800/90 to-purple-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    Up Next
                    <span className="text-sm text-slate-400 font-normal">
                      ({upcomingSongs.length} songs)
                    </span>
                  </h3>
                  <Button
                    onClick={() => setShowAddSong(!showAddSong)}
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-sm px-4 py-2 rounded-lg transition-all"
                  >
                    ➕ Add Song
                  </Button>
                </div>

                {showAddSong && (
                  <div className="mb-4 p-4 bg-slate-900/60 border border-cyan-500/30 rounded-xl">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for a song to add..."
                      className="w-full bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                )}

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {upcomingSongs.map((song, idx) => (
                    <div
                      key={song.id}
                      className="group/queue bg-gradient-to-br from-slate-800/60 to-slate-900/60 hover:from-slate-700/80 hover:to-slate-800/80 border border-purple-500/20 hover:border-cyan-500/40 rounded-xl p-4 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg border border-purple-500/30">
                          <span className="text-sm font-bold text-purple-300">
                            #{idx + 1}
                          </span>
                        </div>
                        <span className="text-3xl">{song.thumbnail}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-white truncate">
                            {song.title}
                          </p>
                          <p className="text-sm text-slate-400">
                            {song.artist}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Added by {song.addedBy}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30">
                            <span className="text-sm font-bold text-cyan-400">
                              {song.votes}
                            </span>
                          </div>
                          <Button
                            onClick={() => handleVote(song.id)}
                            className="bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-500 hover:to-cyan-500 text-white text-xs px-4 py-1.5 rounded-lg transition-all"
                          >
                            👍 Vote
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700/50 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300"
                            style={{ width: `${song.progress}%` }}
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveSong(song.id)}
                          className="text-red-400 hover:text-red-300 text-xs opacity-0 group-hover/queue:opacity-100 transition-opacity"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Chat and Participants */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full">
            {/* Chat */}
            <div className="relative group flex-1 flex flex-col min-h-0">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-slate-800/90 to-purple-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 flex flex-col h-full shadow-2xl">
                <h3 className="font-semibold text-cyan-400 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  Live Chat
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-auto" />
                </h3>

                {/* Messages */}
                <div className="flex-1 space-y-3 mb-3 overflow-y-auto pr-2 custom-scrollbar">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex gap-2 text-sm hover:bg-slate-800/30 p-2 rounded-lg transition-all"
                    >
                      <span className="text-xl flex-shrink-0">
                        {msg.avatar}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-cyan-300 text-sm">
                            {msg.user}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {msg.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2 pt-3 border-t border-purple-500/30">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-700/50 border border-purple-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-5 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    📤
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(71, 85, 105, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            to bottom,
            rgba(168, 85, 247, 0.4),
            rgba(34, 211, 238, 0.4)
          );
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            to bottom,
            rgba(168, 85, 247, 0.6),
            rgba(34, 211, 238, 0.6)
          );
        }
      `}</style>
    </div>
  );
}
