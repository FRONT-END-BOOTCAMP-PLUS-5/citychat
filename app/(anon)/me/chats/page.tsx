"use client";
import { useGetCurrentUserChatList } from "@/app/hooks/useGetCurrentUserChatList";
import styles from "./page.module.css";
import SharedPageLayout from "@/app/SharedPageLayout";
import React from "react";

const {
  ["page-container"]: pageContainer,
  ["content-wrapper"]: contentWrapper,
  ["menu-list"]: menuList,
  ["menu-item"]: menuItem,
} = styles;

export default function UserChatListPage() {
  const { data, fetchNextPage, hasNextPage } = useGetCurrentUserChatList(10);

  console.log("data: ", data);

  return (
    <SharedPageLayout title="My chats">
      <div className={pageContainer}>
        <div className={contentWrapper}>
          <div className={menuList}>
            <div className={menuItem}>
              
            </div>
            <div className={menuItem}>
              
            </div>
          </div>
        </div>
      </div>
    </SharedPageLayout>
  );
};
