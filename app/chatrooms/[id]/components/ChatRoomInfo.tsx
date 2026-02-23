"use client";

import { useEffect, useState } from "react";
import styles from "./ChatRoomInfo.module.css";

interface ChatRoomInfoProps {
  roomId: string;
}

interface ChatRoomInfoData {
  chatRoomName: string;
  currentJoinNum: number;
  cityName: string;
}

export default function ChatRoomInfo({ roomId }: ChatRoomInfoProps) {
  const [roomInfo, setRoomInfo] = useState<ChatRoomInfoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const res = await fetch(`/api/chat/rooms?roomId=${roomId}`);
        if (!res.ok) throw new Error("채팅방 정보를 불러오지 못했습니다.");
        const data = await res.json();
        setRoomInfo(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("알 수 없는 오류가 발생했습니다.");
        }
      }
    };

    fetchRoomInfo();
  }, [roomId]);

  if (error) return <div></div>;
  if (!roomInfo) return <div>Loading...</div>;

  return (
    <div className={styles.city}>
      <div className={styles.cityName}>{roomInfo?.chatRoomName}</div>
      <div className={styles.people}>
        {roomInfo?.currentJoinNum} people participating
      </div>
    </div>
  );
}

