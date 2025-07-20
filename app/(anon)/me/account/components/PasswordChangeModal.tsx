"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/app/components/Modal";
import styles from "../page.module.css";
import { useUpdateUser } from "@/app/hooks/useUpdateUser";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const {
  ["modal-form"]: modalForm,
  ["modal-form-group"]: modalFormGroup,
  ["modal-form-label"]: modalFormLabel,
  ["modal-form-input"]: modalFormInput,
  ["modal-buttons"]: modalButtons,
  ["modal-button"]: modalButton,
  ["cancel-button"]: cancelButton,
  ["duplicate-message"]: duplicateMessage,
  ["duplicate-message-success"]: duplicateMessageSuccess,
  ["duplicate-message-error"]: duplicateMessageError,
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
  const [submitMessage, setSubmitMessage] = useState({
    show: false,
    type: "success" as "success" | "error",
    text: ""
  });

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSubmitMessage({ show: false, type: "success", text: "" });
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setSubmitMessage({
        show: true,
        type: "error",
        text: "모든 필드를 입력해주세요."
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSubmitMessage({
        show: true,
        type: "error",
        text: "새 비밀번호가 일치하지 않습니다."
      });
      return;
    }

    updateUser({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }, {
      onSuccess: () => {
        setSubmitMessage({
          show: true,
          type: "success",
          text: "사용자 정보가 성공적으로 수정되었습니다."
        });
      },
      onError: (error) => {
        setSubmitMessage({
          show: true,
          type: "error",
          text: error.message || "사용자 정보 수정에 실패했습니다."
        });
      }
    });
  };

  const handleInputChange = (field: keyof typeof passwordData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="비밀번호 변경"
      size="small"
    >
      <div className={modalForm}>
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
        
        {/* 제출 결과 메시지 */}
        {submitMessage.show && (
          <div className={modalFormGroup}>
            <p className={`${duplicateMessage} ${submitMessage.type === "success" ? duplicateMessageSuccess : duplicateMessageError}`}>
              {submitMessage.text}
            </p>
          </div>
        )}

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
      </div>
    </Modal>
  );
}
