"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const createRoom = () => {
    if (!name) return alert("Enter your name");

    const roomId = Math.random().toString(36).substring(2, 8);
    router.push(`/room/${roomId}?name=${name}`);
  };

  const joinRoom = () => {
    if (!name || !roomCode) return alert("Enter all fields");

    router.push(`/room/${roomCode}?name=${name}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] text-white">
      <div className="bg-[#121826] p-8 rounded-2xl shadow-lg w-[350px] text-center">

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-full flex items-center justify-center">
          ▶
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">Watch Party</h1>
        <p className="text-gray-400 mb-6">
          Sync and watch YouTube videos together
        </p>

        {/* Name input */}
        <input
          type="text"
          placeholder="Display Name"
          className="w-full p-3 mb-4 rounded-lg bg-[#1c2233] border border-gray-600 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Create room */}
        <button
          onClick={createRoom}
          className="w-full py-3 mb-4 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
        >
          Create New Room
        </button>

        <div className="text-gray-500 text-sm mb-4">OR JOIN EXISTING</div>

        {/* Join section */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Room Code"
            className="flex-1 p-3 rounded-lg bg-[#1c2233] border border-gray-600 outline-none"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <button
            onClick={joinRoom}
            className="px-4 rounded-lg border border-gray-500 hover:bg-gray-700"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}