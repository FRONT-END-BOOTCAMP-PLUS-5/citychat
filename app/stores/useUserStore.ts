import { create } from "zustand";

// hooks/useSignin.ts - data.user
type User = {
  id: number;
  nickname: string;
};

// 스토어 타입
type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

//스토어 생성
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
