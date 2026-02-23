import React, { useState, useEffect } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";

interface DuplicateFieldProps {
  label: string;
  id: string;
  name: string;
  type: "text" | "email";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  field: "userId" | "nickname" | "email";
  error?: string;
  required?: boolean;
  disabled?: boolean;
  styles: Record<string, string>;
  onDuplicateResult?: (
    field: string,
    isChecked: boolean,
    isDuplicate: boolean
  ) => void;
}

export default function DuplicateField({
  label,
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  field,
  error = "",
  required = false,
  disabled = false,
  styles,
  onDuplicateResult,
}: DuplicateFieldProps) {
  const [duplicateStatus, setDuplicateStatus] = useState({
    checked: false,
    isDuplicate: false,
    message: "",
  });
  const [isChecking, setIsChecking] = useState(false);

  // value가 변경되면 중복확인 상태 초기화
  useEffect(() => {
    setDuplicateStatus({ checked: false, isDuplicate: false, message: "" });
    setIsChecking(false);
    if (onDuplicateResult) {
      onDuplicateResult(field, false, false);
    }
  }, [value, field, onDuplicateResult]);

  async function handleDuplicateCheck() {
    if (!value.trim()) {
      setDuplicateStatus({
        checked: true,
        isDuplicate: true,
        message: `${field === "userId" ? "아이디" : field === "nickname" ? "닉네임" : "이메일"}를 입력해주세요.`
      });
      return;
    }

    if (error) {
      setDuplicateStatus({
        checked: true,
        isDuplicate: true,
        message: "먼저 입력 오류를 수정해주세요."
      });
      return;
    }

    setIsChecking(true);

    try {
      const response = await fetch(
        `/api/user/duplicate?field=${field}&value=${encodeURIComponent(value)}`
      );
      const result = await response.json();

      setDuplicateStatus({
        checked: true,
        isDuplicate: result.isDuplicate,
        message: result.message,
      });

      if (onDuplicateResult) {
        onDuplicateResult(field, true, result.isDuplicate);
      }
    } catch (error) {
      setDuplicateStatus({
        checked: true,
        isDuplicate: true,
        message: error instanceof Error ? error.message : "중복 확인 중 오류가 발생했습니다.",
      });

      if (onDuplicateResult) {
        onDuplicateResult(field, true, true);
      }
    } finally {
      setIsChecking(false);
    }
  }
  const {
    ["form-group"]: formGroup,
    ["form-label"]: formLabel,
    ["form-input"]: formInput,
    ["form-button"]: formButton,
    ["input-row"]: inputRow,
    ["duplicate-check-button"]: duplicateCheckButton,
    ["duplicate-message"]: duplicateMessageClass,
    ["duplicate-message-success"]: duplicateMessageSuccess,
    ["duplicate-message-error"]: duplicateMessageError,
  } = styles;

  return (
    <>
      <div className={formGroup}>
        <label htmlFor={id} className={formLabel}>
          {label}
        </label>
        <div className={inputRow}>
          <input
            type={type}
            id={id}
            name={name}
            className={formInput}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
          />
          <button
            type="button"
            className={`${formButton} ${duplicateCheckButton}`}
            onClick={handleDuplicateCheck}
            disabled={disabled || isChecking}
          >
            {isChecking ? <LoadingSpinner size={8} /> : "중복확인"}
          </button>
        </div>
      </div>
      <div className={formGroup}>
        <p
          className={`${duplicateMessageClass} ${
            error
              ? duplicateMessageError
              : duplicateStatus.checked
                ? duplicateStatus.isDuplicate
                  ? duplicateMessageError
                  : duplicateMessageSuccess
                : ""
          }`}
        >
          {error || (duplicateStatus.checked ? duplicateStatus.message : "")}
        </p>
      </div>
    </>
  );
}
