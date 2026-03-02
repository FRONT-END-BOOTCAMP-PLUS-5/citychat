import { TourRepository } from "@/backend/domain/repositories/TourRepository";
import { TourListItem } from "@/backend/domain/entities/TourListItem";
import { VisitKoreaApiClient } from "@/backend/infrastructure/external-clients/VisitKoreaApiClient";
import { TourApiResponse, TourDetailRaw, TourItemType } from "@/backend/application/tours/types/ApiRawTypes";
import { TourDetail } from "@/backend/domain/entities/TourDetail";

const VK_ENDPOINTS = {
  PET_SERVICE: {
    AREA_BASED_LIST: "/B551011/KorPetTourService/areaBasedList",
    DETAIL_COMMON: "/B551011/KorPetTourService/detailCommon",
  },
  KOR_SERVICE: {
    AREA_BASED_LIST: "/B551011/KorService2/areaBasedList2",
    DETAIL_COMMON: "/B551011/KorService2/detailCommon2",
  },
} as const;

export class VkTourRepository implements TourRepository {
  constructor(private apiClient: VisitKoreaApiClient) {}
  
  async getFilteredList(params: {
    areaCode: string;
    sigunguCode?: string;
    contentTypeId?: number;
    pageNo: number;
    numOfRows?: number;
  }): Promise<{ totalCount: number; items: TourListItem[] }> {
    const { areaCode, sigunguCode, contentTypeId, pageNo, numOfRows = 10 } = params;

    const isPetService = contentTypeId === undefined;
    const endpoint = isPetService
      ? VK_ENDPOINTS.PET_SERVICE.AREA_BASED_LIST
      : VK_ENDPOINTS.KOR_SERVICE.AREA_BASED_LIST;

    const requestParams: Record<string, string> = {
      serviceKey: process.env.TOUR_API_KEY!,
      MobileOS: "ETC",
      MobileApp: "CityChat",
      _type: "json",
      numOfRows: String(numOfRows),
      pageNo: String(pageNo),
      areaCode,
    };

    if (sigunguCode) {
      requestParams.sigunguCode = sigunguCode;
    }

    // KorService2만 필요한 파라미터
    if (!isPetService && contentTypeId) {
      requestParams.contentTypeId = String(contentTypeId);
    }

    requestParams.arrange = "A"; // 이름순 정렬


    try {
      const response = await this.apiClient.get<TourApiResponse<TourItemType>>(
        endpoint,
        requestParams
      );

      const { totalCount, items: rawItems } = this.extractData(response);

      return {
        totalCount,
        items: rawItems.map((item) => this.mapToTourListItem(item)),
      };
    } catch (error) {
      console.error("Failed to fetch tour list:", error);
      throw new Error("관광 정보를 불러오는데 실패했습니다.");
    }
  }
  
  async getByContentId(params: { contentId: string; contentTypeId?: number; }): Promise<TourDetail> {
    const { contentId, contentTypeId } = params;
    const isPetService = contentTypeId === undefined;

    const endpoint = isPetService
      ? VK_ENDPOINTS.PET_SERVICE.DETAIL_COMMON
      : VK_ENDPOINTS.KOR_SERVICE.DETAIL_COMMON;

    const requestParams: Record<string, string> = {
      serviceKey: process.env.TOUR_API_KEY!,
      MobileOS: "ETC",
      MobileApp: "CityChat",
      _type: "json",
      contentId,
    };

    try {
      const response = await this.apiClient.get<TourApiResponse<TourDetailRaw>>(
        endpoint,
        requestParams
      );

      const { items } = this.extractData(response);

      if (items.length === 0 ) {
        throw new Error("Tour detail not found");
      }

      return this.mapToTourDetail(items[0]);
    } catch (error) {
      console.error("Failed to fetch tour detail:", error);
      throw new Error("관광 상세 정보를 불러오는데 실패했습니다.");
    }
  }

  private extractData<T>(
    response: TourApiResponse<T>
  ): { totalCount: number; items: T[] } {
    if (response.response.header.resultCode !== "0000") {
      console.warn("API failed:", response.response.header.resultMsg);
      return { totalCount: 0, items: [] };
    }

    const items = this.normalizeItems(response.response.body.items?.item);

    return {
      totalCount: response.response.body.totalCount ?? 0,
      items,
    };
  }
  private extractHref = (html?: string | null): string | undefined => {
    if (!html) return;
    const match = html.match(/href="([^"]+)"/i);
    return match?.[1];
  };

  private normalizeItems<T>(raw: T | T[] | undefined): T[] {
    if (!raw) return [];
    return Array.isArray(raw) ? raw : [raw];
  }

  private mapToTourListItem(item: TourItemType): TourListItem {
    return {
      contentid: item.contentid,
      title: item.title,
      addr1: item.addr1,
      firstImage: item.firstimage,
      contentTypeId: Number(item.contenttypeid),
      areaCode: item.areacode,
      sigunguCode: item.sigungucode,
      mapx: item.mapx,
      mapy: item.mapy,
      tel: item.tel,
      cat1: item.cat1,
    };
  }

  private mapToTourDetail(item: TourDetailRaw): TourDetail {
    return {
      contentid: item.contentid,
      title: item.title,
      homepage: this.extractHref(item.homepage),
      overview: item.overview,
      tel: item.tel,
      telName: item.telname,
      firstImage: item.firstimage,
      addr1: item.addr1,
      restDate: item.restdate,
    };
  }
}
