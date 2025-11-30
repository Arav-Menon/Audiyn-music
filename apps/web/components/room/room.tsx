"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { SOCKET_URL } from "@/utils/api_url";
import { Search } from "lucide-react";

interface Message {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
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

export default function RoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  
  // WebSocket ref to persist connection
  const wsRef = useRef<WebSocket | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // State
  const [roomName, setRoomName] = useState("");
  const [host, setHost] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [queueSongs, setQueueSongs] = useState<Song[]>([]);
  const [nowPlaying] = useState<Song>({
    id: "np1",
    title: "On Top",
    artist: "Karan Aujla",
    votes: 1000,
    thumbnail: "🎵",
    addedBy: "Sarah",
    date: "15-09-2024",
    videoUrl: "https://www.youtube.com/embed/8e1S7Y5KAFM?si=rJiacOp39bH-kgLM",
  });

  // ✅ SINGLE WebSocket Connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Create WebSocket connection
    const ws = new WebSocket(SOCKET_URL, ["token", token]);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 WS Message:", data);

        // Handle different message types
        switch (data.type) {
          case "JOIN_SUCCESS":
            setRoomName(data.roomName);
            setHost(data.roomAdmin);
            break;

          case "Success":
            // When song is saved successfully
            console.log("✅ Song saved:", data.message);
            if (data.savedStream) {
              // Extract thumbnail URL from object array
              const processedStream = {
                ...data.savedStream,
                thumbnail: data.savedStream.thumbnails?.[0]?.url || data.savedStream.thumbnail || "🎵"
              };
              setSearchResults([processedStream]);
              setShowDropdown(true);
            }
            break;

          case "SONG_RESULTS":
            // When search results are received
            console.log("🔍 Search results:", data.payload.songs);
            const songs = data.payload.songs || [];
            // Process thumbnails - extract URL from thumbnail object/array
            const processedSongs = songs.map((song: any) => ({
              ...song,
              thumbnail: song.thumbnails?.[0]?.url || song.thumbnail || "🎵"
            }));
            setSearchResults(processedSongs);
            setShowDropdown(processedSongs.length > 0);
            break;

          case "Error":
            console.error("❌ Error:", data.message);
            break;

          default:
            console.log("Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("Error parsing WS message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("🔴 WebSocket Closed");
    };

    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [roomId, router]);

  // ✅ Search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search request
    debounceRef.current = setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const searchMessage = {
          type: "SEARCH_SONG",
          payload: {
            songName: searchQuery,
            roomId: roomId,
          },
        };
        
        console.log("🔍 Sending search:", searchMessage);
        wsRef.current.send(JSON.stringify(searchMessage));
      } else {
        console.error("WebSocket not connected");
      }
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, roomId]);

  // Leave room handler
  const handleLeaveRoom = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "LEAVE_ROOM",
          payload: {
            roomId: localStorage.getItem("roomId"),
          },
        })
      );
    }
    localStorage.removeItem("roomId");
    router.push("/dashboard");
  };

  // Add song to queue
  const handleAddToQueue = (song: any) => {
    const newSong: Song = {
      id: Date.now().toString(),
      title: song.title,
      artist: song.artist,
      votes: 0,
      thumbnail: song.thumbnail, // Already processed from WebSocket
      addedBy: "You",
      date: new Date().toLocaleDateString("en-GB"),
    };
    setQueueSongs([...queueSongs, newSong]);
    setSearchQuery("");
    setShowDropdown(false);
  };

  // Vote handler
  const handleVote = (songId: string) => {
    setQueueSongs(
      queueSongs
        .map((song) =>
          song.id === songId ? { ...song, votes: song.votes + 1 } : song
        )
        .sort((a, b) => b.votes - a.votes)
    );
  };

  // Send chat message
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

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_70%)] text-white">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-800">
        <div className="px-3 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <img src="/audiyn.png" className="h-8 w-8 md:h-12 md:w-12" alt="" />
            <span className="sm:inline">/</span>
            <h2 className="text-sm md:text-base">{roomName}</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="px-2 md:px-4 py-1 md:py-2 rounded-lg flex bg-white/20 items-center justify-center">
              <span className="text-xs md:text-base">Host: {host}</span>
            </div>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm px-2 md:px-4 py-1 md:py-2 rounded-md h-auto"
              onClick={handleLeaveRoom}
            >
              Leave
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-[68px] md:pt-[84px] mt-2 px-3 md:px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Center Section - Video & Search */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4 md:space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 flex items-center gap-3">
                <Search className="w-4 h-6" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for songs..."
                  className="flex-1 bg-transparent text-sm md:text-base text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* Search Results Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-gray-800 rounded-xl overflow-hidden z-50 shadow-2xl max-h-96 overflow-y-auto">
                  {searchResults.map((song, index) => (
                    <div
                      key={song.id || index}
                      className="flex items-center gap-3 p-3 md:p-4 hover:bg-white/10 cursor-pointer transition-all border-b border-gray-800 last:border-0"
                      onClick={() => handleAddToQueue(song)}
                    >
                      <div className="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        {song.thumbnail && song.thumbnail.startsWith('http') ? (
                          <img 
                            src={song.thumbnail} 
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🎵
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{song.title}</p>
                        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                      </div>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-2 rounded-lg">
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Player */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl md:rounded-2xl border border-gray-800 overflow-hidden">
              <div className="relative aspect-video bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={nowPlaying.videoUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* Queue Section */}
          <div className="lg:col-span-3 order-2 space-y-4">
            <div className="bg-white/10 rounded-xl p-4 border border-white/5">
              <h3 className="text-sm font-semibold mb-4">Queue Songs</h3>
              <div className="space-y-3">
                {queueSongs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={song.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{song.title}</p>
                      <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                    </div>
                    <Button
                      onClick={() => handleVote(song.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded"
                    >
                      {song.votes} ↑
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-3 order-3">
            <div className="bg-white/5 rounded-xl border border-white/10 flex flex-col h-[500px]">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm font-semibold">Live Chat</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      {msg.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">{msg.user}</span>
                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
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
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
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