// components/Avatar.tsx
import React from "react";
import styles from "./avatar.module.css";
// Avatar 컴포넌트가 받을 props의 타입을 정의
interface AvatarProps {
  name?: string; // 사용자 이름
  size?: number; // 아바타 크기
  backgroundColor?: string; // 배경색
  textColor?: string; // 글자색
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 30,
  textColor = "#fff",
}) => {
  // 이름에서 첫 글자를 추출
  const initial = name ? name.charAt(0).toUpperCase() : "";

  // 배경 색 목록 배열
  const avatarColors = ["#8ECAE6", "#219EBC", "#023047", "#FFB703", "FB8500"];

  // 배경 색 랜덤
  const randomBackgroundColor =
    avatarColors[Math.floor(Math.random() * avatarColors.length)];

  return (
    <div
      className={styles.avatarContainer}
      style={{
        width: size,
        height: size,
        backgroundColor: randomBackgroundColor,
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
