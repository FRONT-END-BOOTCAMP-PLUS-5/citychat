import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { SigninResponseDto } from "@/backend/application/signin/dtos/SigninDto";

type User = NonNullable<SigninResponseDto["user"]>;

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
      }),
      {
        name: "user-storage",
      }
    ),
    { name: "UserStore" }
  )
);
