"use client";
import { createRoom } from "@/utils/join_room_api/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Errors {
  name: string;
  code: string;
  password: string;
}

export default function CreateRoomModal() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({ name: "", code: "", password: "" });
  const router = useRouter();

  const validate = (): boolean => {
    const newErrors: Errors = { name: "", code: "", password: "" };

    if (name.length < 3 || name.length > 15) {
      newErrors.name = "Room name must be 3–15 characters";
    }

    if (code.length < 5 || code.length > 100) {
      newErrors.code = "Room code must be 5–100 characters";
    }

    if (isPrivate && password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.code && !newErrors.password;
  };

  const onHandleClick = async () => {
    if (!validate()) return;

    const response = await createRoom(name, code, isPrivate, password);

    if (!response) {
      console.log("something went wrong");
      return;
    }

    return router.push(`/r/${response}`);
  };

  const isValid = name.length >= 3 && name.length <= 15 && code.length >= 5 && code.length <= 100 && (!isPrivate || password.length >= 4);

  return (
    <div className="w-[500px] rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl text-white">
      {/* Header */}
      <h1 className="text-2xl font-semi-bold text-white/70 mb-6">
        Audiyn / create room
      </h1>

      {/* CREATE ROOM UI */}
      <div className="space-y-5">
        {/* Room Name */}
        <div>
          <label className="text-sm opacity-70">Room Name</label>
          <input
            placeholder="Enter a unique name"
            className="w-full mt-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-white/20"
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) validate();
            }}
          />
          {errors.name && <p className="text-xs text-red-400/80 mt-1">{errors.name}</p>}
        </div>

        {/* Room Code */}
        <div>
          <label className="text-sm opacity-70">Room Code</label>
          <input
            placeholder="Enter a custom code (min 5 characters)"
            className="w-full mt-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-white/20"
            onChange={(e) => {
              setCode(e.target.value);
              if (errors.code) validate();
            }}
          />
          {errors.code && <p className="text-xs text-red-400/80 mt-1">{errors.code}</p>}
        </div>

        {/* Private Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-70">Make Private</span>
          <button
            onClick={() => {
              setIsPrivate(!isPrivate);
            }}
            className={`w-10 h-5 flex items-center rounded-full transition ${
              isPrivate ? "bg-white/20" : "bg-white/10"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transform transition ${
                isPrivate ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Password only if private */}
        {isPrivate && (
          <div>
            <label className="text-sm opacity-70">Password</label>
            <input
              placeholder="Enter room password (min 4 characters)"
              className="w-full mt-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-white/20"
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) validate();
              }}
            />
            {errors.password && <p className="text-xs text-red-400/80 mt-1">{errors.password}</p>}
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <button
        className={`w-full mt-8 transition rounded-xl py-3 text-sm ${
          isValid
            ? "bg-white/20 hover:bg-white/30 cursor-pointer"
            : "bg-white/5 text-white/30 cursor-not-allowed"
        }`}
        onClick={onHandleClick}
        disabled={!isValid}
      >
        Tune In
      </button>
    </div>
  );
}
