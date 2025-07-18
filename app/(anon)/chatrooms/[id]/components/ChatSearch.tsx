import { useState } from "react";
import styles from "./ChatSearch.module.css";
import { useParams } from "next/navigation";

type Chat = {
  id: number;
  content: string;
  sent_at: string;
};

export default function ChatSearch({
  onSearchResults,
}: {
  onSearchResults: (ids: number[]) => void;
}) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const roomId = useParams()?.id; // Next.js에서 [id]를 라우트 param으로 받는 경우

  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/chat/search?keyword=${keyword}&roomId=${roomId}`
      );
      const data = await res.json();
      setResults(data);
      onSearchResults(data.map((chat: Chat) => chat.id));
    } catch (err) {
      console.error("검색 오류:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어 입력"
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.button}>
          검색
        </button>
      </div>

      {loading ? (
        <p>검색 중...</p>
      ) : results.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        <ul className={styles.results}>
          {results.map((chat) => (
            <li key={chat.id} className={styles.resultItem}>
              <p className={styles.resultDate}>{chat.sent_at}</p>
              <p>{chat.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

