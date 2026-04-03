import { useMutation } from "@tanstack/react-query";
import { CheckDuplicateRequestDto } from "@/backend/application/users/dtos/CheckDuplicateRequestDto";
import { CheckDuplicateResponseDto } from "@/backend/application/users/dtos/CheckDuplicateResponseDto";

const checkDuplicate = async (
  params: CheckDuplicateRequestDto
): Promise<CheckDuplicateResponseDto> => {
  const response = await fetch(
    `/api/user/duplicate?field=${params.field}&value=${encodeURIComponent(params.value)}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "중복 확인 중 오류가 발생했습니다.");
  }

  return response.json();
};

export const useCheckDuplicate = () => {
  return useMutation({
    mutationFn: checkDuplicate,
  });
};
