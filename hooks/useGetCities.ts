import { useCityStore } from "@/stores/useCityStore";
import { CityDTO } from "@/backend/application/cities/dtos/GetCityListResponseDto";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const fetchCities = async(): Promise<CityDTO[]> => {
  const response = await fetch("/api/cities");

  if(!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "도시 목록을 불러올 수 없습니다.");
  }

  return response.json();
};

export const useGetCities = () => {
  const {cities, addCities } = useCityStore();

  const query = useQuery({
    queryKey: ["cities"],
    queryFn: fetchCities,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: cities.length === 0,
  });

  useEffect(() => {
    if (query.data && query.data.length > 0) {
      addCities(query.data.map(city => ({
        id: city.id,
        name: city.name,
        description: city.description,
        image: city.image,
      })));
    }
  }, [query.data, addCities]);

  return {
    cities: cities.length > 0 ? cities : (query.data ?? []),
    isLoading: query.isLoading && cities.length === 0,
    error: query.error,
    refetch: query.refetch,
  };
};
