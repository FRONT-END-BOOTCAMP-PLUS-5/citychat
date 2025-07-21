"use client";

import { useEffect } from "react";
import { useCityStore } from "../stores/useCitystore";
import { SbCityRepository } from "@/backend/infrastructure/repositories/SbCityRepository";
import { GetCityListUseCase } from "@/backend/application/cities/usecases/GetCityListUseCase";

export default function CityLoader() {
  const addCities = useCityStore((state) => state.addCities);

  useEffect(() => {
    const loadCities = async () => {
      const useCase = new GetCityListUseCase(new SbCityRepository());
      const cities = (await useCase.execute()).map((city) => ({
        ...city,
        id: String(city.id),
      }));
      addCities(cities);
    };
    loadCities();
  }, [addCities]);

  return null;
}

