"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/app/components/Modal";
import styles from "../page.module.css";

const {
  ["modal-form"]: modalForm,
  ["modal-form-group"]: modalFormGroup,
  ["modal-form-label"]: modalFormLabel,
  ["modal-form-input"]: modalFormInput,
  ["modal-form-button"]: modalFormButton,
  ["modal-input-row"]: modalInputRow,
  ["modal-edit-button"]: modalEditButton,
  ["modal-buttons"]: modalButtons,
  ["modal-button"]: modalButton,
  ["cancel-button"]: cancelButton,
  ["duplicate-message"]: duplicateMessage,
  ["duplicate-message-success"]: duplicateMessageSuccess,
  ["duplicate-message-error"]: duplicateMessageError,
} = styles;

interface NicknameChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname?: string;
  onNicknameChange: (newNickname: string) => void;
}

export default function NicknameChangeModal({
  isOpen,
  onClose,
  currentNickname = "",
  onNicknameChange,
}: NicknameChangeModalProps) {
  const [newNickname, setNewNickname] = useState("");
  const [nicknameStatus, setNicknameStatus] = useState({
    checked: false,
    isDuplicate: false,
    message: ""
  });

  // 모달이 열릴 때 현재 닉네임으로 초기화
  useEffect(() => {
    if (isOpen) {
      setNewNickname(currentNickname);
      setNicknameStatus({ checked: false, isDuplicate: false, message: "" });
    }
  }, [isOpen, currentNickname]);

  const checkNicknameDuplicate = async () => {
    if (!newNickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (newNickname === currentNickname) {
      setNicknameStatus({
        checked: true,
        isDuplicate: false,
        message: "현재 닉네임과 동일합니다."
      });
      return;
    }

    try {
      const response = await fetch(`/api/user/duplicate?field=nickname&value=${encodeURIComponent(newNickname)}`);
      const result = await response.json();

      setNicknameStatus({
        checked: true,
        isDuplicate: result.isDuplicate,
        message: result.message
      });
    } catch (error) {
      alert("중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async () => {
    if (!newNickname.trim()) return;
    
    if (newNickname === currentNickname) {
      onClose();
      return;
    }
    
    if (!nicknameStatus.checked || nicknameStatus.isDuplicate) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }
    
    try {
      await onNicknameChange(newNickname);
      onClose();
    } catch (error) {
      console.error("닉네임 변경 실패:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewNickname(e.target.value);
    setNicknameStatus({ checked: false, isDuplicate: false, message: "" });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="닉네임 변경"
      size="small"
    >
      <div className={modalForm}>
        <div className={modalFormGroup}>
          <label className={modalFormLabel}>새 닉네임</label>
          <div className={modalInputRow}>
            <input
              type="text"
              className={modalFormInput}
              value={newNickname}
              onChange={handleInputChange}
              placeholder="새 닉네임을 입력하세요"
            />
            <button
              type="button"
              className={`${modalFormButton} ${modalEditButton}`}
              onClick={checkNicknameDuplicate}
            >
              중복확인
            </button>
          </div>
          <p className={`${duplicateMessage} ${nicknameStatus.checked ? (nicknameStatus.isDuplicate ? duplicateMessageError : duplicateMessageSuccess) : ''}`}>
            {nicknameStatus.checked ? nicknameStatus.message : ''}
          </p>
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
