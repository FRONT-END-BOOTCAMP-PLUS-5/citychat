import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/app/stores/useUserStore";
import { UpdateUserResponseDto } from "@/backend/application/users/dtos/UpdateUserResponseDto";

type UpdateUserData = {
  nickname?: string;
  currentPassword?: string;
  newPassword?: string;
};

const updateUser = async (data: UpdateUserData): Promise<UpdateUserResponseDto> => {
  const response = await fetch("/api/users/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || errorData.error || "사용자 정보 수정에 실패했습니다.");
  }

  return response.json();
};

export const useUpdateUser = () => {
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: (data: UpdateUserData) => {
      return updateUser(data);
    },
    onSuccess: (data) => {
      if (data.success && data.user) {
        setUser(data.user);
      }
    },
    onError: (error) => {
      console.error("User update failed:", error);
    },
  });
};
