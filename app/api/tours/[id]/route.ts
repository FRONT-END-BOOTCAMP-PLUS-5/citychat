import { getTourTabConfig, isValidTourTab } from "@/app/constants/tourTabs";
import { GetTourDetailRequestDto } from "@/backend/application/tours/dtos/GetTourDetailRequestDto";
import { GetTourDetailUseCase } from "@/backend/application/tours/usecases/GetTourDetailUsecase";
import { VisitKoreaApiClient } from "@/backend/infrastructure/external-clients/VisitKoreaApiClient";
import { VkTourRepository } from "@/backend/infrastructure/repositories/VkTourRepository";
import { NextRequest, NextResponse } from "next/server";

const useCase = new GetTourDetailUseCase(new VkTourRepository(new VisitKoreaApiClient()));

export async function GET(request: NextRequest, { params }: {params: Promise<{id: string}>}) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab") ?? "tour";

  if (!isValidTourTab(tab)) {
    return NextResponse.json(
      { error: `Invalid tab: ${tab}` },
      { status: 400 }
    );
  }

  const tabConfig = getTourTabConfig(tab);
  const contentTypeId = tabConfig.contentTypeId;

  const dto: GetTourDetailRequestDto = {
    contentid: id,
    contentTypeId,
  };
  
  try {
    const result = await useCase.execute(dto);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Tour detail error:", error);
    return NextResponse.json({ error: "Failed to fetch tour detail" }, { status: 500 });
  }
}
