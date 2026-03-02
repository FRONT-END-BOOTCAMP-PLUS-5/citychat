"use client";

import { useState, useRef, useEffect } from "react";
import { regionCodeMap } from "@/app/constants/regionCodes";
import styles from "./SigunguDropdown.module.css";

interface Props {
  cityId: string;
  value?: string;
  onChange: (value?: string) => void;
  disabled?: boolean;
}

export function SigunguDropdown({ cityId, value, onChange, disabled }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const region = regionCodeMap.find((r) => String(r.dbCityId) === cityId);
  const districts = region?.districts ?? [];

  const selectedDistrict = districts.find(
    (d) => d.korServiceSignguCode === value
  );
  const displayText = selectedDistrict?.nameKo ?? "전체";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue || undefined);
    setIsOpen(false);
  };

  return (
    <div className={styles.filterContainer} ref={dropdownRef}>
      <button
        className={styles.filterToggleButton}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={styles.filterText}>{displayText}</span>
      </button>
      {isOpen && (
        <div className={styles.filterDropdown}>
          <button
            className={`${styles.filterOption} ${!value ? styles.filterOptionSelected : ""}`}
            onClick={() => handleSelect("")}
          >
            전체
          </button>
          {districts.map((district) => (
            <button
              key={district.korServiceSignguCode}
              className={`${styles.filterOption} ${
                value === district.korServiceSignguCode ? styles.filterOptionSelected : ""
              }`}
              onClick={() => handleSelect(district.korServiceSignguCode)}
            >
              {district.nameKo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
