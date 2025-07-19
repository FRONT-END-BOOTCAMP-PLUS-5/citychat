// backend/domain/repositories/CityRepository.ts
import { City } from "../entities/City";

export interface CityRepository {
  getCityById(id: number): Promise<City | null>;
  getAllCities(): Promise<City[]>; 
}
