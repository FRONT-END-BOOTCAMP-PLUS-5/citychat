import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type City = {
  id: string;
  name: string;
  description: string;
  image?: string;
};

type CityStore = {
  cities: City[];
  getCityById: (id: string) => City | undefined;
  addCity: (city: City) => void;
  addCities: (cities: City[]) => void;
  clearCities: () => void;
};

export const useCityStore = create<CityStore>()(
  devtools(
    persist(
      (set, get) => ({
        cities: [],
        getCityById: (id) => get().cities.find((c) => c.id == id),
        addCity: (city) =>
          set((state) => {
            const exists = state.cities.some((c) => c.id === city.id);
            return exists ? state : { cities: [...state.cities, city] };
          }),
        addCities: (newCities) =>
          set((state) => {
            // newCities가 배열인지 확인
            if (!Array.isArray(newCities)) {
              return state;
            }

            const existingIds = new Set(state.cities.map((c) => c.id));
            const filtered = newCities.filter(
              (city) => !existingIds.has(city.id)
            );
            const updatedCities = [...state.cities, ...filtered];
            return { cities: updatedCities };
          }),
        clearCities: () => set({ cities: [] }),
      }),
      {
        name: "city-storage",
      }
    ),
    { name: "CityStore" }
  )
);

