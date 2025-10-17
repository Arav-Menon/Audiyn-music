"use client";
import { Mail, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function CommingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-gray-900 via-black to-black opacity-50 blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-gray-800 via-black to-black opacity-30 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Floating particles */}
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-float"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white/25 rounded-full animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/4 w-1 h-1 bg-white/20 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-2/3 w-2 h-2 bg-white/15 rounded-full animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] animate-grid"></div>

      {/* Spotlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_70%)] animate-spotlight"></div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 mb-4 sm:px-6 lg:px-8">
        
        <div
          className={`mb-8 relative group transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
        >
          <div className="absolute inset-0 bg-white blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 animate-pulse-slow"></div>
          <div className="relative">
            <img
              src="./logo.png"
              alt="Audiyn Logo"
              className="w-36 h-32 border-gray-300 rounded-xl sm:w-40 sm:h-40 mb-10 object-contain animate-icon-pulse group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>
        {/* Logo */}

        <div className="mb-2 text-black">sdfdsfdsfdf</div>

        {/* Brand name */}
        <h1
          className={`text-6xl sm:text-7xl md:text-8xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 animate-title transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          Audiyn
        </h1>

        <div className="mb-2 text-black">sdfdsfdsfdf</div>

        {/* Tagline */}
        <div className="mt-10 flex">
          <p
            className={`text-xl sm:text-2xl text-gray-400 mb-12 text-center max-w-2xl leading-relaxed transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            Something extraordinary is being crafted.
            <span className="block mt-2 text-gray-500 animate-fade-in-up">
              Stay tuned for the experience.
            </span>
          </p>
        </div>

        <div className="mb-[0.75em] text-black">sdfdsfdsfdf</div>

        {/* Status indicator */}
        <div
          className={`flex items-center gap-3 text-gray-500 text-sm transition-all duration-1000 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="relative mt-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <span className="animate-pulse-text">In active development</span>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Audiyn. Building the future of audio.
          </p>
        </div>
      </div>
    </div>
  );
}
