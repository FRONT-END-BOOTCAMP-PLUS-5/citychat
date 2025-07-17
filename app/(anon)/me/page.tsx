"use client"
import SharedPageLayout from "@/app/SharedPageLayout";
import styles from "./page.module.css";
import React from "react";
import { useUserStore } from "@/app/stores/useUserStore";
import Avatar from "@/app/components/Avatar";
import { ChevronRight, MessagesSquare, User } from 'lucide-react';

const {
  ["page-container"]: pageContainer,
  ["content-wrapper"]: contentWrapper,
  ["mobile-avatar-container"]: mobileAvatarContainer,
  ["profile-section"]: profileSection,
  ["nickname"]: nickname,
  ["menu-list"]: menuList,
  ["menu-item"]: menuItem,
  ["menu-icon"]: menuIcon,
  ["menu-text"]: menuText,
  ["menu-arrow"]: menuArrow,
} = styles;

export default function mePage() {
  const user = useUserStore((state) => state.user); // 유저 정보 데이터
  
  return (
    <SharedPageLayout title="My page">
      <div className={pageContainer}>
        <div className={contentWrapper}>
          <div className={mobileAvatarContainer}>
            <div className={profileSection}>
              <Avatar name={user?.nickname} size={80} />
              <div className={nickname}>
                {user?.nickname || "Guest User"}
              </div>
            </div>
          </div>
          <div className={menuList}>
            <div className={menuItem}>
              <div className={menuIcon}>
                <User />
              </div>
              <span className={menuText}>Manage Account</span>
              <div className={menuArrow}>
                <ChevronRight />
              </div>
            </div>
            <div className={menuItem}>
              <div className={menuIcon}>
                <MessagesSquare />
              </div>
              <span className={menuText}>My chats</span>
              <div className={menuArrow}>
                <ChevronRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SharedPageLayout>
  );
};

