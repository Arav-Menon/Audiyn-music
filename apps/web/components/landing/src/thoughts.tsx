"use client"
import { Music } from "lucide-react";

export default function Thoughts() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-primary px-4 py-20">
      <div className="max-w-4xl w-full border-2 border-white/10 rounded-3xl px-12 py-20 md:px-16 md:py-28 bg-white/5 ">
        <div className="flex flex-col items-center gap-8 md:gap-12">
          <div className="text-gray-500 opacity-70">
            <Music size={48} />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight text-white/80 text-4xl md:text-5xl mt-7 font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
            Music Feels Better When{" "}
              Everyone Has a Say
          </h1>

          <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl leading-relaxed">
            No more arguments about what plays next. No more one person
            controlling the vibe. Audjyn brings democratic music listening to
            your friend groups, parties, and communities.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-20 w-full pt-8 md:pt-12 border-t border-white/20">
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl md:text-4xl font-bold text-white/80">
                10K+
              </div>
              <div className="text-sm md:text-base text-gray-500">
                Active Users
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl md:text-4xl font-bold text-white/80">
                50K+
              </div>
              <div className="text-sm md:text-base text-gray-500">
                Songs Voted
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl md:text-4xl font-bold text-white/80">
                100%
              </div>
              <div className="text-sm md:text-base text-gray-500">
                Democratic
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
