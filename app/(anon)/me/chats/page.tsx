"use client";
import { useGetCurrentUserChatList } from "@/app/hooks/useGetCurrentUserChatList";
import styles from "./page.module.css";
import SharedPageLayout from "@/app/SharedPageLayout";
import { useInView } from "react-intersection-observer";
import React, { useEffect } from "react";

const {
  ["page-container"]: pageContainer,
  ["content-wrapper"]: contentWrapper,
  ["menu-list"]: menuList,
  ["menu-item"]: menuItem,
} = styles;

export default function UserChatListPage() {
  const { ref, inView } = useInView();
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetCurrentUserChatList(10);
  console.log(data);
  console.log("hasNextPage", hasNextPage);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <SharedPageLayout title="My chats">
      <div className={pageContainer}>
        <div className={contentWrapper}>
          <div className={menuList}>
            {data?.chats && data.chats.length > 0 
              ? 
              data.chats.map((chat) => (
                <div className={menuItem} key={chat.id}>
                  {chat.content}
                </div>
              ))
              : null
            }
            {hasNextPage &&
            <div ref={ref} style={{ height: "5px" }}>
              {isFetchingNextPage && "isLoading..."}
            </div>}
          </div>
        </div>
      </div>
    </SharedPageLayout>
  );
};
