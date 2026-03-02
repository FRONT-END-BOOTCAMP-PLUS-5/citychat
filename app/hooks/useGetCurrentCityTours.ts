import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { ApiResponse } from "@/app/types/ApiResponse";
import { TourListItem } from "@/backend/domain/entities/TourListItem";
import { TourTab } from "@/app/constants/tourTabs";

const getCityTours = async (
  offset: number = 0,
  limit: number = 10,
  cityId: string,
  tab: TourTab,
  sigunguCode?: string
): Promise<ApiResponse<TourListItem>> => {
  const params = new URLSearchParams({
    page: ((offset / limit) + 1).toString(),
    limit: limit.toString(),
    tab,
  });


  if (sigunguCode) {
    params.append("sigunguCode", sigunguCode);
  }

  const response = await fetch(`/api/cities/${cityId}/tours?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch tours: ${response.status}`);
  }

  return response.json();
};

export const useGetCurrentCityTours = (
  cityId: string,
  tab: TourTab,
  sigunguCode?: string,
  limit: number = 10
): UseInfiniteQueryResult<
  ApiResponse<TourListItem>,
  Error
> => {
  return useInfiniteQuery({
    queryKey: ["tour-list", { cityId, tab, sigunguCode, limit }],
    queryFn: ({ pageParam = 0 }) =>
      getCityTours(pageParam, limit, cityId, tab, sigunguCode),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length * limit;  // offset 계산
    },
    initialPageParam: 0,
    select: (result) => ({
      items: result.pages.flatMap((page) => page.items),
      total: result.pages[0]?.total || 0,
      hasMore: result.pages[result.pages.length - 1]?.hasMore || false,
    }),
  });
};
