import { City } from "../entities/City";

export interface CityRepository {
  getCityById(cityId: number): Promise<City | null>;
}

