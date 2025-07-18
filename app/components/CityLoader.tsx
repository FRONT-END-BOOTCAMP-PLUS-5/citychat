"use client";

import { useEffect } from "react";
import { useCityStore } from "../stores/useCitystore";
import { SbCityRepository } from "@/backend/infrastructure/repositories/SbCityRepository";
import { GetCityByIdUseCase } from "@/backend/application/cities/usecases/GetCityByNameUseCase";

export default function CityLoader({ cityId }: { cityId: number }) {
  const addCity = useCityStore((state) => state.addCity);
  const getCityById = useCityStore((state) => state.getCityById);

  useEffect(() => {
    const loadCity = async () => {
      const existing = getCityById(cityId);
      if (!existing) {
        const useCase = new GetCityByIdUseCase(new SbCityRepository());
        const city = await useCase.execute(cityId);
        if (city) {
          addCity({
            id: city.id,
            name: city.name,
            description: city.description,
          });
        }
      }
    };
    loadCity();
  }, [cityId, addCity, getCityById]);

  return null;
}

