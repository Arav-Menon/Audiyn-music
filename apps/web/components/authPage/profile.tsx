'use client'

import { useState } from 'react'
import { Music, Heart, Share2, Settings, Activity, Edit3, ChevronRight, X } from 'lucide-react'

export default function ProfilePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: 'Luna Echo',
    handle: '@luna.echo',
    bio: 'Passionate about discovering the perfect beat. Voting to shape tomorrow\'s soundtrack.',
  })
  const [editFormData, setEditFormData] = useState(formData)

  const stats = [
    { label: 'Followers', value: '2.4K', color: 'from-cyan-500 to-blue-500' },
    { label: 'Votes Cast', value: '1.2K', color: 'from-purple-500 to-pink-500' },
    { label: 'Following', value: '342', color: 'from-green-400 to-cyan-400' },
  ]

  const recentVotes = [
    {
      id: 1,
      track: 'Midnight Dreams',
      artist: 'Aurora Waves',
      image: '/album-art-neon-purple.jpg',
      votes: 342,
    },
    {
      id: 2,
      track: 'Electric Pulse',
      artist: 'Synth Wave',
      image: '/album-art-neon-blue.jpg',
      votes: 289,
    },
    {
      id: 3,
      track: 'Neon Lights',
      artist: 'Digital Dreams',
      image: '/album-art-neon-cyan.jpg',
      votes: 512,
    },
    {
      id: 4,
      track: 'Cosmic Echo',
      artist: 'Space Sound',
      image: '/album-art-dark-space.jpg',
      votes: 198,
    },
  ]

  const handleEditOpen = () => {
    setEditFormData(formData)
    setIsEditOpen(true)
  }

  const handleEditSave = () => {
    setFormData(editFormData)
    setIsEditOpen(false)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0F] via-[#1A1A1E] to-[#0D0D0F] text-white overflow-hidden">
      {/* Animated background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header Navigation */}
        <nav className="backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">Audiyn</span>
            </div>
            <div className="flex items-center gap-6">
              <button className="text-sm text-gray-400 hover:text-white transition-colors">Home</button>
              <button className="text-sm text-gray-400 hover:text-white transition-colors">Discover</button>
              <button className="text-sm font-semibold text-white">Profile</button>
            </div>
          </div>
        </nav>

        {/* Profile Hero Section */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Background blur element behind avatar */}
          <div className="relative mb-12">
            <div className="absolute -inset-32 bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-transparent blur-3xl rounded-full"></div>

            {/* Profile Card */}
            <div className="relative backdrop-blur-xl bg-white/8 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar with glow */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <img
                    src="/artist-profile-avatar.jpg"
                    alt="Profile"
                    className="relative w-40 h-40 rounded-2xl object-cover border-2 border-white/20"
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                    {formData.name}
                  </h1>
                  <p className="text-gray-400 text-lg mb-6">{formData.handle} • Music Curator & Audiyn Member</p>

                  <p className="text-gray-300 text-base mb-8 max-w-2xl leading-relaxed">
                    {formData.bio}
                  </p>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={handleEditOpen}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button className="px-6 py-3 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold text-sm border border-white/20 transition-all duration-300 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Activity
                    </button>
                    <button className="px-6 py-3 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold text-sm border border-white/20 transition-all duration-300 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group backdrop-blur-xl bg-white/8 border border-white/20 rounded-2xl p-6 hover:bg-white/12 transition-all duration-500 cursor-pointer transform hover:scale-105"
                onMouseEnter={() => setHoveredCard(stat.label)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500 blur-lg`}
                ></div>
                <div className="relative">
                  <p className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Votes Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full"></div>
              Recent Votes
            </h2>

            <div className="space-y-4">
              {recentVotes.map((vote, index) => (
                <div
                  key={vote.id}
                  className="group backdrop-blur-xl bg-white/8 border border-white/20 rounded-2xl p-5 hover:bg-white/12 hover:border-cyan-500/30 transition-all duration-300 transform hover:translate-x-2 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Album Art */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl blur-md opacity-30 group-hover:opacity-60 transition-opacity"></div>
                      <img
                        src={vote.image || "/placeholder.svg"}
                        alt={vote.track}
                        className="relative w-16 h-16 rounded-xl object-cover border border-white/20"
                      />
                    </div>

                    {/* Track Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{vote.track}</h3>
                      <p className="text-sm text-gray-400">{vote.artist}</p>
                    </div>

                    {/* Vote Count */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-cyan-400">{vote.votes}</p>
                        <p className="text-xs text-gray-500">votes</p>
                      </div>
                      <Heart className="w-5 h-5 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <button className="w-full mt-6 py-4 backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white font-semibold transition-all duration-300 hover:border-cyan-500/50">
              View All Votes
            </button>
          </div>

          {/* Bottom CTA Section */}
          <div className="backdrop-blur-xl bg-gradient-to-r from-white/8 to-white/5 border border-white/20 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to vote?</h3>
            <p className="text-gray-400 mb-6">Join thousands of music lovers shaping the perfect playlist</p>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Discover Tracks
            </button>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsEditOpen(false)}
          ></div>

          {/* Modal */}
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 border border-white/30 rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>

            {/* Modal Content */}
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                Edit Profile
              </h2>
              <p className="text-gray-400 mb-8">Update your profile information</p>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/15 transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Handle Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Handle</label>
                  <input
                    type="text"
                    name="handle"
                    value={editFormData.handle}
                    onChange={handleEditChange}
                    className="w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/15 transition-all duration-300"
                    placeholder="@yourhandle"
                  />
                </div>

                {/* Bio Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Bio</label>
                  <textarea
                    name="bio"
                    value={editFormData.bio}
                    onChange={handleEditChange}
                    rows={4}
                    className="w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/15 transition-all duration-300 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-gray-500 mt-2">{editFormData.bio.length}/200</p>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1 px-6 py-3 backdrop-blur-md bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold border border-white/20 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSave}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.3); }
          50% { box-shadow: 0 0 40px rgba(34, 211, 238, 0.6); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        @keyframes in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-in {
          animation: in 0.3s ease-out;
        }

        .fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .zoom-in-95 {
          animation: zoom-in 0.3s ease-out;
        }

        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .duration-300 {
          animation-duration: 0.3s;
        }
      `}</style>
    </div>
  )
}
