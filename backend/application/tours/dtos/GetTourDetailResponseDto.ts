import { TourDetail } from "@/backend/domain/entities/TourDetail";

export interface GetTourDetailResponseDto {
  success: boolean;
  detail?: TourDetail;
}
