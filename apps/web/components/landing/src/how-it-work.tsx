"use client"

import { useEffect, useRef, useState } from "react"

export default function HowItWorksPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const element = containerRef.current
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const elementHeight = rect.height
      const windowHeight = window.innerHeight

      // Calculate scroll progress (0 to 1)
      const scrolled = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight)))
      setScrollProgress(scrolled)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const steps = [
    {
      number: 1,
      title: "Create a Room",
      description: "Start your session in seconds. Name it, customize it, make it yours.",
    },
    {
      number: 2,
      title: "Invite Friends",
      description: "Share your room link. The more, the merrier. The vibe grows with every vote.",
    },
    {
      number: 3,
      title: "Vote & Enjoy",
      description: "Let the music flow. Vote for favorites, discover new tracks, vibe together.",
    },
  ]

  const getStepGlowIntensity = (stepIndex: number) => {
    // Divide the scroll into 3 sections, one for each step
    const sectionSize = 1 / steps.length
    const stepStart = stepIndex * sectionSize
    const stepEnd = (stepIndex + 1) * sectionSize

    if (scrollProgress >= stepStart && scrollProgress <= stepEnd) {
      // Calculate glow intensity (0 to 1) within this step's section
      const localProgress = (scrollProgress - stepStart) / sectionSize
      return Math.min(1, localProgress * 2) // Peaks at 50% of section
    }
    return 0
  }

  return (
    <div className="min-h-screen bg text-white py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-4" ref={containerRef}>
        {/* Header */}
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
            How It Works
          </h1>
          <p className="text-lg md:text-xl text-slate-400">Three simple steps to musical democracy</p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line - Centered on mobile, offset on desktop */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 md:-translate-x-1/2">
            {/* Static background line */}
            <div className="absolute inset-0 bg-white/40"></div>

            {/* Animated gradient line that fills on scroll */}
            <div
              className="absolute inset-x-0 top-0 bg-white transition-all duration-300"
              style={{
                height: `${scrollProgress * 100}%`,
              }}
            ></div>
          </div>

          {/* Steps */}
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0
              const glowIntensity = getStepGlowIntensity(index)

              return (
                <div key={step.number} className="relative">
                  {/* Mobile Layout - All aligned to the right of the line */}
                  <div className="md:hidden flex gap-6 items-center">
                    {/* Animated Circle with Number */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-16 h-16 rounded-full bg-white/50 p-1">
                        <div className="w-full h-full rounded-full bg-[#1c1c1c] flex items-center justify-center">
                          <span className="text-white font-bold text-xl">{step.number}</span>
                        </div>
                      </div>

                      <div
                        className="absolute inset-0 rounded-full bg-white/50 blur-2xl -z-10 transition-opacity duration-300"
                        style={{
                          opacity: glowIntensity * 0.8,
                        }}
                      ></div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/20 hover:border-emerald-500/50 transition-all">
                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-slate-400 text-sm">{step.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout - Alternating left and right */}
                  <div className={`hidden md:flex gap-8 items-center ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                    {/* Content Card */}
                    <div className="flex-1">
                      <div
                        className={`p-8 rounded-2xl bg-white/5 border border-white/20 hover:white/30 transition-all ${
                          isLeft ? "text-right" : "text-left"
                        }`}
                      >
                        <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-slate-400">{step.description}</p>
                      </div>
                    </div>

                    {/* Animated Circle with Number */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-20 h-20 rounded-full bg-white/50 p-1">
                        <div className="w-full h-full rounded-full bg-[#1c1c1c] flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">{step.number}</span>
                        </div>
                      </div>

                      <div
                        className="absolute inset-0 rounded-full bg-white/50 blur-2xl -z-10 transition-opacity duration-300"
                        style={{
                          opacity: glowIntensity * 0.8,
                        }}
                      ></div>
                    </div>

                    {/* Empty space */}
                    <div className="flex-1"></div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom accent glow */}
          <div className="absolute left-8 md:left-1/2 bottom-0 md:-translate-x-1/2 w-1 h-20 to-transparent opacity-50"></div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-24 md:mt-32 space-y-6">
          <p className="text-lg md:text-xl text-slate-400">Ready to start your musical journey?</p>
          <button className="px-6 md:px-8 py-3 bg-white/80 hover:bg-white/90 cursor-pointer text-black font-bold rounded-lg transition-colors">
            Create Your First Room
          </button>
        </div>
      </div>
    </div>
  )
}