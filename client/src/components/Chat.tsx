"use client";
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [socketId, setSocketId] = useState("");

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setSocketId(socketId ?? ""); // 내 ID 저장
      socket.emit("joinRoom", "room1");
    });

    const handleReceive = (data: any) => {
      if (data.sender === socket.id) return;
      setChatLog((prev) => [...prev, `${data.sender}: ${data.content}`]);
    };

    socket.off("receiveMessage"); // 중복 방지
    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive); // 클린업
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    // 내가 보낸 메시지는 직접 화면에 추가
    setChatLog((prev) => [...prev, `나: ${message}`]);

    socket.emit("sendMessage", {
      roomId: "room1",
      content: message,
    });

    setMessage("");
  };

  return (
    <div>
      <h2>💬 Chat Room</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "200px",
          overflowY: "scroll",
        }}
      >
        {chatLog.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
