import { GetTourDetailResponseDto } from "@/backend/application/tours/dtos/GetTourDetailResponseDto";
import { TourListItem } from "@/backend/domain/entities/TourListItem";
import { useQueryClient } from "@tanstack/react-query";

const getTourDetail = async (
  contentId: string,
  contentTypeId: number | undefined
): Promise<GetTourDetailResponseDto["detail"] | null> => {
  const params = new URLSearchParams();
  if (contentTypeId !== undefined) {
    params.append("contentTypeId", String(contentTypeId));
  }

  const url = `/api/tours/${contentId}${params.toString() ? `?${params}` : ""}`;
  const response = await fetch(url);
  
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const json = await response.json();
  return json.detail;
};

export const useGetTourDetail = () => {
  const queryClient = useQueryClient();

  const prefetchTourDetail = async (item: TourListItem) => {
    await queryClient.prefetchQuery({
      queryKey: ["tour-detail", item.contentid, item.contentTypeId],
      queryFn: () => getTourDetail(item.contentid, item.contentTypeId),
      staleTime: 5 * 60 * 1000,
    });
  };

  const getTourDetailWithCache = async (
    item: TourListItem
  ): Promise<GetTourDetailResponseDto["detail"] | null> => {
    // 1. 캐시 확인
    const cachedData = queryClient.getQueryData<GetTourDetailResponseDto["detail"] | null>([
      "tour-detail",
      item.contentid,
      item.contentTypeId,
    ]);

    if (cachedData) {
      return cachedData;
    }

    // 2. 캐시 없으면 fetch
    return await getTourDetail(item.contentid, item.contentTypeId);
  };

  return { prefetchTourDetail, getTourDetailWithCache };
};
