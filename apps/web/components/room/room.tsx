"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
//   const [selectedRoom, setSelectedRoom] = useState(params.id);
  const [animatedVotes, setAnimatedVotes] = useState<{ [key: string]: number }>(
    {}
  );

  const [participants] = useState<Participant[]>([
    { id: "1", name: "Sarah", avatar: "👩", isHost: true },
    { id: "2", name: "Mike", avatar: "👨" },
    { id: "3", name: "Emma", avatar: "👩‍🦰" },
    { id: "4", name: "Dev", avatar: "🧑‍💻" },
  ]);

  const [upcomingSongs] = useState<UpcomingSong[]>([
    {
      id: "1",
      title: "Midnight Dreams",
      artist: "Luna Echo",
      votes: 1247,
      thumbnail: "🎵",
      progress: 65,
    },
    {
      id: "2",
      title: "Neon Nights",
      artist: "Cyber Pulse",
      votes: 892,
      thumbnail: "🎶",
      progress: 45,
    },
    {
      id: "3",
      title: "Electric Soul",
      artist: "Synth Wave",
      votes: 756,
      thumbnail: "🎸",
      progress: 30,
    },
    {
      id: "4",
      title: "Crystal Horizon",
      artist: "Aurora Sky",
      votes: 634,
      thumbnail: "🎹",
      progress: 20,
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
    setAnimatedVotes((prev) => ({
      ...prev,
      [songId]: (prev[songId] || 0) + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-900 text-white overflow-hidden">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-950/90 to-transparent backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                🎵 Audiyn
              </span>
              <span className="text-sm text-cyan-400 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                Summer Vibes Room
              </span>
            </div>
            <div className="flex items-center gap-2 ml-8 text-sm">
              <span className="text-slate-300">Host:</span>
              <span className="font-semibold text-cyan-400">Sarah 👩</span>
              <span className="ml-4 text-slate-300">Listeners:</span>
              <span className="font-semibold text-purple-400">2,847</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="hover:bg-purple-500/20 border border-purple-500/20 text-slate-300"
            >
              Invite
            </Button>
            <Link href="/dashboard">
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                Leave Room
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Video Player and Queue */}
          <div className="lg:col-span-2 space-y-6">
            {/* Now Playing */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-slate-800/80 to-purple-900/50 backdrop-blur-lg border border-purple-500/30 rounded-3xl p-8 shadow-2xl">
                {/* Video Player Area */}
                <div className="bg-black/40 rounded-2xl aspect-video flex items-center justify-center mb-6 border border-cyan-500/20 relative overflow-hidden group/player">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10" />
                  <div className="text-6xl">🎵</div>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </div>

                {/* Song Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      Midnight Dreams
                    </h2>
                    <p className="text-slate-400 text-lg mt-2">Luna Echo</p>
                  </div>

                  {/* Vote Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95">
                      👍 Upvote (2,847)
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 bg-transparent"
                    >
                      👎 Skip (342)
                    </Button>
                  </div>
                </div>

                {/* Queue Section */}
                <div className="pt-6 border-t border-purple-500/20">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                    Queue
                  </h3>
                  <div className="space-y-2">
                    {upcomingSongs.slice(0, 3).map((song) => (
                      <div
                        key={song.id}
                        className="group/queue bg-slate-800/40 hover:bg-slate-700/60 border border-purple-500/10 hover:border-cyan-500/30 rounded-xl p-3 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{song.thumbnail}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {song.title}
                            </p>
                            <p className="text-xs text-slate-400">
                              {song.artist}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-cyan-400 whitespace-nowrap">
                            {song.votes.toLocaleString()} votes
                          </span>
                        </div>
                        <div className="w-full bg-slate-700/40 rounded-full h-1 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
                            style={{ width: `${song.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Chat and Participants */}
          <div className="lg:col-span-1 flex flex-col gap-6 h-fit lg:sticky lg:top-24">
            {/* Participants */}
            {/* <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-slate-800/80 to-purple-900/50 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-4">
                <h3 className="font-semibold text-cyan-400 mb-3 text-sm uppercase tracking-wider">
                  Participants ({participants.length})
                </h3>
                <div className="space-y-2">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-xl">{participant.avatar}</span>
                      <span className="text-sm text-slate-300 flex-1">
                        {participant.name}
                      </span>
                      {participant.isHost && (
                        <span className="text-xs bg-purple-600/40 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
                          Host
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div> */}

            {/* Chat */}
            <div className="relative group flex-1 flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-slate-800/80 to-purple-900/50 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-4 flex flex-col min-h-96">
                <h3 className="font-semibold text-cyan-400 mb-3 text-sm uppercase tracking-wider">
                  Live Chat
                </h3>

                {/* Messages */}
                <div className="flex-1 space-y-3 mb-3 overflow-y-auto max-h-64 pr-2">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-2 text-xs">
                      <span className="text-lg">{msg.avatar}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-cyan-300">
                            {msg.user}
                          </span>
                          <span className="text-slate-500">
                            {msg.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-300">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2 pt-3 border-t border-purple-500/20">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Say something..."
                    className="flex-1 bg-slate-700/50 border border-purple-500/20 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Upcoming Songs Carousel */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent backdrop-blur-md border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h3 className="text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wider">
            Next Up ({upcomingSongs.length} songs)
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth">
            {upcomingSongs.map((song, idx) => (
              <div
                key={song.id}
                className="group/song flex-shrink-0 w-48 bg-gradient-to-br from-slate-800/60 to-purple-900/40 hover:from-slate-700/80 hover:to-purple-800/60 border border-purple-500/20 hover:border-cyan-500/40 rounded-xl p-3 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-3xl">{song.thumbnail}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-purple-300 opacity-75">
                      #{idx + 1}
                    </p>
                    <p className="text-sm font-semibold text-white truncate">
                      {song.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {song.artist}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-between mb-2">
                  <div className="flex-1 bg-slate-700/40 rounded-full h-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${song.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-cyan-400">
                    {song.votes}
                  </span>
                </div>
                <Button
                  onClick={() => handleVote(song.id)}
                  className="w-full bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-500 hover:to-cyan-500 text-white text-xs py-1 rounded-lg transition-all duration-200"
                >
                  Vote
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
