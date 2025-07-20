"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import SharedPageLayout from "@/app/SharedPageLayout";
import { useUserStore } from "@/app/stores/useUserStore";
import { Edit2, FormInput } from "lucide-react";
import NicknameChangeModal from "./components/NicknameChangeModal";
import PasswordChangeModal from "./components/PasswordChangeModal";

const {
  ["form-container"]: formContainer,
  ["profile-form"]: profileForm,
  ["form-title"]: formTitle,
  ["form-group"]: formGroup,
  ["form-label"]: formLabel,
  ["form-input"]: formInput,
  ["form-button"]: formButton,
  ["input-row"]: inputRow,
  ["edit-button"]: editButton,
  ["info-display"]: infoDisplay,
  ["modal-wrapper"]: modalWrapper,
} = styles;

export default function ProfilePage() {
  const { user } = useUserStore();
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleNicknameChange = async (newNickname: string) => {
    try {
      // TODO: API 호출로 닉네임 변경
      console.log("닉네임 변경:", newNickname);
    } catch (error) {
      console.error("닉네임 변경 실패:", error);
      throw error; // 에러를 다시 던져서 모달에서 처리하도록
    }
  };

  const handlePasswordChange = async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      // TODO: API 호출로 비밀번호 변경
      console.log("비밀번호 변경", passwordData);
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      throw error; // 에러를 다시 던져서 모달에서 처리하도록
    }
  };

  const handleEditNickname = () => {
    setIsNicknameModalOpen(true);
  };

  const handleEditPassword = () => {
    setIsPasswordModalOpen(true);
  };

  return (
    <SharedPageLayout title="My Account">
      <div className={formContainer}>
        <div className={profileForm}>
          {/* <h3 className={formTitle}>Personal Information</h3> */}
          
          <div className={formGroup}>
            <label className={formLabel}>Nickname</label>
            <div className={inputRow}>
              <input 
                className={infoDisplay}
                type="text"
                value={user?.nickname || "unknown nickname"}
                readOnly />
              <button
                type="button"
                className={`${formButton} ${editButton}`}
                onClick={handleEditNickname}
              >
                <Edit2 size={16} />
                변경
              </button>
            </div>
          </div>

          <div className={formGroup}>
            <label className={formLabel}>ID</label>
            <input 
              className={infoDisplay}
              type="text"
              value={user?.userId || "unknown ID"}
              readOnly />
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Email</label>
            <input 
              className={infoDisplay}
              type="text"
              value={user?.email || "unknown email"}
              readOnly />
          </div>

          <div className={formGroup}>
            <label className={formLabel}>Password</label>
            <div className={inputRow}>
              <button
                type="button"
                className={`${formButton} ${editButton}`}
                onClick={handleEditPassword}
              >
                <Edit2 size={16} />
                비밀번호 변경
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 닉네임 변경 모달 */}
      <div className={modalWrapper}>
        <NicknameChangeModal
          isOpen={isNicknameModalOpen}
          onClose={() => setIsNicknameModalOpen(false)}
          currentNickname={user?.nickname}
          onNicknameChange={handleNicknameChange}
        />
      </div>

      {/* 비밀번호 변경 모달 */}
      <div className={modalWrapper}>
        <PasswordChangeModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onPasswordChange={handlePasswordChange}
        />
      </div>
    </SharedPageLayout>
  );
}
