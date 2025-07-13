"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import SharedPageLayout from "@/app/SharedPageLayout";

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
} = styles;

export default function SignupPage() {
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
      alert(`${field}를 입력해주세요.`);
      return;
    }

    try {
      const response = await fetch(`/api/users/check?field=${field}&value=${encodeURIComponent(value)}`);
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

    }
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

          <button type="submit" className={formButton} style={{ width: "80%" }}>
            Sign Up
          </button>
        </form>
      </div>
    </SharedPageLayout>
  );
}
