"use client";

import React from "react";
import styles from "./ScrollToTopButton.module.css";
import { ArrowUp } from "lucide-react";

interface ScrollToTopButtonProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export default function ScrollToTopButton({ containerRef }: ScrollToTopButtonProps) {
  const handleClick = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button className={styles.scrollToTopButton} onClick={handleClick}>
      <ArrowUp />
    </button>
  );
}
