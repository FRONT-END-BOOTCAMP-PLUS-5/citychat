import React from "react";

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type: "text" | "email" | "password";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  styles: Record<string, string>;
}

export default function FormField({
  label,
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  error = "",
  required = false,
  disabled = false,
  styles
}: FormFieldProps) {
  const {
    ["form-group"]: formGroup,
    ["form-label"]: formLabel,
    ["form-input"]: formInput,
    ["duplicate-message"]: duplicateMessage,
    ["duplicate-message-error"]: duplicateMessageError,
  } = styles;

  return (
    <>
      <div className={formGroup}>
        <label htmlFor={id} className={formLabel}>{label}</label>
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
      </div>
      <div className={formGroup}>
        <p className={`${duplicateMessage} ${error ? duplicateMessageError : ""}`}>
          {error}
        </p>
      </div>
    </>
  );
}
