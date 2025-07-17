import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { SigninResponseDto } from "@/backend/application/auth/dtos/SigninResponseDto";

type User = NonNullable<SigninResponseDto["user"]>;

type UserStore = {
  user: User | null;
  isLoggingOut: boolean; // 로그아웃 시, AuthGuard 우회용
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoggingOut: (value: boolean) => void;
};

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoggingOut: false,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
        setLoggingOut: (value: boolean) => set({ isLoggingOut: value }),
      }),
      {
        name: "user-storage",
      }
    ),
    { name: "UserStore" }
  )
);
