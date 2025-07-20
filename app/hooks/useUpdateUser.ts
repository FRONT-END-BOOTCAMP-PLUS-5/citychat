import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/app/stores/useUserStore";
import { updateUserNickname, updateUserPassword } from "../apis/authApi";

export const useUpdateNickname = () => {
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: (nickname: string) => {
      return updateUserNickname(nickname);
    },
    onSuccess: (data) => {
      if (data.success && data.user) {
        setUser(data.user);
      }
    },
    onError: (error) => {
      console.error("Nickname update failed:", error);
    },
  });
};

export const useUpdatePassword = () => {
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => {
      return updateUserPassword(data);
    },
    onSuccess: (data) => {
      if (data.success && data.user) {
        setUser(data.user);
      }
    },
    onError: (error) => {
      console.error("Password update failed:", error);
    },
  });
}
