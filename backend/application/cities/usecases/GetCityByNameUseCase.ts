import { CityRepository } from "@/backend/domain/repositories/CityRepository";

export class GetCityByIdUseCase {
  constructor(private readonly cityRepo: CityRepository) {}

  async execute(cityId: number) {
    return await this.cityRepo.getCityById(cityId);
  }
}
