import { NextRequest, NextResponse } from "next/server";
import { GetTourListUseCase } from "@/backend/application/tours/usecases/GetTourListUseCase";
import { VkTourRepository } from "@/backend/infrastructure/repositories/VkTourRepository";
import { VisitKoreaApiClient } from "@/backend/infrastructure/external-clients/VisitKoreaApiClient";
import { getDistrictByCode, getRegionByDbCityId } from "@/app/constants/regionCodes";
import { GetTourListRequestDto } from "@/backend/application/tours/dtos/GetTourListRequestDto";
import { getTourTabConfig, isValidTourTab } from "@/app/constants/tourTabs";

const useCase = new GetTourListUseCase(new VkTourRepository(new VisitKoreaApiClient()));

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: cityId } = await params;
  const { searchParams } = new URL(request.url);

  const tab = searchParams.get("tab") ?? "tour";
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");
  const sigunguCode = searchParams.get("sigunguCode") || undefined;

  if (!isValidTourTab(tab)) {
    return NextResponse.json(
      { error: `Invalid tab: ${tab}` },
      { status: 400 }
    );
  }

  // cityId -> Region mapping
  const region = getRegionByDbCityId(Number(cityId));
  if (!region) {
    return NextResponse.json({ error: `Unknown cityId: ${cityId}` }, { status: 400 });
  }

  // tab -> contentTypeId mapping
  const tabConfig = getTourTabConfig(tab);
  const contentTypeId = tabConfig.contentTypeId;

  if (sigunguCode) {
    const district = getDistrictByCode(region.id, sigunguCode);
    if (!district) {
      return NextResponse.json(
        { error: `Invalid sigunguCode: ${sigunguCode} for city ${region.nameKo}` },
        { status: 400 }
      );
    }
  }

  const dto: GetTourListRequestDto = {
    areaCode: region.korServiceAreaCode,
    sigunguCode,
    contentTypeId,
    pageNo: page,
    numOfRows: limit,
  };

  try {
    const result = await useCase.execute(dto);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Tour list error:", error);
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 });
  }
}
