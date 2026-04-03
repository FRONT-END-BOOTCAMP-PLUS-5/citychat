import { TourListItem } from "@/backend/domain/entities/TourListItem";
import { TourDetail } from "@/backend/domain/entities/TourDetail";

export interface TourRepository {
  getFilteredList(params: {
    areaCode: string;
    sigunguCode?: string;
    contentTypeId?: number;
    pageNo: number;
    numOfRows?: number;
  }): Promise<{
    totalCount: number;
    items: TourListItem[];
  }>;
  getByContentId(params: {
    contentId: string;
    contentTypeId?: number;
  }): Promise<TourDetail>;
}
