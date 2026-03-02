"use client";
import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import SharedPageLayout from "@/app/SharedPageLayout";
import { useSignin } from "@/hooks/useSignin";

const {
  ["form-container"]: formContainer,
  ["signin-form"]: signinForm,
  ["form-group"]: formGroup,
  ["form-label"]: formLabel,
  ["form-input"]: formInput,
  ["form-button"]: formButton,
  ["error-message"]: errorMessage,
  ["signup-link"]: signupLink,
} = styles;

export default function SigninPage() {
  const { mutate: signin, isPending, error } = useSignin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = (e.target as HTMLFormElement).userid.value.trim();
    const password = (e.target as HTMLFormElement).password.value.trim();

    signin({ userId, password });
  };

  return (
    <SharedPageLayout title="Sign in">
      <div className={formContainer}>
        <form className={signinForm} onSubmit={handleSubmit}>
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
              disabled={isPending}
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
              disabled={isPending}
              required
            />
          </div>

          <div className={formGroup} style={{ minHeight: "1rem" }}>
            {error && (
              <p className={errorMessage}>아이디와 비밀번호를 확인해주세요.</p>
            )}
          </div>

          <div className={formGroup}>
            <button type="submit" className={formButton} disabled={isPending}>
                Signin
            </button>
          </div>

          <div className={formGroup}>
            <p className={signupLink}>
                계정이 없으신가요? <Link href="/signup">회원가입하기</Link>
            </p>
          </div>
        </form>
      </div>
    </SharedPageLayout>
  );
}
