/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import SharedPageLayout from "@/app/SharedPageLayout";
import { useSignup } from "@/app/hooks/useSignup";

const {
  ["form-container"]: formContainer,
  ["signup-form"]: signupForm,
  ["form-title"]: formTitle,
  ["form-group"]: formGroup,
  ["form-label"]: formLabel,
  ["form-input"]: formInput,
  ["form-button"]: formButton,
  ["input-row"]: inputRow,
  ["duplicate-check-button"]: duplicateCheckButton,
  ["duplicate-message"]: duplicateMessage,
  ["duplicate-message-success"]: duplicateMessageSuccess,
  ["duplicate-message-error"]: duplicateMessageError,
  ["error-message"]: errorMessage,
} = styles;

export default function SignupPage() {
  const { mutate: signup, isPending, error } = useSignup();
  const [validationError, setValidationError] = useState<string>("");
  const [duplicateStatus, setDuplicateStatus] = useState<{
    userId: { checked: boolean; isDuplicate: boolean; message: string };
    nickname: { checked: boolean; isDuplicate: boolean; message: string };
    email: { checked: boolean; isDuplicate: boolean; message: string };
  }>({
    userId: { checked: false, isDuplicate: false, message: "" },
    nickname: { checked: false, isDuplicate: false, message: "" },
    email: { checked: false, isDuplicate: false, message: "" },
  });

  async function checkDuplicate(field: "userId" | "nickname" | "email", value: string) {
    if (!value.trim()) {
      setValidationError(`${field}를 입력해주세요.`);
      return;
    }

    try {
      const response = await fetch(`/api/user/duplicate?field=${field}&value=${encodeURIComponent(value)}`);
      const result = await response.json();

      setDuplicateStatus(prev => ({
        ...prev,
        [field]: {
          checked: true,
          isDuplicate: result.isDuplicate,
          message: result.message
        }
      }));
    } catch (error) {
      setValidationError("중복 확인 중 오류가 발생했습니다.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setValidationError(""); // 에러 초기화
    
    const formData = new FormData(event.currentTarget);
    const data = {
      nickname: formData.get("nickname") as string,
      userId: formData.get("userid") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirm-password") as string,
    };

    if (data.password !== data.confirmPassword) {
      setValidationError("비밀번호가 일치하지 않습니다.");
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
    const { confirmPassword, ...signupData } = data;
    signup(signupData);
  }

  return (
    <SharedPageLayout title="Sign up">
      <div className={formContainer}>
        {/* <h3 className={formTitle}>Personal Information</h3> */}
        <form className={signupForm} onSubmit={handleSubmit}>
          <div className={formGroup}>
            <label htmlFor="nickname" className={formLabel}>Nickname</label>
            <div className={inputRow}>
              <input
                type="text"
                id="nickname"
                name="nickname"
                className={formInput}
                placeholder="Enter Nickname"
                required
                onChange={() => setDuplicateStatus(prev => ({ ...prev, nickname: { checked: false, isDuplicate: false, message: "" } }))}
              />
              <button
                type="button"
                className={`${formButton} ${duplicateCheckButton}`}
                onClick={() => {
                  const input = document.getElementById("nickname") as HTMLInputElement;
                  checkDuplicate("nickname", input.value);
                }}
              >
                중복확인
              </button>
            </div>
            {duplicateStatus.nickname.checked && (
              <p className={`${duplicateMessage} ${duplicateStatus.nickname.isDuplicate ? duplicateMessageError : duplicateMessageSuccess}`}>
                {duplicateStatus.nickname.message}
              </p>
            )}
          </div>

          <div className={formGroup}>
            <label htmlFor="userid" className={formLabel}>ID</label>
            <div className={inputRow}>
              <input
                type="text"
                id="userid"
                name="userid"
                className={formInput}
                placeholder="Enter ID"
                required
                onChange={() => setDuplicateStatus(prev => ({ ...prev, userId: { checked: false, isDuplicate: false, message: "" } }))}
              />
              <button
                type="button"
                className={`${formButton} ${duplicateCheckButton}`}
                onClick={() => {
                  const input = document.getElementById("userid") as HTMLInputElement;
                  checkDuplicate("userId", input.value);
                }}
              >
                중복확인
              </button>
            </div>
            {duplicateStatus.userId.checked && (
              <p className={`${duplicateMessage} ${duplicateStatus.userId.isDuplicate ? duplicateMessageError : duplicateMessageSuccess}`}>
                {duplicateStatus.userId.message}
              </p>
            )}
          </div>

          <div className={formGroup}>
            <label htmlFor="email" className={formLabel}>Email</label>
            <div className={inputRow}>
              <input
                type="email"
                id="email"
                name="email"
                className={formInput}
                placeholder="Enter Email"
                required
                onChange={() => setDuplicateStatus(prev => ({ ...prev, email: { checked: false, isDuplicate: false, message: "" } }))}
              />
              <button
                type="button"
                className={`${formButton} ${duplicateCheckButton}`}
                onClick={() => {
                  const input = document.getElementById("email") as HTMLInputElement;
                  checkDuplicate("email", input.value);
                }}
              >
                중복확인
              </button>
            </div>
            {duplicateStatus.email.checked && (
              <p className={`${duplicateMessage} ${duplicateStatus.email.isDuplicate ? duplicateMessageError : duplicateMessageSuccess}`}>
                {duplicateStatus.email.message}
              </p>
            )}
          </div>

          <div className={formGroup}>
            <label htmlFor="password" className={formLabel}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={formInput}
              placeholder="Enter Password"
              required
            />
          </div>

          <div className={formGroup}>
            <label htmlFor="confirm-password" className={formLabel}>Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              className={formInput}
              placeholder="Confirm Password"
              required
            />
          </div>

          <div className={formGroup} style={{ minHeight: "1rem"}}>
            {(error || validationError) && (
              <p className={errorMessage}>
                {error?.message || validationError}
              </p>
            )}
          </div>

          <div className={formGroup}>
            <button type="submit" className={formButton} style={{ width: "100%" }} disabled={isPending}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </SharedPageLayout>
  );
}
