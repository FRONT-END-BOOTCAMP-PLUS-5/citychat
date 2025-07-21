"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/app/components/Modal";
import styles from "../page.module.css";
import { useUpdateUser } from "@/app/hooks/useUpdateUser";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { validators } from "@/config/validation";

const {
  ["modal-form"]: modalForm,
  ["modal-form-group"]: modalFormGroup,
  ["modal-form-label"]: modalFormLabel,
  ["modal-form-input"]: modalFormInput,
  ["modal-buttons"]: modalButtons,
  ["modal-button"]: modalButton,
  ["cancel-button"]: cancelButton,
  ["field-message"]: fieldMessage,
  ["field-message-success"]: fieldMessageSuccess,
  ["field-message-error"]: fieldMessageError,
} = styles;

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordChangeModal({
  isOpen,
  onClose,
}: PasswordChangeModalProps) {
  const { mutate: updateUser, isPending, error, isSuccess } = useUpdateUser();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [submitMessage, setSubmitMessage] = useState({
    show: false,
    type: "success" as "success" | "error",
    text: "",
  });

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setFieldErrors({
        newPassword: "",
        confirmPassword: "",
      });
      setSubmitMessage({ show: false, type: "success", text: "" });
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setSubmitMessage({
        show: true,
        type: "error",
        text: "모든 필드를 입력해주세요.",
      });
      return;
    }

    // 필드 에러 확인
    const hasFieldErrors = Object.values(fieldErrors).some(
      (error) => error !== ""
    );
    if (hasFieldErrors) {
      setSubmitMessage({
        show: true,
        type: "error",
        text: "입력 정보를 확인해주세요.",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSubmitMessage({
        show: true,
        type: "error",
        text: "새 비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    updateUser(
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      },
      {
        onSuccess: () => {
          setSubmitMessage({
            show: true,
            type: "success",
            text: "사용자 정보가 성공적으로 수정되었습니다.",
          });
        },
        onError: (error) => {
          setSubmitMessage({
            show: true,
            type: "error",
            text: error.message || "사용자 정보 수정에 실패했습니다.",
          });
        },
      }
    );
  };

  const handleInputChange =
    (field: keyof typeof passwordData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPasswordData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // 실시간 유효성 검증
      if (field === "newPassword") {
        const error = value ? validators.password(value) : "";
        setFieldErrors((prev) => ({ ...prev, newPassword: error }));

        // 새 비밀번호가 변경되면 확인 비밀번호도 다시 검증
        if (passwordData.confirmPassword) {
          const confirmError = validators.confirmPassword(
            passwordData.confirmPassword,
            value
          );
          setFieldErrors((prev) => ({
            ...prev,
            confirmPassword: confirmError,
          }));
        }
      } else if (field === "confirmPassword") {
        const error = value
          ? validators.confirmPassword(value, passwordData.newPassword)
          : "";
        setFieldErrors((prev) => ({ ...prev, confirmPassword: error }));
      }
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="비밀번호 변경" size="small">
      <div className={modalForm}>
        {isSuccess ? (
          // 성공 시 UI
          <>
            <div className={modalFormGroup} style={{ textAlign: "center", padding: "2rem 0" }}>
              <p className={`${fieldMessage} ${fieldMessageSuccess}`}>
                사용자 정보가 성공적으로 수정되었습니다.
              </p>
            </div>
            <div className={modalButtons}>
              <button
                type="button"
                className={modalButton}
                onClick={onClose}
                style={{ width: "100%" }}
              >
                확인
              </button>
            </div>
          </>
        ) : (
          // 일반 입력 UI
          <>
            <div className={modalFormGroup}>
              <label className={modalFormLabel}>현재 비밀번호</label>
              <input
                type="password"
                className={modalFormInput}
                value={passwordData.currentPassword}
                onChange={handleInputChange("currentPassword")}
                placeholder="현재 비밀번호를 입력하세요"
              />
            </div>
            <div className={modalFormGroup}>
              <label className={modalFormLabel}>새 비밀번호</label>
              <input
                type="password"
                className={modalFormInput}
                value={passwordData.newPassword}
                onChange={handleInputChange("newPassword")}
                placeholder="새 비밀번호를 입력하세요"
              />
            </div>
            <div className={modalFormGroup} style={{ minHeight: "1rem" }}>
              {fieldErrors.newPassword && (
                <p className={`${fieldMessage} ${fieldMessageError}`}>
                  {fieldErrors.newPassword}
                </p>
              )}
            </div>
            <div className={modalFormGroup}>
              <label className={modalFormLabel}>비밀번호 확인</label>
              <input
                type="password"
                className={modalFormInput}
                value={passwordData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                placeholder="새 비밀번호를 다시 입력하세요"
              />
            </div>
            <div className={modalFormGroup} style={{ minHeight: "1rem" }}>
              {fieldErrors.confirmPassword && (
                <p className={`${fieldMessage} ${fieldMessageError}`}>
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* 제출 결과 메시지 */}
            <div className={modalFormGroup} style={{ minHeight: "1rem" }}>
              {submitMessage.show && (
                <p
                  className={`${fieldMessage} ${
                    submitMessage.type === "success"
                      ? fieldMessageSuccess
                      : fieldMessageError
                  }`}
                >
                  {submitMessage.text}
                </p>
              )}
            </div>

            <div className={modalButtons}>
              <button
                type="button"
                className={`${modalButton} ${cancelButton}`}
                onClick={onClose}
                disabled={isPending}
              >
                취소
              </button>
              <button
                type="button"
                className={modalButton}
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? <LoadingSpinner size={5} /> : "확인"}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
