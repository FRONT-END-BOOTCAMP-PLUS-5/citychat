"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import SharedPageLayout from "@/app/SharedPageLayout";
import { useSignup } from "@/app/hooks/useSignup";
import { validators } from "@/config/validation";
import FormField from "./components/FormField";
import DuplicateField from "./components/DuplicateField";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const {
  ["form-container"]: formContainer,
  ["signup-form"]: signupForm,
  ["form-group"]: formGroup,
  ["form-button"]: formButton,
  ["error-message"]: errorMessage,
  ["signin-link"]: signinLink,
} = styles;

export default function SignupPage() {
  const { mutate: signup, isPending, error } = useSignup();
  const [validationError, setValidationError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{
    nickname: string;
    userId: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    nickname: "",
    userId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [duplicateStatus, setDuplicateStatus] = useState<{
    userId: { checked: boolean; isDuplicate: boolean };
    nickname: { checked: boolean; isDuplicate: boolean };
    email: { checked: boolean; isDuplicate: boolean };
  }>({
    userId: { checked: false, isDuplicate: false },
    nickname: { checked: false, isDuplicate: false },
    email: { checked: false, isDuplicate: false },
  });
  const [formData, setFormData] = useState({
    nickname: "",
    userId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 필드별 입력 핸들러
  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    let error = "";
    switch (field) {
    case "nickname":
      error = value ? validators.nickname(value) : "";
      break;
    case "userId":
      error = value ? validators.userId(value) : "";
      break;
    case "email":
      error = value ? validators.email(value) : "";
      break;
    case "password":
      error = value ? validators.password(value) : "";
      // 비밀번호가 변경되면 확인 비밀번호도 다시 검증
      if (formData.confirmPassword) {
        const confirmError = validators.confirmPassword(formData.confirmPassword, value);
        setFieldErrors(prev => ({ ...prev, confirmPassword: confirmError }));
      }
      break;
    case "confirmPassword":
      error = value ? validators.confirmPassword(value, formData.password) : "";
      break;
    }
    
    setFieldErrors(prev => ({ ...prev, [field]: error }));
    
  };

  const handleDuplicateResult = useCallback((field: string, isChecked: boolean, isDuplicate: boolean) => {
    setDuplicateStatus(prev => ({
      ...prev,
      [field]: { checked: isChecked, isDuplicate }
    }));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setValidationError(""); // 에러 초기화
    
    // 필드 에러 확인
    const hasFieldErrors = Object.values(fieldErrors).some(error => error !== "");
    if (hasFieldErrors) {
      setValidationError("입력 정보를 확인해주세요.");
      return;
    }

    // 필수 필드 확인
    if (!formData.nickname || !formData.userId || !formData.email || !formData.password || !formData.confirmPassword) {
      setValidationError("모든 필드를 입력해주세요.");
      return;
    }

    if (!duplicateStatus.userId.checked || duplicateStatus.userId.isDuplicate) {
      setValidationError("아이디 중복 확인을 해주세요.");
      return;
    }

    if (!duplicateStatus.nickname.checked || duplicateStatus.nickname.isDuplicate) {
      setValidationError("닉네임 중복 확인을 해주세요.");
      return;
    }

    if (!duplicateStatus.email.checked || duplicateStatus.email.isDuplicate) {
      setValidationError("이메일 중복 확인을 해주세요.");
      return;
    }

    // confirmPassword 제외하고 회원가입 데이터 전달
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...signupData } = formData;
    signup(signupData);
  }

  return (
    <SharedPageLayout title="Sign up">
      <div className={formContainer}>
        <form className={signupForm} onSubmit={handleSubmit}>
          <DuplicateField
            label="Nickname"
            id="nickname"
            name="nickname"
            type="text"
            placeholder="Enter Nickname"
            value={formData.nickname}
            onChange={(value) => handleFieldChange("nickname", value)}
            field="nickname"
            error={fieldErrors.nickname}
            required
            styles={styles}
            onDuplicateResult={handleDuplicateResult}
          />

          <DuplicateField
            label="ID"
            id="userid"
            name="userid"
            type="text"
            placeholder="Enter ID"
            value={formData.userId}
            onChange={(value) => handleFieldChange("userId", value)}
            field="userId"
            error={fieldErrors.userId}
            required
            styles={styles}
            onDuplicateResult={handleDuplicateResult}
          />

          <DuplicateField
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={(value) => handleFieldChange("email", value)}
            field="email"
            error={fieldErrors.email}
            required
            styles={styles}
            onDuplicateResult={handleDuplicateResult}
          />

          <FormField
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={(value) => handleFieldChange("password", value)}
            error={fieldErrors.password}
            required
            styles={styles}
          />

          <FormField
            label="Confirm Password"
            id="confirm-password"
            name="confirm-password"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(value) => handleFieldChange("confirmPassword", value)}
            error={fieldErrors.confirmPassword}
            required
            styles={styles}
          />

          <div className={formGroup} style={{ minHeight: "1rem"}}>
            {(error || validationError) && (
              <p className={errorMessage}>
                {error?.message || validationError}
              </p>
            )}
          </div>

          <div className={formGroup}>
            <button type="submit" className={formButton} style={{ width: "100%" }} disabled={isPending}>
              { isPending ? <LoadingSpinner size={8} /> : "Sign Up" }
            </button>
          </div>
          
          <div className={formGroup}>
            <p className={signinLink}>
              이미 계정이 있으신가요? <Link href="/signin">로그인하기</Link>
            </p>
          </div>
        </form>
      </div>
    </SharedPageLayout>
  );
}
