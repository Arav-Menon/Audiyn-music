'use client'

import { DoorOpen } from "lucide-react";
import { Button } from "../ui/button";

export default function OpenAudyinButton({ onClick }: { onClick: () => void }) {
  return (
    <Button className="bg-white/5 hover:shadow-lg text-white gap-2 transition-all duration-200 hover:bg-white/15 hidden sm:flex">
      <DoorOpen className="w-4 h-4" />
      <span className="md:inline" onClick={onClick}>
        Join the vibe
      </span>
    </Button>
  );
}
