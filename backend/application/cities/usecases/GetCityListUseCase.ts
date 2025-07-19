import { CityRepository } from "@/backend/domain/repositories/CityRepository";
import { City } from "@/backend/domain/entities/City";

export class GetCityListUseCase {
  constructor(private cityRepository: CityRepository) {}

  async execute(): Promise<City[]> {
    return await this.cityRepository.getAllCities();
  }
}

