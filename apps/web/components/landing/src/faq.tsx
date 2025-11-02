"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

export default function FaqSection() {
  return (
    <section className="relative w-full bg-primary text-gray-300 py-20">
      <div className="absolute inset-0 opacity-90" />

      <div className="relative max-w-6xl mx-auto px-6"> 
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-14">
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold text-white leading-snug">
              Have Questions? <br /> We’ve Got Your Answers.
            </h2>
          </div>

          <div className="mt-6 md:mt-0 max-w-md">
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Confused about how Audiyn works? Don’t worry — we’ve got you covered.
              Our FAQ section breaks down everything about music voting, rooms, and playlists.
            </p>
            <button className="bg-white/80 text-black font-medium px-6 py-3 rounded-full hover:opacity-90 transition">
              Read More
            </button>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="grid md:grid-cols-2 gap-10 border-t border-white/20 pt-10">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">What is Audiyn?</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Audiyn is a collaborative music experience that lets people in a group decide what plays next. 
              Users can search for songs, upvote their favorites, and see the community’s choice rise to the top. 
              Perfect for parties, cafés, or any place where music meets people.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">How do I start using Audiyn?</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Simply create or join a room, connect your Spotify or YouTube account, 
              and start adding songs to the shared queue. Everyone in the room can vote, 
              shaping the playlist together in real time — no arguments, just vibes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Can anyone vote on songs?</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Yes, every participant in a room can vote on any song that’s been added. 
              The more votes a track gets, the higher it climbs in the queue. 
              This keeps the experience democratic and fun for everyone.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Is Audiyn free to use?</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Audiyn is completely free. We plan to introduce premium features later 
              for creators and hosts — such as advanced room controls, analytics, and theme customizations.
            </p>
          </div>
        </div>

        {/* Pagination / Navigation */}
        <div className="flex justify-end space-x-4 mt-10">
          <button className="p-3 rounded-full border border-gray-700 hover:bg-white/5 transition">
            <ArrowLeft size={18} />
          </button>
          <button className="p-3 rounded-full border border-gray-700 hover:bg-white/5 transition">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
