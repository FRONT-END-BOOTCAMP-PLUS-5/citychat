// components/Avatar.tsx
import React from "react";
import styles from "./avatar.module.css";
// Avatar 컴포넌트가 받을 props의 타입을 정의해 줄게!
interface AvatarProps {
  name?: string; // 사용자 이름
  size?: number; // 아바타 크기
  backgroundColor?: string; // 배경색
  textColor?: string; // 글자색
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 30, // 기본 크기는 30px
  backgroundColor = "#ccc",
  textColor = "#fff",
}) => {
  // 닉네임에서 한글이면 한글로 앞글자, 영어면 영어로 앞글자
  const initial = name ? name.charAt(0).toUpperCase() : "";

  return (
    <div
      className={styles.avatarContainer} //
      style={{
        width: size,
        height: size,
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

// 원 배경 랜덤으로 보이게(구글처럼 랜덤함수 이용,피그마 색상 팔레트 참조 흰색을 제외한, 나머지 팔레트 색깔)
