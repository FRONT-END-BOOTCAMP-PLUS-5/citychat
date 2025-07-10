import { SigninRequestDto, SigninResponseDto } from "@/backend/application/signin/dtos/SigninDto";

export const signin = async (data: SigninRequestDto): Promise<SigninResponseDto> => {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || errorData.error || 'Login failed');
  }

  return response.json();
};
