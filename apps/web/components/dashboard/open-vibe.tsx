"use client";
import RoomModal from "@/components/dashboard/CreateRoomModel";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import JoinRoomModal from "./joinRoomModel";

export default function JoinTheVibe() {
  const router = useRouter();

  return (
    <>
      <div onClick={() => router.push("/dashboard")} className="cursor-pointer">
        <ArrowLeft
          className="text-white relative top-8 left-8"
          // onClick={() => router.push("/dashboard")}
        />
      </div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_70%)] flex items-center justify-center">
        <JoinRoomModal />
      </div>
    </>
  );
}
