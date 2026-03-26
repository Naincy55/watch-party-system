"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [room, setRoom] = useState("");
  const router = useRouter();

  const joinRoom = () => {
    router.push(`/room/${room}`);
  };

  return (
    <div style={{ padding: 50 }}>
      <h1>Watch Together</h1>

      <input
        placeholder="Enter Room ID"
        onChange={(e) => setRoom(e.target.value)}
      />

      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
}