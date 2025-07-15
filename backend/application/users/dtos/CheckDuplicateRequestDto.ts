export interface CheckDuplicateRequestDto {
  field: "userId" | "nickname" | "email";
  value: string;
}
