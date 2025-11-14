import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_70%)]">
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-10"></div>

      <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3">
        <img src="./audiyn.png" className="h-18 w-18" alt="" />
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white/70 tracking-wider">
          Audiyn
        </span>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mt-8 sm:mt-0">
        <div className="relative mb-6 sm:mb-8">
          <h1 className="text-[120px] sm:text-[180px] md:text-[240px] lg:text-[280px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 glitch-text">
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-scan"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  top: `${20 + i * 10}%`,
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="glass-panel px-4 sm:px-6 md:px-8 py-4 sm:py-6 mb-6 sm:mb-8 max-w-2xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white/70 mb-2 sm:mb-3">
            You drifted out of the beat.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/70 font-light tracking-wide">
            This page doesn't exist.
          </p>
        </div>

        <button className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl font-semibold text-white/70 bg-white/10 border border-white/20 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:border-white/40 overflow-hidden">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          <div className="relative flex items-center gap-2 sm:gap-3">
            <Home className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Return to Home</span>
          </div>
        </button>

        <div className="mt-12 sm:mt-16 flex justify-center gap-2 sm:gap-4 opacity-40">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-white/40 to-transparent rounded-full animate-waveform"
              style={{
                height: `${20 + Math.random() * 60}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }

        @keyframes scan {
          0% { opacity: 0; transform: translateY(-100%); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(100%); }
        }

        @keyframes waveform {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.5); }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }

        .animate-waveform {
          animation: waveform 1s ease-in-out infinite;
        }

        .glass-panel {
          box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .glitch-text {
          animation: glitch 3s infinite;
        }

        @keyframes glitch {
          0%, 90%, 100% { transform: translate(0); }
          91% { transform: translate(-2px, 2px); }
          92% { transform: translate(2px, -2px); }
          93% { transform: translate(-2px, -2px); }
          94% { transform: translate(2px, 2px); }
          95% { transform: translate(0); }
        }
      `}</style>
    </div>
  );
}
