"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/app/components/Modal";
import styles from "../page.module.css";

const {
  ["modal-form"]: modalForm,
  ["modal-form-group"]: modalFormGroup,
  ["modal-form-label"]: modalFormLabel,
  ["modal-form-input"]: modalFormInput,
  ["modal-buttons"]: modalButtons,
  ["modal-button"]: modalButton,
  ["cancel-button"]: cancelButton,
} = styles;

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordChange: (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
}

export default function PasswordChangeModal({
  isOpen,
  onClose,
  onPasswordChange,
}: PasswordChangeModalProps) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await onPasswordChange(passwordData);
      onClose();
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
    }
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
            onChange={handleInputChange('currentPassword')}
            placeholder="현재 비밀번호를 입력하세요"
          />
        </div>
        <div className={modalFormGroup}>
          <label className={modalFormLabel}>새 비밀번호</label>
          <input
            type="password"
            className={modalFormInput}
            value={passwordData.newPassword}
            onChange={handleInputChange('newPassword')}
            placeholder="새 비밀번호를 입력하세요"
          />
        </div>
        <div className={modalFormGroup}>
          <label className={modalFormLabel}>비밀번호 확인</label>
          <input
            type="password"
            className={modalFormInput}
            value={passwordData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            placeholder="새 비밀번호를 다시 입력하세요"
          />
        </div>
        <div className={modalButtons}>
          <button
            type="button"
            className={`${modalButton} ${cancelButton}`}
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className={modalButton}
            onClick={handleSubmit}
          >
            변경
          </button>
        </div>
      </div>
    </Modal>
  );
}
