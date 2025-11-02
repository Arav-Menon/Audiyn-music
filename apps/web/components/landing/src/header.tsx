"use client";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center justify-center mt-14">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
                  Let the Crowd, <br /> Choose the Beat!
                </span>
              </h1>
              <h3 className="text-lg text-slate-300 leading-relaxed">
                Vote, vibe, and decide the next track — together.
              </h3>
            </div>

            <div className="flex gap-4">
              <Button
                variant={"destructive"}
                size="lg"
                className="bg-white/90 hover:bg-white cursor-pointer text-black font-semibold"
              >
                Create Room
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-400 text-white hover:bg-slate-950 cursor-pointer bg-transparent"
              >
                Join Room
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-700">
              <div>
                <p className="text-white/80 text-2xl font-bold">10K+</p>
                <p className="text-slate-400 text-sm">Active Users</p>
              </div>
              <div>
                <p className="text-white/80 text-2xl font-bold">50K+</p>
                <p className="text-slate-400 text-sm">Songs Voted</p>
              </div>
              <div>
                <p className="text-white/80 text-2xl font-bold">24/7</p>
                <p className="text-slate-400 text-sm">Live Rooms</p>
              </div>
            </div>
          </div>

          {/* Right - Now Playing Card */}
          {/* Right - Trending Songs Leaderboard */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm bg-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  🔥 Trending Now
                </h3>
                <p className="text-sm text-slate-400">Top songs this hour</p>
              </div>

              {/* Leaderboard Items */}
              <div className="space-y-3">
                {/* Rank 1 */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary hover:bg-slate-700 transition border border-slate-600">
                  <div className="text-lg font-bold text-white w-6">1</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-white/79 ">
                      Midnight Dreams
                    </p>
                    <p className="text-xs text-slate-400">Luna Sky</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">2.4K</p>
                    <p className="text-xs text-slate-400">votes</p>
                  </div>
                </div>

                {/* Rank 2 */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary hover:bg-gray-900 transition">
                  <div className="text-lg font-bold text-white/79 w-6">2</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-white/79 ">
                      Electric Pulse
                    </p>
                    <p className="text-xs text-slate-400">Neon Vibes</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-300">1.8K</p>
                    <p className="text-xs text-slate-400">votes</p>
                  </div>
                </div>

                {/* Rank 3 */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary hover:bg-gray-900 transition">
                  <div className="text-lg font-bold text-slate-400 w-6">3</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-white/79">
                      Summer Breeze
                    </p>
                    <p className="text-xs text-slate-400">Coastal Crew</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-300">1.2K</p>
                    <p className="text-xs text-slate-400">votes</p>
                  </div>
                </div>

                {/* Rank 4 */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary hover:bg-gray-900 transition">
                  <div className="text-lg font-bold text-slate-400 w-6">4</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-white/79">
                      Urban Nights
                    </p>
                    <p className="text-xs text-slate-400">City Sounds</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-300">890</p>
                    <p className="text-xs text-slate-400">votes</p>
                  </div>
                </div>

                {/* Rank 5 */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary hover:bg-gray-900 transition">
                  <div className="text-lg font-bold text-slate-400 w-6">5</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-white/79">
                      Cosmic Journey
                    </p>
                    <p className="text-xs text-slate-400">Space Echoes</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-300">650</p>
                    <p className="text-xs text-slate-400">votes</p>
                  </div>
                </div>
              </div>

              {/* View All Button */}
              <Button className="w-full bg-white/80 hover:bg-white text-black font-semibold">
                View Full Leaderboard →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
