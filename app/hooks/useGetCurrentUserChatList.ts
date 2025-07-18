import { useInfiniteQuery, UseInfiniteQueryResult } from "@tanstack/react-query";
import { Chat } from "@/backend/domain/entities/Chat";

interface ChatListResponse {
  chats: Chat[];
  total: number;
  hasMore: boolean;
}

const getCurrentUserChatList = async (offset: number = 0, limit: number = 10): Promise<ChatListResponse> => {
  const response = await fetch(`/api/chat?offset=${offset}&limit=${limit}`);
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch chats");
  }
  
  const result = await response.json();
  return result.data;
};

export const useGetCurrentUserChatList = (limit: number = 10): UseInfiniteQueryResult<ChatListResponse, Error> => {
  return useInfiniteQuery({
    queryKey: ["current-user-chats"],
    queryFn: ({ pageParam = 0 }) => getCurrentUserChatList(pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      // allPages : 이전 페이지
      if (!lastPage.hasMore) return undefined;
      // 다음 페이지의 offset 계산 및 리턴
      return allPages.length * limit;
    },
    initialPageParam: 0,
    select: (result) => ({
      chats: result.pages.flatMap(page => page.chats),
      total: result.pages[0]?.total || 0,
      hasMore: result.pages[result.pages.length - 1]?.hasMore || false,
    }),
  });
};
