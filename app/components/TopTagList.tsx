"use client";

import { useEffect, useState } from "react";
import styles from "./TopTagList.module.css"; // ✅ CSS 모듈 가져오기

interface TopTag {
  tag: string;
}

interface Props {
  roomId: number;
  onSearchResults?: (ids: number[]) => void;
}

export default function TopTagList({ roomId, onSearchResults }: Props) {
  const [tags, setTags] = useState<TopTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch(`/api/chat/top-tags?roomId=${roomId}`);
        const data = await res.json();
        setTags(data);
      } catch (err) {
        console.error("🔥 태그 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTags();
  }, [roomId]);

  // 태그 선택 시 ChatSearch로 검색
  const handleTagClick = async (tag: string) => {
    // 다시 선택하면 취소
    if (selectedTag === tag) {
      setSelectedTag(null);
      onSearchResults?.([]);
      return;
    }
    const encoded = encodeURIComponent(`#${tag}`);
    try {
      const res = await fetch(
        `/api/chat/search?keyword=${encoded}&roomId=${roomId}`
      );
      const ids = await res.json();
      const idArray = (ids as { id: number }[]).map((item) => item.id);
      setSelectedTag(tag);
      onSearchResults?.(idArray);
    } catch (err) {
      console.error("🔥 태그 검색 실패:", err);
    }
  };

  if (loading) return <p>불러오는 중...</p>;
  if (tags.length === 0) return <p>인기 태그가 아직 없어요 😢</p>;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>🔥 인기 태그</h3>
      <ul className={styles.tagList}>
        {tags.map((tagObj, i) => (
          <li
            key={i}
            onClick={() => handleTagClick(tagObj.tag)}
            className={`${styles.tagItem} ${
              selectedTag === tagObj.tag ? styles.selected : ""
            }`}
          >
            #{tagObj.tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

