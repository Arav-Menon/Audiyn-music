"use client";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const navContent = [
    { name: "Features", href: "/" },
    { name: "How It Works", href: "/how-to-work" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/" },
  ];

  const authButtons = [
    { name: "Create Account", href: "/login", icon: <User /> },
  ];
  return (
    <>
      <section>
        <div className="flex justify-between px-8 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <img src="./audiyn.png" height={55} width={55} alt="audiyn" />
            <h3 className="text-2xl text-[#fff] ">Audiyn</h3>
          </div>

          <div id="nav_content" className="flex items-center">
            <div className="flex gap-4">
              {navContent.map((link, index) => {
                return (
                  <Link key={index} href={link.href} className="text-gray-300">
                    {link.name}{" "}
                  </Link>
                );
              })}
            </div>
          </div>

          <div id="authentication_button" className="flex items-center">
            <div className="flex gap-4">
              {authButtons.map((link, index) => {
                return (
                  <Button
                    key={index}
                    variant={"destructive"}
                    className="border border-gray-200"
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
        </div>
      </section>
    </>
  );
}
