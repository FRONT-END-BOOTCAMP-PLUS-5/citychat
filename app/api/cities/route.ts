import { GetCityListUseCase } from "@/backend/application/cities/usecases/GetCityListUseCase";
import { SbCityRepository } from "@/backend/infrastructure/repositories/SbCityRepository";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const cityRepository = new SbCityRepository(supabase);
    const getCityListUseCase = new GetCityListUseCase(cityRepository);

    const cities = await getCityListUseCase.execute();

    const citiesJson = cities.map(city => ({
      id: city.id,
      name: city.name,
      description: city.description,
      image: city.image,
    }));

    return NextResponse.json(citiesJson);
  } catch (error) {
    console.error("도시 목록 조회 실패: ", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "도시 목록을 불러올 수 없습니다." },
      { status: 500 }
    );
  }
}
