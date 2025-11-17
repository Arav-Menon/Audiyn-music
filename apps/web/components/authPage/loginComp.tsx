"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { signin } from "@/utils/user_auth_api/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onHandlerClick = async () => {
    const token = await signin(email, password);
    console.log(token);

    localStorage.setItem("token", token);

    Cookies.set("token", token, {
      expires: 7,
      path: "/",
    });

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_70%)] flex items-center justify-center">
        {/* Animated background blur effect */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/30 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/30 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-8 animate-fade-in">
          <div className="mb-8">
            <div className="bg-white/5 w-28 h-28 flex justify-center items-center rounded-xl mx-auto mb-2">
              <Link href={"/"}>
                <img src="./audiyn.png" className="h-24 w-24" alt="" />
              </Link>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 font-sans">
            Join Audiyn
          </h2>
          <p className="text-gray-400 text-lg max-w-sm mx-auto">
            Be part of a community where music lovers vote together and decide
            what plays next.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full bg-[#1c1c1c] lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-in">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-3 font-sans">
              Welcom back
            </h2>
            <p className="text-gray-500 text-sm">
              Join thousands voting for the perfect beat
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Username Input */}

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d3d3d3]" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border border-white/10 text-white placeholder-gray-600 pl-10 pr-4 py-3 focus:outline-none focus:border-white/20 rounded-lg transition-colors"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d3d3d3]" />
              <input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border border-white/10 text-white placeholder-gray-600 pl-10 pr-4 py-3 focus:outline-none focus:border-white/20 rounded-lg transition-colors"
              />
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 accent-white bg-white/5"
              />
              <span className="text-gray-500 text-sm">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              onClick={onHandlerClick}
              className="w-full border border-white/15 text-white py-3 bg-white/5 font-semibold hover:bg-white/90 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider mt-8"
            >
              {isLoading ? "Creating Account..." : "LOG IN"}
            </Button>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#d3d3d3] hover:font-bold transition-colors underline "
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.8s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
