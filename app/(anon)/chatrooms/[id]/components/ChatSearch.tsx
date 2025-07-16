import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Chat = {
  id: number;
  content: string;
  sent_at: string;
  user_id: string;
};

export default function ChatSearch() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .ilike("content", `%${keyword}%`);// 대소문자 구분 없는 검색

    if (error) {
      console.error("검색 오류:", error.message);
      setResults([]);
    } else {
      setResults(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">🔍 채팅 검색</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어 입력"
          className="border rounded p-2 w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          검색
        </button>
      </div>

      {loading ? (
        <p>검색 중...</p>
      ) : results.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {results.map((chat) => (
            <li key={chat.id} className="border p-2 rounded shadow">
              <p className="text-sm text-gray-600">{chat.sent_at}</p>
              <p>{chat.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
