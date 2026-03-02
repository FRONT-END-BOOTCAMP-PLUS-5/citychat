import { TourRepository } from "@/backend/domain/repositories/TourRepository";
import { GetTourDetailRequestDto } from "@/backend/application/tours/dtos/GetTourDetailRequestDto";
import { GetTourDetailResponseDto } from "@/backend/application/tours/dtos/GetTourDetailResponseDto";

export class GetTourDetailUseCase {
  constructor(private tourRepository: TourRepository) {}

  async execute(request: GetTourDetailRequestDto): Promise<GetTourDetailResponseDto> {
    try {
      const tourDetail = await this.tourRepository.getByContentId({
        contentId: request.contentid,
        contentTypeId: request.contentTypeId
      });

      if (tourDetail) {
        return {
          success: true,
          detail: tourDetail,
        };
      } else {
        throw new Error("tour detail does not exist");
      }

    } catch (error) {
      console.log(error instanceof Error ? error.message : "tour detail fetching error");
      return {
        success: false,
      };
    }
  }
}
