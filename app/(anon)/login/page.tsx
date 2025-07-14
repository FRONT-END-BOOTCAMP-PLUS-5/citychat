"use client";
import React from "react";
import styles from "./page.module.css";
import SharedPageLayout from "@/app/SharedPageLayout";
import { useSignin } from "@/app/hooks/useSignin";
import { useUserStore } from "@/app/stores/useUserStore";

const {
  ["form-container"]: formContainer,
  ["login-form"]: loginForm,
  ["form-title"]: formTitle,
  ["form-group"]: formGroup,
  ["form-label"]: formLabel,
  ["form-input"]: formInput,
  ["form-button"]: formButton,
  ["error-message"]: errorMessage,
} = styles;

export default function LoginPage() {
  const { mutate: signin, isPending, error } = useSignin();
  const setUser = useUserStore((state) => state.setUser); // ✅ 상태 설정 함수 가져오기

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = (e.target as HTMLFormElement).userid.value.trim();
    const password = (e.target as HTMLFormElement).password.value.trim();

    // useSignin 훅 호출
    signin(
      { userId, password },
      {
        onSuccess: (data) => {
          if (data.user) {
            setUser(data.user); // useUserStore에 정보 저장
          }
        },
        onError: (error) => {
          console.error("Login failed:", error);
        },
      }
    );
  };

  return (
    <SharedPageLayout title="Login">
      <div className={formContainer}>
        {/* <h3 className={formTitle}>Login</h3> */}
        <form className={loginForm} onSubmit={handleSubmit}>
          <div className={formGroup}>
            <label htmlFor="userid" className={formLabel}>
              ID
            </label>
            <input
              type="text"
              id="userid"
              name="userid"
              className={formInput}
              placeholder="Enter ID"
<<<<<<< HEAD
              disabled={isPending}
=======
>>>>>>> develop
              required
            />
          </div>

          <div className={formGroup}>
            <label htmlFor="password" className={formLabel}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={formInput}
              placeholder="Enter Password"
<<<<<<< HEAD
              disabled={isPending}
              required
            />
          </div>
          
          <div className={formGroup} style={{ minHeight: "1rem"}}>
            {error && (
              <p className={errorMessage}>
                아이디와 비밀번호를 확인해주세요.
              </p>
            )}
          </div>

          <div className={formGroup}>
            <button type="submit" className={formButton} disabled={isPending}>
              Login
            </button>

          </div>
=======
              required
            />
          </div>

          <button type="submit" className={formButton} disabled={isPending}>
            Login
          </button>
>>>>>>> develop
        </form>
      </div>
    </SharedPageLayout>
  );
}
