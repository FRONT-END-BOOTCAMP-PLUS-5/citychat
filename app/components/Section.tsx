// Section.tsx
"use client";
import React from "react";
import Image from "next/image";
import styles from "./section.module.css";

interface SectionProps {
  bgImageUrl: string;
  children: React.ReactNode;
  style?: React.CSSProperties; // React.CSSProperties 타입을 사용하면 돼!
}

export default function Section({
  children,
  bgImageUrl, // props로 받은 bgImageUrl 사용
}: SectionProps) {
  return (
    <section
      className={styles.section}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {bgImageUrl && (
        <Image
          src={bgImageUrl} // 여기에 props로 받은 bgImageUrl이 사용됨
          alt="섹션 배경"
          fill
          quality={100}
          style={{ zIndex: -1, objectFit: "cover" }}
          priority
          sizes="100vw"
        />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </section>
  );
}
