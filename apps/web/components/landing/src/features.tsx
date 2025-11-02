"use client";
import { Button } from "@/components/ui/button";
import { Lock, Music, TrendingUp, Users } from "lucide-react";

export default function Feature() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-24 border-t border-white/20">
        <div className="space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <span className="text-white/79 text-sm py-2 px-4  font-semibold uppercase tracking-widest border border-[0.5] shadow-inner shadow-gray-400 rounded-3xl">
              Our Features
            </span>
            <h2 className="text-4xl md:text-5xl mt-7 font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              Powerful Voting Features
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Experience the next generation of collaborative music selection
              with real-time voting, seamless streaming integration, and
              community-driven curation.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1: Real-Time Voting */}
            <div className="group bg-primary border border-white/20 rounded-2xl p-8 hover:border-white/25 hover:bg-white/2 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center border border-white/20  justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white/30" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Real-Time Voting
                  </h3>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Watch votes count up instantly. See which tracks are gaining
                momentum as your community votes in real-time across your voting
                room.
              </p>
              <div className="h-24 bg-white/5 rounded-lg border border-slate-700/50"></div>
            </div>

            {/* Feature 2: Community Control */}
            <div className="group bg-primary border border-white/20 rounded-2xl p-8 hover:border-white/25 hover:bg-white/2 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center border border-white/20 backdrop-filter-[20] justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white/30" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Community Control
                  </h3>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Empower your listeners to shape the soundtrack. Create
                democratic voting rooms where every vote counts equally and
                voices are heard.
              </p>
              <div className="h-24 bg-white/5 rounded-lg border border-slate-700/50"></div>
            </div>

            {/* Feature 3: Multi-Genre Support */}
            <div className="group bg-primary border border-white/20 rounded-2xl p-8 hover:border-white/25 hover:bg-white/2 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center border border-white/20 backdrop-filter-[20] justify-center flex-shrink-0">
                  <Music className="w-6 h-6 text-white/30" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Multi-Genre Support
                  </h3>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Rock to Jazz, Hip-Hop to Classical. Vote across unlimited genres
                and discover new music that matches your community's mood and
                preferences.
              </p>
              <div className="h-24 bg-white/5 rounded-lg border border-slate-700/50"></div>
            </div>

            {/* Feature 4: Secure Voting */}
            <div className="group bg-primary border border-white/20 rounded-2xl p-8 hover:border-white/25 hover:bg-white/2 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20 backdrop-filter-[20] ">
                  <Lock className="w-6 h-6 text-white/30" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Secure & Fair
                  </h3>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Advanced security ensures fair voting with fraud detection. Each
                vote is counted accurately and your community's choices are
                protected from manipulation.
              </p>
              <div className="h-24 bg-white/5 rounded-lg border border-slate-700/50"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
