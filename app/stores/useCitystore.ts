import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type City = {
  id: number;
  name: string;
  description: string;
};

type CityStore = {
  cities: City[];
  getCityById: (id: number) => City | undefined;
  addCity: (city: City) => void;
  addCities: (cities: City[]) => void;
  clearCities: () => void;
};

export const useCityStore = create<CityStore>()(
  devtools(
    persist(
      (set, get) => ({
        cities: [],
        getCityById: (id) => get().cities.find((c) => c.id === id),
        addCity: (city) =>
          set((state) => {
            const exists = state.cities.some((c) => c.id === city.id);
            return exists ? state : { cities: [...state.cities, city] };
          }),
        addCities: (newCities) =>
          set((state) => {
            const existingIds = new Set(state.cities.map((c) => c.id));
            const filtered = newCities.filter(
              (city) => !existingIds.has(city.id)
            );
            return { cities: [...state.cities, ...filtered] };
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

