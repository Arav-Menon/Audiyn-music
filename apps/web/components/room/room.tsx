"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { SOCKET_URL } from "@/utils/api_url";
import { getRoom } from "@/utils/join_room_api/api";
import { Search, Users } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Message {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
}

interface Song {
  id: string;
  videoId?: string;
  title: string;
  artist: string;
  votes: number;
  thumbnail: string;
  addedBy: string;
  date: string;
  videoUrl?: string;
  userVoted?: boolean;
}

interface PlayerSong {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
}

export default function RoomPage() {
  const { roomId } = useParams();
  const router = useRouter();

  const wsRef = useRef<WebSocket | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const fetchedRef = useRef(false);
  const playerRef = useRef<any>(null);
  const playerReadyRef = useRef(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [roomName, setRoomName] = useState("");
  const [host, setHost] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [queueSongs, setQueueSongs] = useState<Song[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<PlayerSong | null>(null);
  const [activeMembers, setActiveMembers] = useState(0);
  const currentlyPlayingRef = useRef<PlayerSong | null>(null);
  const pendingVideoRef = useRef<string | null>(null);
  const playbackEndSentRef = useRef(false);
  const endedPollRef = useRef<NodeJS.Timeout | null>(null);
  const [ytApiReady, setYtApiReady] = useState(false);

  const upNext = queueSongs.length > 0 ? queueSongs[0] : null;
  const remainingQueue = queueSongs.slice(1);

  const sendWS = (type: string, payload?: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  };

  const loadVideo = (videoId: string) => {
    if (playerRef.current && playerReadyRef.current) {
      playerRef.current.loadVideoById(videoId);
      pendingVideoRef.current = null;
    } else {
      pendingVideoRef.current = videoId;
    }
  };

  const stopVideo = () => {
    if (playerRef.current && playerReadyRef.current) {
      playerRef.current.stopVideo();
    }
    pendingVideoRef.current = null;
  };

  const fetchRoomInfo = async () => {
    if (fetchedRef.current || !roomId) return;
    try {
      const data = await getRoom(roomId as string);
      if (data?.room) {
        setRoomName(data.room.name);
        setHost(data.admin?.username || data.room.createdBy?.username || "");
        fetchedRef.current = true;
      }
    } catch {
    }
  };

  useEffect(() => {
    fetchRoomInfo();
  }, [roomId]);

  useEffect(() => {
    currentlyPlayingRef.current = currentlyPlaying;
  }, [currentlyPlaying]);

  useEffect(() => {
    if (!currentlyPlaying) return;

    playbackEndSentRef.current = false;

    endedPollRef.current = setInterval(() => {
      try {
        const player = playerRef.current;
        if (!player || !player.getPlayerState) return;
        const state = player.getPlayerState();
        if (state === window.YT.PlayerState.ENDED && !playbackEndSentRef.current) {
          playbackEndSentRef.current = true;
          console.log("[Poll] Detected ENDED state via polling");
          sendWS("SONG_ENDED", {
            videoId: currentlyPlayingRef.current?.videoId,
            roomId,
          });
        }
      } catch {}
    }, 1000);

    return () => {
      if (endedPollRef.current) clearInterval(endedPollRef.current);
    };
  }, [currentlyPlaying]);

  useEffect(() => {
    if (typeof window.YT === "undefined") {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        setYtApiReady(true);
      };
    } else {
      setYtApiReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ytApiReady || !playerContainerRef.current) return;

    playerRef.current = new window.YT.Player(playerContainerRef.current, {
      height: "100%",
      width: "100%",
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          playerReadyRef.current = true;

          const target = pendingVideoRef.current || currentlyPlayingRef.current?.videoId || null;
          if (target) {
            playerRef.current.loadVideoById(target);
            pendingVideoRef.current = null;
          }
        },
        onStateChange: (event: any) => {
          console.log("[Player] onStateChange:", event.data, "current:", currentlyPlayingRef.current?.videoId);
          if (event.data === window.YT.PlayerState.ENDED && !playbackEndSentRef.current) {
            playbackEndSentRef.current = true;
            const current = currentlyPlayingRef.current;
            if (current) {
              console.log("[Player] SONG_ENDED sent:", current.videoId);
              sendWS("SONG_ENDED", {
                videoId: current.videoId,
                roomId,
              });
            }
          }
        },
      },
    });

    return () => {
      playerReadyRef.current = false;
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
      playerRef.current = null;
    };
  }, [ytApiReady]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const ws = new WebSocket(SOCKET_URL, ["token", token]);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "GET_ROOM_INFO", payload: { roomId } }));
      ws.send(JSON.stringify({ type: "GET_QUEUE", payload: { roomId } }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "JOIN_SUCCESS":
            setRoomName(data.roomName);
            setHost(data.roomAdmin);
            break;

          case "SONG_RESULTS": {
            const songs = data.payload?.songs || [];
            setSearchResults(songs);
            setShowDropdown(true);
            setIsSearching(false);
            break;
          }

          case "QUEUE_DATA": {
            if (data.currentlyPlaying) {
              setCurrentlyPlaying(data.currentlyPlaying);
            }
            const queue = data.queue || [];
            setQueueSongs(
              queue
                .sort((a: any, b: any) => b.votes - a.votes)
                .map((s: any) => ({
                  id: s.id,
                  videoId: s.videoId,
                  title: s.title,
                  artist: s.artist,
                  votes: s.votes,
                  thumbnail: s.thumbnail,
                  addedBy: "",
                  date: "",
                  userVoted: s.userVoted,
                }))
            );
            break;
          }

          case "VOTE_UPDATE": {
            setQueueSongs((prev) =>
              prev
                .map((s) =>
                  s.videoId === data.videoId
                    ? { ...s, votes: data.votes }
                    : s
                )
                .sort((a, b) => b.votes - a.votes)
            );
            break;
          }

          case "QUEUE_UPDATED": {
            if (data.stream) {
              const newSong: Song = {
                id: data.stream.id || Date.now().toString(),
                videoId: data.stream.videoId,
                title: data.stream.songName || data.stream.title,
                artist: data.stream.artistName || data.stream.artist,
                votes: 0,
                thumbnail: data.stream.thumbnailUrl || data.stream.thumbnail || "🎵",
                addedBy: "",
                date: data.stream.createdAt || "",
              };
              setQueueSongs((prev) =>
                prev.some((s) => s.videoId === data.stream.videoId)
                  ? prev
                  : [...prev, newSong]
              );
            }
            break;
          }

          case "PLAYBACK_START": {
            const song: PlayerSong = data.song;
            setCurrentlyPlaying(song);
            loadVideo(song.videoId);
            setQueueSongs((prev) =>
              prev.filter((s) => s.videoId !== song.videoId)
            );
            break;
          }

          case "PLAYBACK_STOP": {
            setCurrentlyPlaying(null);
            stopVideo();
            break;
          }

          case "ACTIVE_MEMBERS": {
            setActiveMembers(data.count);
            break;
          }

          case "CHAT": {
            setMessages((prev) => [...prev, data.message]);
            break;
          }

          case "Error":
            console.error("Error:", data.message);
            break;

          default:
            break;
        }
      } catch (error) {
        console.error("Error parsing WS message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [roomId, router]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setIsSearching(true);
      sendWS("SEARCH_SONG", { songName: searchQuery, roomId });
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      setIsSearching(false);
    };
  }, [searchQuery, roomId]);

  const handleLeaveRoom = () => {
    sendWS("LEAVE_ROOM", { roomId: localStorage.getItem("roomId") });
    localStorage.removeItem("roomId");
    router.push("/dashboard");
  };

  const handleAddToQueue = (song: any) => {
    sendWS("ADD_TO_QUEUE", {
      song: {
        videoId: song.videoId,
        title: song.title,
        artist: song.artist,
        thumbnail: song.thumbnail,
      },
      roomId,
    });
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleVote = (song: Song) => {
    const videoId = song.videoId || song.id;
    setQueueSongs(
      queueSongs
        .map((s) =>
          s.id === song.id ? { ...s, userVoted: !s.userVoted, votes: s.userVoted ? s.votes - 1 : s.votes + 1 } : s
        )
        .sort((a, b) => b.votes - a.votes)
    );
    sendWS(song.userVoted ? "DOWN_VOTE" : "UP_VOTE", {
      videoId,
      roomId,
    });
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendWS("CHAT", { message: messageInput, roomId });
      setMessageInput("");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_70%)] text-white overflow-hidden">
      <nav className="flex-shrink-0 backdrop-blur-md border-b border-gray-800">
        <div className="px-3 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <img src="/audiyn.png" className="h-8 w-8 md:h-12 md:w-12" alt="" />
            <span className="sm:inline">/</span>
            <h2 className="text-sm md:text-base font-semibold">{roomName || "Loading..."}</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="px-2 md:px-4 py-1 md:py-2 rounded-lg flex bg-white/20 items-center justify-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs md:text-sm">{activeMembers} Active</span>
            </div>
            <div className="px-2 md:px-4 py-1 md:py-2 rounded-lg flex bg-white/20 items-center justify-center">
              <span className="text-xs md:text-base">Host: {host || "Loading..."}</span>
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
      </nav>

      <div className="flex-1 overflow-hidden flex flex-col pt-2 px-3 md:px-6 pb-6">
        <div className="relative flex-shrink-0 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 flex items-center gap-3">
            <Search className="w-4 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs..."
              className="flex-1 bg-transparent text-sm md:text-base text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          {searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-3 border border-gray-700/50 rounded-2xl shadow-xl backdrop-blur-sm z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {isSearching && searchResults.length === 0 ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                      <div className="w-14 h-14 rounded-xl bg-white/10 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-white/10" />
                        <div className="h-3 w-1/2 rounded bg-white/5" />
                      </div>
                      <div className="w-20 h-8 rounded-lg bg-white/10" />
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-3 space-y-1 max-h-[400px] overflow-y-auto">
                  {searchResults.map((song, index) => (
                    <div
                      key={song.videoId || index}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.06] cursor-pointer transition-all duration-200 group"
                      onClick={() => handleAddToQueue(song)}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800 shadow-lg">
                        {song.thumbnail?.startsWith("http") ? (
                          <img
                            src={song.thumbnail}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🎵</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{song.title}</p>
                        <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                        {song.duration && (
                          <p className="text-[10px] text-gray-600 mt-0.5">{song.duration}</p>
                        )}
                      </div>
                      <span className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium bg-white/90 text-black/90 transition-all duration-200 group-hover:scale-105 select-none">
                        + Queue
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl mb-2 opacity-40">🎵</div>
                  <p className="text-sm font-semibold text-gray-400">No songs found</p>
                  <p className="text-xs text-gray-600 mt-1">Try searching for another song.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
          <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden order-2 lg:order-1">
            {upNext ? (
              <div className="flex-shrink-0 group relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:border-white/50 hover:shadow-lg hover:shadow-white/30">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {upNext.thumbnail?.startsWith("http") ? (
                    <img
                      src={upNext.thumbnail}
                      alt={upNext.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl bg-gray-800">🎵</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-purple-500/80 text-white backdrop-blur-sm">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      Most Voted Next
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-white drop-shadow-lg truncate">{upNext.title}</h3>
                    <p className="text-sm text-gray-300 drop-shadow-lg truncate">{upNext.artist}</p>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{upNext.votes} vote{upNext.votes !== 1 ? 's' : ''}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-white text-xs font-semibold tabular-nums leading-none text-gray-900">
                      {upNext.votes}
                    </span>
                    <Button
                      onClick={() => handleVote(upNext)}
                      className={`text-xs px-3 py-1.5 rounded-lg leading-none font-medium transition-all ${
                        upNext.userVoted
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-white/10 hover:bg-white/20 text-gray-300"
                      }`}
                    >
                      Vote
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-shrink-0 rounded-2xl border border-gray-800/50 border-dashed p-6 flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-3 opacity-40">🎵</div>
                <p className="text-sm font-semibold text-gray-400">No upcoming songs</p>
                <p className="text-xs text-gray-600 mt-1">Search and add songs to the queue</p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin">
              {remainingQueue.length > 0 && (
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Queue</h3>
                  <span className="text-[10px] text-gray-600">{remainingQueue.length} song{remainingQueue.length !== 1 ? 's' : ''}</span>
                </div>
              )}
              <div className="space-y-1.5">
                {remainingQueue.length === 0 ? (
                  <p className="text-xs text-gray-600 text-center py-6">No songs in queue</p>
                ) : (
                  remainingQueue.map((song) => (
                    <div
                      key={song.id}
                      className="group flex items-center gap-3 p-2.5 bg-white/[0.04] border border-gray-800/50 hover:border-gray-700/50 rounded-xl transition-all duration-200"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                        {song.thumbnail?.startsWith("http") ? (
                          <img src={song.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">🎵</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate leading-snug">{song.title}</p>
                        <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                        {song.date && (
                          <p className="text-[10px] text-gray-600 mt-0.5">
                            Added {new Date(song.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-lg bg-white text-xs font-semibold tabular-nums leading-none text-gray-900">
                          {song.votes}
                        </span>
                        <Button
                          onClick={() => handleVote(song)}
                          className={`text-xs px-3 py-1.5 rounded-lg leading-none font-medium transition-all ${
                            song.userVoted
                              ? "bg-green-600/20 hover:bg-green-600/30 text-green-400"
                              : "bg-white/10 hover:bg-white/20 text-gray-300"
                          }`}
                        >
                          Vote
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden shadow-lg">
              {currentlyPlaying ? (
                <div className="relative aspect-video bg-black">
                  <div
                    ref={playerContainerRef}
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-black/80 flex flex-col items-center justify-center gap-4 p-8">
                  <div className="text-6xl opacity-60">🎵</div>
                  <p className="text-lg font-semibold text-gray-300">No song playing</p>
                  <p className="text-sm text-gray-500 text-center max-w-md">
                    Search for a song above and add it to the queue to start the party!
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col overflow-hidden order-4 lg:order-3">
            <div className="flex-1 flex flex-col rounded-2xl border border-gray-700/50 overflow-hidden">
              <div className="flex-shrink-0 p-4 border-b border-gray-700/50">
                <h3 className="text-sm font-semibold">Live Chat</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-8">No messages yet. Start the conversation!</p>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xs">
                      {msg.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold">{msg.user}</span>
                        <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-shrink-0 p-4 border-t border-gray-700/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 border border-gray-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-white/90 hover:bg-purple-700 text-black px-4 py-2.5 rounded-xl text-sm"
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
