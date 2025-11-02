"use client";

import { Twitter, Send, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1c1c1c] text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
        {/* Logo + Subscribe */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className="text-2xl font-semibold text-white">Audiyn.</h2>
          <p className="text-sm mt-3 text-gray-400">
            Stay in sync with Audiyn updates — new releases, playlists, and the
            latest music trends.
          </p>

          <div className="mt-5 flex items-center bg-[#121212] rounded-xl overflow-hidden border border-gray-700 h-12">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent px-4 h-full text-sm outline-none text-gray-200 placeholder:text-gray-500"
            />
            <button className="bg-white/80 text-black px-4 sm:px-6 h-full text-sm font-medium hover:from-pink-600 hover:to-orange-600 transition-all whitespace-nowrap flex items-center justify-center">
              Notify
            </button>
          </div>
        </div>

        {/* Sections */}
        <div>
          <h3 className="text-white font-medium mb-4">Explore</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">Discover Songs</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Top Voted Tracks</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Create a Room</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Share Playlists</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-medium mb-4">Community</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">Join Discord</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Feedback & Ideas</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Contributors</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Open Source</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-medium mb-4">Resources</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">API Reference</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 mt-8 py-6 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-4">
        <p className="text-center sm:text-left">© {new Date().getFullYear()} Audiyn. All rights reserved.</p>

        <div className="flex space-x-5">
          <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
            <Twitter size={20} />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Telegram">
            <Send size={20} />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
            <Facebook size={20} />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}