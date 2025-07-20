// 유효성 검증 설정 및 함수들

export const VALIDATION_RULES = {
  nickname: {
    minLength: 2,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9가-힣_]+$/,
    errorMessages: {
      required: "닉네임을 입력해주세요.",
      minLength: "닉네임은 최소 2자 이상이어야 합니다.",
      maxLength: "닉네임은 최대 20자까지 가능합니다.",
      pattern: "닉네임은 한글, 영문, 숫자, _만 사용 가능합니다."
    }
  },
  userId: {
    minLength: 4,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    errorMessages: {
      required: "아이디를 입력해주세요.",
      minLength: "아이디는 최소 4자 이상이어야 합니다.",
      maxLength: "아이디는 최대 20자까지 가능합니다.",
      pattern: "아이디는 영문, 숫자, _만 사용 가능합니다."
    }
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessages: {
      required: "이메일을 입력해주세요.",
      pattern: "올바른 이메일 형식이 아닙니다."
    }
  },
  password: {
    minLength: 8,
    maxLength: 50,
    errorMessages: {
      required: "비밀번호를 입력해주세요.",
      minLength: "비밀번호는 최소 8자 이상이어야 합니다.",
      maxLength: "비밀번호는 최대 50자까지 가능합니다.",
      pattern: "비밀번호는 영문, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다."
    }
  }
} as const;

// 유효성 검증 함수들
export const validators = {
  nickname: (value: string): string => {
    if (!value) return VALIDATION_RULES.nickname.errorMessages.required;
    if (value.length < VALIDATION_RULES.nickname.minLength) {
      return VALIDATION_RULES.nickname.errorMessages.minLength;
    }
    if (value.length > VALIDATION_RULES.nickname.maxLength) {
      return VALIDATION_RULES.nickname.errorMessages.maxLength;
    }
    if (!VALIDATION_RULES.nickname.pattern.test(value)) {
      return VALIDATION_RULES.nickname.errorMessages.pattern;
    }
    return "";
  },

  userId: (value: string): string => {
    if (!value) return VALIDATION_RULES.userId.errorMessages.required;
    if (value.length < VALIDATION_RULES.userId.minLength) {
      return VALIDATION_RULES.userId.errorMessages.minLength;
    }
    if (value.length > VALIDATION_RULES.userId.maxLength) {
      return VALIDATION_RULES.userId.errorMessages.maxLength;
    }
    if (!VALIDATION_RULES.userId.pattern.test(value)) {
      return VALIDATION_RULES.userId.errorMessages.pattern;
    }
    return "";
  },

  email: (value: string): string => {
    if (!value) return VALIDATION_RULES.email.errorMessages.required;
    if (!VALIDATION_RULES.email.pattern.test(value)) {
      return VALIDATION_RULES.email.errorMessages.pattern;
    }
    return "";
  },

  password: (value: string): string => {
    if (!value) return VALIDATION_RULES.password.errorMessages.required;
    if (value.length < VALIDATION_RULES.password.minLength) {
      return VALIDATION_RULES.password.errorMessages.minLength;
    }
    if (value.length > VALIDATION_RULES.password.maxLength) {
      return VALIDATION_RULES.password.errorMessages.maxLength;
    }
    
    // 영문, 숫자, 특수문자 중 2가지 이상 포함 검사
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[@$!%*?&]/.test(value);
    
    const typeCount = (hasLetter ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecial ? 1 : 0);
    
    if (typeCount < 2) {
      return VALIDATION_RULES.password.errorMessages.pattern;
    }
    return "";
  },

  confirmPassword: (value: string, password: string): string => {
    if (!value) return "비밀번호 확인을 입력해주세요.";
    if (value !== password) {
      return "비밀번호가 일치하지 않습니다.";
    }
    return "";
  }
} as const;

// 유효성 검증 헬퍼 함수
export const validateField = (fieldName: keyof typeof validators, value: string, compareValue?: string): string => {
  if (fieldName === "confirmPassword" && compareValue !== undefined) {
    return validators.confirmPassword(value, compareValue);
  }
  return validators[fieldName as Exclude<keyof typeof validators, "confirmPassword">](value);
};
