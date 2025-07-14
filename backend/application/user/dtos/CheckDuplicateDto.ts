export interface CheckDuplicateRequestDto {
  field: "userId" | "nickname" | "email";
  value: string;
}

export interface CheckDuplicateResponseDto {
  success: boolean;
  message: string;
  isDuplicate: boolean;
}
