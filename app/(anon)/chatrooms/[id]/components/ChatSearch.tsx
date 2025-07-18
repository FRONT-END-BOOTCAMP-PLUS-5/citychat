import { useState } from "react";
import styles from "./ChatSearch.module.css";
import { useParams } from "next/navigation";
import { RotateCw } from "lucide-react";

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
  const roomId = useParams()?.id;
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Chat[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    try {
      const encodedKeyword = encodeURIComponent(keyword);
      const res = await fetch(
        `/api/chat/search?keyword=${encodedKeyword}&roomId=${roomId}`
      );
      const data = await res.json();
      setHasSearched(true);
      if (Array.isArray(data)) {
        setResults(data);
        onSearchResults(data.map((chat: Chat) => chat.id));
        if (data.length === 0) {
          setTimeout(() => {
            handleReset();
          }, 30 * 1000);
        }
      } else {
        console.warn("검색 결과 형식이 배열이 아닙니다:", data);
        setResults([]);
      }
    } catch (err) {
      console.error("검색 오류:", err);
      setResults([]);
    }
  };

  //초기화 함수
  const handleReset = () => {
    setKeyword("");
    setResults([]);
    setHasSearched(false);
    onSearchResults([]); // 하이라이트 초기화
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
        <button className={styles.reset} onClick={handleReset}>
          {" "}
          <RotateCw size={19} color="#669cf4ff" />
        </button>
      </div>

      {!hasSearched ? (
        <></>
      ) : results.length === 0 ? (
        <p className={styles.results}>검색 결과가 없습니다.</p>
      ) : (
        <p className={styles.results}>검색 결과 : {results.length}</p>
      )}
    </div>
  );
}

