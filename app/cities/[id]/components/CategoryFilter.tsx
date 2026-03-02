"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./categoryFilter.module.css";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <span className={styles.label}>내가 관심있을 만한 정보</span>
      <div className={styles.wrapper}>
        <button
          className={styles.button}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selectedCategory}
          <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
        </button>
        {isOpen && (
          <ul className={styles.menu}>
            {categories.map((category) => (
              <li
                key={category}
                className={styles.option}
                onClick={() => handleSelect(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
