"use client";
import { useGetCurrentUserChats } from "@/app/hooks/useGetCurrentUserChats";
import styles from "./page.module.css";
import SharedPageLayout from "@/app/SharedPageLayout";
import { useInView } from "react-intersection-observer";
import React, { useEffect } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const {
  ["page-container"]: pageContainer,
  ["content-wrapper"]: contentWrapper,
  ["menu-list"]: menuList,
  ["menu-item"]: menuItem,
} = styles;

export default function MyChatPage() {
  const { ref, inView } = useInView();
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetCurrentUserChats(10);
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
          <div className={menuList} style={{ height: "50vh", overflowY: "auto" }}>
            {data?.items && data.items.length > 0 
              ? 
              data.items.map((item) => (
                <div className={menuItem} key={item.id}>
                  {item.content}
                </div>
              ))
              : null
            }
            {hasNextPage &&
            <div ref={ref} style={{ height: "40px" }}>
              {isFetchingNextPage && <LoadingSpinner size={20} /> }
            </div>}
          </div>
        </div>
      </div>
    </SharedPageLayout>
  );
};
