"use client";
import { Button } from "@/components/ui/button";
import { User, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navContent = [
    { name: "Features", href: "/" },
    { name: "How It Works", href: "/how-to-work" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/" },
  ];

  const authButtons = [
    { name: "Create Account", href: "/login", icon: <User /> },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <section>
      <div className="flex justify-between items-center px-4 md:px-8 py-4 backdrop-blur-xl relative">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="./audiyn.png" height={55} width={55} alt="audiyn" />
          <h3 className="text-2xl text-[#fff]">Audiyn</h3>
        </div>

        {/* Desktop Navigation */}
        <div id="nav_content" className="hidden md:flex items-center">
          <div className="flex gap-4">
            {navContent.map((link, index) => {
              return (
                <Link key={index} href={link.href} className="text-gray-300 hover:text-white transition-colors">
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Auth Button */}
        <div id="authentication_button" className="hidden md:flex items-center">
          <div className="flex gap-4">
            {authButtons.map((link, index) => {
              return (
                <Button
                  key={index}
                  variant={"destructive"}
                  className="border border-gray-200 hover:cursor-pointer hover:scale-105"
                  size={"lg"}
                  onClick={() => router.push(link.href)}
                >
                  {link.icon}
                  {link.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white z-50"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-[87px] bg-primary backdrop-blur-xl z-40 px-4 py-6 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-4">
            {navContent.map((link, index) => {
              return (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-300 text-lg hover:text-white transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Button */}
          <div className="pt-4 border-t border-gray-700">
            {authButtons.map((link, index) => {
              return (
                <Button
                  key={index}
                  variant={"destructive"}
                  className="w-full border border-gray-200 hover:cursor-pointer hover:scale-105"
                  size={"lg"}
                  onClick={() => {
                    router.push(link.href);
                    setIsMenuOpen(false);
                  }}
                >
                  {link.icon}
                  {link.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}