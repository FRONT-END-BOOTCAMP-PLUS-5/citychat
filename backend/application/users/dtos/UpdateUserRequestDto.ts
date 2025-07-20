export interface UpdateUserRequestDto {
  id: number;
  nickname?: string;
  currentPassword?: string;
  newPassword?: string;
}
