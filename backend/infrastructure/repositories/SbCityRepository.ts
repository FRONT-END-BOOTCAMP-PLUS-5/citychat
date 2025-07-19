import { supabaseClient } from "@/utils/supabase/client";
import { CityRepository } from "@/backend/domain/repositories/CityRepository";
import { CityDTO } from "@/backend/application/cities/dtos/GetCityListResponseDto";
import { City } from "@/backend/domain/entities/City";

export class SbCityRepository implements CityRepository {
  async getCityById(cityId: number): Promise<City | null> {
    const { data, error } = await supabaseClient
      .from("cities")
      .select("id, name, description")
      .eq("id", cityId)
      .single();

    if (error) {
      console.error("❌ Supabase 에러:", error);
      return null;
    }

    const cityDto: CityDTO = {
      id: data.id,
      name: data.name,
      description: data.description,
    };

    const city: City = {
      id: cityDto.id,
      name: cityDto.name,
      description: cityDto.description,
    };

    return city;
  }

  async getAllCities(): Promise<City[]> {
    const { data, error } = await supabaseClient
      .from("cities")
      .select("id, name, description");

    if (error || !data) {
      console.error("❌ 전체 도시 불러오기 실패:", error);
      return [];
    }

    const cityDtos: CityDTO[] = data;

    return cityDtos.map((dto) => ({
      id: dto.id,
      name: dto.name,
      description: dto.description,
    }));
  }
}

