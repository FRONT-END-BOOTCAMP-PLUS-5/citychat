import { GetTourListRequestDto } from "@/backend/application/tours/dtos/GetTourListRequestDto";
import { ApiResponse } from "@/app/types/ApiResponse";
import { TourListItem } from "@/backend/domain/entities/TourListItem";
import { TourRepository } from "@/backend/domain/repositories/TourRepository";

export class GetTourListUseCase {
  constructor(private tourRepository: TourRepository) {}

  async execute(request: GetTourListRequestDto): Promise<ApiResponse<TourListItem>> {
    const numOfRows = request.numOfRows ?? 10;

    const { totalCount, items } = await this.tourRepository.getFilteredList({
      areaCode: request.areaCode,
      sigunguCode: request.sigunguCode,
      contentTypeId: request.contentTypeId,
      pageNo: request.pageNo,
      numOfRows,
    });

    const hasMore = request.pageNo * numOfRows < totalCount;

    return {
      total: totalCount,
      hasMore,
      items,
    };
  }
}
