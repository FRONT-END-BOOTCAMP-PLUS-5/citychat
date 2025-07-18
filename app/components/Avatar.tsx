"use client"
import React, { useState } from "react";
import styles from "./avatar.module.css";
// Avatar 컴포넌트가 받을 props의 타입을 정의
interface AvatarProps {
  name?: string; // 사용자 이름
  size?: number; // 아바타 크기
  textColor?: string; // 글자색
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 30,
  textColor = "#fff",
}) => {
  // 닉네임에서 한글이면 한글로 앞글자, 영어면 영어로 앞글자
  const initial = name ? name.charAt(0).toUpperCase() : "";

  // 배경 색 목록 배열
  const avatarColors = ["#8ECAE6", "#219EBC", "#023047", "#FFB703", "#FB8500"];

  // 배경색을 저장하고, 초기 렌더링 시에만 랜덤으로 설정
  const [backgroundColor] = useState(() => {
    // 처음 렌더링될 때 한 번만 실행
    return avatarColors[Math.floor(Math.random() * avatarColors.length)];
  });
  return (
    <div
      className={styles.avatarContainer}
      style={{
        width: size,
        aspectRatio: 1,
        backgroundColor: backgroundColor,
        color: textColor,
        fontSize: size / 2,
      }}
      title={name}
    >
      {initial}
    </div>
  );
};

export default Avatar;
