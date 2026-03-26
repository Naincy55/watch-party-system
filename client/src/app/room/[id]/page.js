"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import socket from "@/utils/socket";

export default function RoomPage() {
  const { id } = useParams();
  const playerRef = useRef(null);
  const playerReady = useRef(false); // ✅ NEW

  // Load YouTube Iframe API
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("player", {
        height: "390",
        width: "640",
        videoId: "dQw4w9WgXcQ",
        events: {
          onReady: () => {
            playerReady.current = true; // ✅ Player ready
          },
          onStateChange: handleStateChange,
        },
      });
    };
  }, []);

  // Join room + socket listeners
  useEffect(() => {
    if (!id) return;

    socket.emit("join_room", id);

    socket.on("play", (time) => {
      if (!playerReady.current) return; // ✅ FIX

      playerRef.current.seekTo(time);
      playerRef.current.playVideo();
    });

    socket.on("pause", (time) => {
      if (!playerReady.current) return; // ✅ FIX

      playerRef.current.seekTo(time);
      playerRef.current.pauseVideo();
    });

    socket.on("sync_state", (state) => {
      if (!playerReady.current) return; // ✅ FIX

      playerRef.current.seekTo(state.videoTime);

      if (state.isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    });

    return () => {
      socket.off("play");
      socket.off("pause");
      socket.off("sync_state");
    };
  }, [id]);

  // Detect play/pause from user
  const handleStateChange = (event) => {
    if (!playerReady.current) return;

    const time = playerRef.current.getCurrentTime();

    if (event.data === 1) {
      socket.emit("play", { roomId: id, time });
    }

    if (event.data === 2) {
      socket.emit("pause", { roomId: id, time });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Room: {id}</h2>
      <div id="player"></div>
    </div>
  );
}