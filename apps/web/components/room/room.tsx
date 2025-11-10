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

interface Song {
  id: string;
  title: string;
  artist: string;
  votes: number;
  thumbnail: string;
  addedBy: string;
  date: string;
  videoUrl?: string;
}

const mockSearchResults = [
  { id: "s1", title: "Starlight", artist: "The Weeknd", thumbnail: "🌟" },
  { id: "s2", title: "Blinding Lights", artist: "The Weeknd", thumbnail: "💡" },
  { id: "s3", title: "Save Your Tears", artist: "The Weeknd", thumbnail: "💧" },
  { id: "s4", title: "After Hours", artist: "The Weeknd", thumbnail: "🌙" },
];

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
      text: "Love this vibe!",
      timestamp: "2:35 PM",
    },
    {
      id: "3",
      user: "Casey",
      avatar: "👨‍🦱",
      text: "Keep it up 🎵",
      timestamp: "2:36 PM",
    },
  ]);

  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("User choice");

  const genres = ["User choice", "Drill", "Melody", "Hip hop", "Rock"];
  const genreVotes = {
    "User choice": 98,
    Drill: 98,
    Melody: 74,
    "Hip hop": 63,
    Rock: 41,
  };

  const [participants] = useState<Participant[]>([
    { id: "1", name: "Sarah", avatar: "👩", isHost: true },
    { id: "2", name: "Mike", avatar: "👨" },
    { id: "3", name: "Emma", avatar: "👩‍🦰" },
    { id: "4", name: "Dev", avatar: "🧑‍💻" },
  ]);

  const [nowPlaying] = useState<Song>({
    id: "np1",
    title: "On Top",
    artist: "Karan Aujla",
    votes: 1000,
    thumbnail: "🎵",
    addedBy: "Sarah",
    date: "15-09-2024",
    videoUrl: "https://www.youtube.com/embed/1qDVKX6a9sg?si=2pIJAwW06aHrIVU7",
  });

  const [queueSongs, setQueueSongs] = useState<Song[]>([
    {
      id: "q1",
      title: "makasam",
      artist: "Krsna",
      votes: 98,
      thumbnail:
        "https://i.ytimg.com/vi/JgDNFQ2RaLQ/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLDaCZagWy7JA54Qr8RHleRe-05BVQ",
      addedBy: "Mike",
      date: "12-07-2024",
    },
    {
      id: "q2",
      title: "softly",
      artist: "Karan Aujla",
      votes: 74,
      thumbnail:
        "https://i.ytimg.com/vi/t7wSjy9Lv-o/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLDY92waHiwPJShyE7miw6kdJD-U5Q",
      addedBy: "Emma",
      date: "12-07-2024",
    },
    {
      id: "q3",
      title: "100 million",
      artist: "Divine",
      votes: 63,
      thumbnail:
        "https://i.ytimg.com/vi/-urTPhh7gNk/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLBNdjvIt4MpJ_7BSx4nIepNfrg0nQ",
      addedBy: "Dev",
      date: "12-07-2024",
    },
    {
      id: "q4",
      title: "volume 1",
      artist: "Various",
      votes: 41,
      thumbnail:
        "https://i.ytimg.com/vi/yDkIFW7eJ04/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLB27LPmnLWNGW_Azbe-M9FVFNL2rQ",
      addedBy: "Sarah",
      date: "12-07-2024",
    },
  ]);

  const [topVoted] = useState([
    { title: "makasam", artist: "Krsna", percentage: 97, thumbnail: "🎤" },
    {
      title: "Winner Speech",
      artist: "Karan Aujla",
      percentage: 74,
      thumbnail: "🏆",
    },
    { title: "Softly", artist: "Karan Aujla", percentage: 68, thumbnail: "🎶" },
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
    setQueueSongs(
      queueSongs
        .map((song) =>
          song.id === songId ? { ...song, votes: song.votes + 1 } : song
        )
        .sort((a, b) => b.votes - a.votes)
    );
  };

  const handleAddToQueue = (song: any) => {
    const newSong: Song = {
      id: Date.now().toString(),
      title: song.title,
      artist: song.artist,
      votes: 0,
      thumbnail: song.thumbnail,
      addedBy: "You",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };
    setQueueSongs([...queueSongs, newSong]);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_70%)] text-white">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 mb-2 border-b border-gray-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="./audiyn.png" className="h-12 w-12" alt="" /> /
            <h2>VibeCore</h2>
            <div className="h-6 w-px bg-gray-700" />
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>2,847 listeners</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className=" px-4 rounded-lg flex bg-white/20 items-center justify-center">
              <span className="text-lg">Host : @cyvox </span>
            </div>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md"
            >
              Leave Room
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-6 px-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Section - Song Info & Queue */}
          <div className="col-span-3 space-y-6">
            {/* Right Section - Chat & Most Voted */}
            <div className="col-span-3 space-y-6">
              {/* Most Voted for Next */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-sm font-semibold mb-4">
                  Most voted for next
                </h3>
                <div className="aspect-video bg-black rounded-xl overflow-hidden">
                  <img
                    src="https://i.ytimg.com/vi/-ub7fpR6tM4/hqdefault.jpg?sqp=-oaymwEmCKgBEF5IWvKriqkDGQgBFQAAiEIYAdgBAeIBCggYEAIYBjgBQAE=&rs=AOn4CLA-XmAsHkbRm5-Tw2Ljcyqw73xd7Q"
                    alt="Most voted"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Queue Songs */}
              <div className="bg-white/10 rounded-2xl p-6 border border-white/5">
                <h3 className="text-sm font-semibold mb-4">Queue Songs</h3>
                <div className="space-y-3">
                  {queueSongs.map((song, idx) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg transition-all"
                    >
                      <div className="w-24 h-14 bg- rounded-lg flex items-center justify-center text-xl">
                        <img
                          src={song.thumbnail}
                          alt=""
                          className="rounded-sm"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {song.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {song.artist}
                        </p>
                        <p className="text-xs text-gray-500">{song.date}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-white/20 text-white/95  px-2 py-1 rounded text-xs font-bold">
                            {song.votes}
                          </div>
                          <Button
                            onClick={() => handleVote(song.id)}
                            className="bg-white/90 hover:bg-white/75 cursor-pointer text-black text-xs px-3 py-1 rounded h-auto"
                          >
                            Up Vote
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top 3 Voted */}
            {/* <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-sm font-semibold mb-4">Top 3 voted</h3>
              <div className="space-y-3">
                {topVoted.map((song, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-gray-600">
                      {song.percentage}%
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-xl">
                      {song.thumbnail}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{song.title}</p>
                      <p className="text-xs text-gray-400">{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Genre Selection */}
            {/* <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-800">
              <div className="grid grid-cols-2 gap-3">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedGenre === genre
                        ? "bg-white text-black border-white"
                        : "bg-gray-800 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="text-2xl font-bold mb-1">{genreVotes[genre as keyof typeof genreVotes]}</div>
                    <div className="text-xs">{genre}</div>
                  </button>
                ))}
              </div>
            </div> */}
          </div>

          {/* Center Section - Video Player & Top Voted */}
          <div className="col-span-6 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  placeholder="Search the song"
                  className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden z-50 shadow-2xl">
                  {mockSearchResults
                    .filter(
                      (song) =>
                        song.title
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        song.artist
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    )
                    .map((song) => (
                      <div
                        key={song.id}
                        className="flex items-center gap-3 p-4 hover:bg-gray-800 cursor-pointer transition-all border-b border-gray-800 last:border-0"
                        onClick={() => handleAddToQueue(song)}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-xl">
                          {song.thumbnail}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{song.title}</p>
                          <p className="text-xs text-gray-400">{song.artist}</p>
                        </div>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-2 rounded-lg">
                          Add to Queue
                        </Button>
                      </div>
                    ))}
                  {mockSearchResults.filter(
                    (song) =>
                      song.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      song.artist
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Video Player */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800 overflow-hidden">
              {/* Video Area with iframe */}
              <div className="relative aspect-video bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={
                    nowPlaying.videoUrl ||
                    "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
                  }
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2 z-10">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-xs font-bold">LIVE</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  {/* <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <h2 className="text-lg font-bold">{nowPlaying.title}</h2>
                        <p className="text-sm text-gray-400">{nowPlaying.artist}</p>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Now Playing Stats */}
            {/* <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="text-xs text-gray-400 mb-1">up votes</p>
                <p className="text-2xl font-bold">{nowPlaying.votes}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-800">
                <p className="text-xs text-gray-400 mb-1">views</p>
                <p className="text-2xl font-bold">100m</p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-800">
                <p className="text-xs text-gray-400 mb-1">Date</p>
                <p className="text-lg">{nowPlaying.date}</p>
              </div>
            </div> */}

            {/* Song of the Day */}
            <div className="bg-white/5 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">
                Song of the day
              </h3>
              <div className="flex gap-4 mb-4">
                <div className="w-38 h-22 bg-white/10 rounded-lg flex items-center justify-center text-4xl">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5F-xABWoed1Q9SmMEzasYNgx4NRH-aoBRKQ&s"
                    alt=""
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-400">659 votes</span>
                    <span className="text-xs text-green-400">like 98%</span>
                  </div>
                  <Button className="w-full bg-white/15 hover:bg-gray-600 text-white text-sm rounded-lg py-2">
                    Add to play again
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                <div>
                  <p className="text-xs text-gray-400 mb-1">up votes</p>
                  <p className="text-lg font-bold">659</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">views</p>
                  <p className="text-lg font-bold">100m</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Date</p>
                  <p className="text-sm">15-09-2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Chat */}
          <div className="col-span-3 space-y-6">
            {/* Chat */}
            <div className="bg-white/5 rounded-2xl border border-white/10 flex flex-col h-[calc(100vh-120px)]">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm font-semibold">
                  Live Chat ({participants.length} online)
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-lg">
                      {msg.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">
                          {msg.user}
                        </span>
                        <span className="text-xs text-gray-500">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-lg"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
