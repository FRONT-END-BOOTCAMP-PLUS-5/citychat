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
  ["modal-form-button"]: modalFormButton,
  ["modal-input-row"]: modalInputRow,
  ["modal-edit-button"]: modalEditButton,
  ["modal-buttons"]: modalButtons,
  ["modal-button"]: modalButton,
  ["cancel-button"]: cancelButton,
  ["field-message"]: fieldMessage,
  ["field-message-success"]: fieldMessageSuccess,
  ["field-message-error"]: fieldMessageError,
} = styles;

interface NicknameChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname?: string;
}

export default function NicknameChangeModal({
  isOpen,
  onClose,
  currentNickname = "",
}: NicknameChangeModalProps) {
  const { mutate: updateUser, isPending, error, isSuccess } = useUpdateUser();
  const [newNickname, setNewNickname] = useState("");
  const [validationError, setValidationError] = useState("");
  const [nicknameStatus, setNicknameStatus] = useState({
    checked: false,
    isDuplicate: false,
    message: "",
  });
  const [submitMessage, setSubmitMessage] = useState({
    show: false,
    type: "success" as "success" | "error",
    text: "",
  });

  // 모달이 열릴 때 현재 닉네임으로 초기화
  useEffect(() => {
    if (isOpen) {
      setNewNickname(currentNickname);
      setValidationError("");
      setNicknameStatus({ checked: false, isDuplicate: false, message: "" });
      setSubmitMessage({ show: false, type: "success", text: "" });
    }
  }, [isOpen, currentNickname]);

  const checkNicknameDuplicate = async () => {
    if (!newNickname.trim()) {
      setValidationError("닉네임을 입력해주세요.");
      return;
    }

    // 유효성 검증 먼저 확인
    const validationError = validators.nickname(newNickname);
    if (validationError) {
      setValidationError(validationError);
      return;
    }

    if (newNickname === currentNickname) {
      setNicknameStatus({
        checked: true,
        isDuplicate: false,
        message: "현재 닉네임과 동일합니다.",
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/user/duplicate?field=nickname&value=${encodeURIComponent(
          newNickname
        )}`
      );
      const result = await response.json();

      setNicknameStatus({
        checked: true,
        isDuplicate: result.isDuplicate,
        message: result.message,
      });
    } catch (error) {
      setNicknameStatus({
        checked: false,
        isDuplicate: false,
        message: "중복 확인 중 오류가 발생했습니다.",
      });
    }
  };

  const handleSubmit = async () => {
    if (!newNickname.trim()) return;

    if (newNickname === currentNickname) {
      onClose();
      return;
    }

    if (!nicknameStatus.checked || nicknameStatus.isDuplicate) {
      setSubmitMessage({
        show: true,
        type: "error",
        text: "닉네임 중복 확인을 해주세요.",
      });
      return;
    }

    updateUser(
      { nickname: newNickname },
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewNickname(value);
    setNicknameStatus({ checked: false, isDuplicate: false, message: "" });

    // 실시간 유효성 검증
    if (value) {
      const error = validators.nickname(value);
      setValidationError(error);
    } else {
      setValidationError("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="닉네임 변경" size="small">
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
              <label className={modalFormLabel}>새 닉네임</label>
              <div className={modalInputRow}>
                <input
                  type="text"
                  className={modalFormInput}
                  value={newNickname}
                  onChange={handleInputChange}
                  placeholder="새 닉네임을 입력하세요"
                  disabled={isPending}
                />
                <button
                  type="button"
                  className={`${modalFormButton} ${modalEditButton}`}
                  onClick={checkNicknameDuplicate}
                  disabled={isPending || !!validationError || !newNickname}
                >
                  중복확인
                </button>
              </div>
              <p
                className={`${fieldMessage} ${
                  validationError
                    ? fieldMessageError
                    : nicknameStatus.message
                    ? nicknameStatus.isDuplicate
                      ? fieldMessageError
                      : fieldMessageSuccess
                    : ""
                }`}
              >
                {validationError || nicknameStatus.message}
              </p>
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
