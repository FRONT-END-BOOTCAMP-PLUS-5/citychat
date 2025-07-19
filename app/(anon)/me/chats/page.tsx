"use client";
import { useGetCurrentUserChats } from "@/app/hooks/useGetCurrentUserChats";
import styles from "./page.module.css";
import SharedPageLayout from "@/app/SharedPageLayout";
import { useInView } from "react-intersection-observer";
import React, { useEffect, useState, useRef } from "react";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import EmptyChatList from "./components/EmptyChatList";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

const {
  ["page-container"]: pageContainer,
  ["content-wrapper"]: contentWrapper,
  ["filter-container"]: filterContainer,
  ["filter-toggle-button"]: filterToggleButton,
  ["filter-text"]: filterText,
  ["filter-icon"]: filterIcon,
  ["filter-dropdown"]: filterDropdown,
  ["filter-option"]: filterOption,
  ["menu-list"]: menuList,
  ["menu-item"]: menuItem,
  ["chat-info"]: chatInfo,
  ["chat-content"]: chatContent,
  ["filter-option-selected"]: filterOptionSelected,
} = styles;

const regions = [
  { id: "all", name: "전체" },
  { id: "1", name: "서울", chatroom_id: 1 },
  { id: "2", name: "부산", chatroom_id: 2 },
  { id: "3", name: "대전", chatroom_id: 3 },
  { id: "4", name: "강릉", chatroom_id: 4 },
  { id: "5", name: "제주", chatroom_id: 5 },
];

export default function MyChatPage() {
  const menuListRef = useRef<HTMLDivElement>(null);
  const { ref: triggerRef, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
    root: menuListRef.current, // 스크롤 컨테이너를 root로 지정
  });
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  
  const getChatRoomId = () => {
    if (selectedRegion === "all") return undefined;
    const region = regions.find(r => r.id === selectedRegion);
    return region?.chatroom_id;
  };
  
  const { data, 
    isLoading,
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage } = useGetCurrentUserChats(10, getChatRoomId());
  console.log(data);
  console.log("data", data?.items);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleChatClick = (chatId: number, chatRoomId: number) => {
    router.push(`/chatrooms/${chatRoomId}?highlight=${chatId}`);
  };

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId);
    setIsFilterOpen(false);
  };

  const getSelectedRegionName = () => {
    return regions.find(region => region.id === selectedRegion)?.name || "전체";
  };

  const formatTime = (sentAt: string) => {
    const now = new Date();
    const chatTime = new Date(sentAt);
    const diffInMinutes = Math.floor((now.getTime() - chatTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getRegionName = (chatRoomId: number) => {
    const region = regions.find(r => r.chatroom_id === chatRoomId);
    return region ? `${region.name}방` : `${chatRoomId}번방`;
  };

  return (
    <SharedPageLayout title="My chats">
      <div className={pageContainer}>
        <div className={contentWrapper}>
          <div className={filterContainer}>
            <button
              className={filterToggleButton}
              onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <span className={filterText}>{getSelectedRegionName()}</span>
              {/* <span className={filterIcon}>{isFilterOpen ? <ChevronUp /> : <ChevronDown />}</span> */}
            </button>
            {isFilterOpen && (
              <div className={filterDropdown}>
                {regions.map((region) => (
                  <button
                    key={region.id}
                    className={`${filterOption} ${selectedRegion === region.id ? filterOptionSelected : ""}`}
                    onClick={() => handleRegionSelect(region.id)}
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={menuList} ref={menuListRef}>
            { isLoading
              ? <LoadingSpinner size={10} />
              : data?.items && data.items.length > 0 
                ? data.items.map((item) => (
                  <div 
                    className={menuItem} 
                    key={item.id}
                    onClick={() => handleChatClick(item.id, item.chatRoomId)}>
                    <div className={chatContent}>
                      {item.contentType === "image" ? "📷 Image" : item.content}
                    </div>
                    <div className={chatInfo}>
                      {`${getRegionName(item.chatRoomId)} - ${formatTime(item.sentAt)}`}
                    </div>
                  </div>
                ))
                : <EmptyChatList />
            }
            {hasNextPage &&
            <div ref={triggerRef} style={{ height: "20px", width: "100%", margin: "1rem 0" }}>
              {isFetchingNextPage && <LoadingSpinner size={10} /> }
            </div>}
          </div>
        </div>
      </div>
    </SharedPageLayout>
  );
};
