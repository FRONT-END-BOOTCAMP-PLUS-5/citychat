import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { GetChatListResponseDto } from "@/backend/application/chats/dtos/GetChatListResponseDto";
import { ApiResponse } from "../types/ApiResponse";

const getCurrentUserChatList = async (
  offset: number = 0,
  limit: number = 10,
  chatRoomId?: number
): Promise<ApiResponse<GetChatListResponseDto>> => {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });
  
  if (chatRoomId) {
    params.append("chatRoomId", chatRoomId.toString());
  }
  
  const response = await fetch(`/api/user/chats?${params}`);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch chats");
  }

  const result = await response.json();
  return result.data;
};

export const useGetCurrentUserChats = (
  limit: number = 10,
  chatRoomId?: number
): UseInfiniteQueryResult<ApiResponse<GetChatListResponseDto>, Error> => {
  return useInfiniteQuery({
    queryKey: ["current-user-chats", { limit, chatRoomId }],
    queryFn: ({ pageParam = 0 }) => getCurrentUserChatList(pageParam, limit, chatRoomId),
    getNextPageParam: (lastPage, allPages) => {
      // allPages : 이전 페이지
      if (!lastPage.hasMore) return undefined;
      // 다음 페이지의 offset 계산 및 리턴
      return allPages.length * limit;
    },
    initialPageParam: 0,
    select: (result) => ({
      items: result.pages.flatMap((page) => page.items),
      total: result.pages[0]?.total || 0,
      hasMore: result.pages[result.pages.length - 1]?.hasMore || false,
    }),
  });
};

