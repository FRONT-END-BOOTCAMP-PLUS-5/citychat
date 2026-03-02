"use client";

import React from "react";
import styles from "./tourCard.module.css";
import { TourListItem } from "@/backend/domain/entities/TourListItem";
import Image from "next/image";
import { useGetTourDetail } from "@/app/hooks/useGetTourDetail";
import toast from "react-hot-toast"; 
import { HouseIcon, MapPinnedIcon } from "lucide-react";

interface TourCardProps {
  item: TourListItem;
}

const getContentTypeName = (contentTypeId: number): string => {
  const typeMap: Record<number, string> = {
    12: "관광지",
    14: "문화시설",
    15: "축제/공연/행사",
    25: "여행코스",
    28: "레포츠",
    32: "숙박",
    38: "쇼핑",
    39: "음식점",
  };
  return typeMap[contentTypeId] || "기타";
};

const TourCard: React.FC<TourCardProps> = ({ item }) => {
  const { prefetchTourDetail, getTourDetailWithCache } = useGetTourDetail();

  const handleMouseEnter = () => {
    prefetchTourDetail(item);
  };

  const openMap = () => {
    const url = `https://map.naver.com/p/search/${encodeURIComponent(
      `${item.title} ${item.addr1}`
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openHomepage = async () => {
    try {
      const detail = await getTourDetailWithCache(item);

      if (detail?.homepage) {
        const cleanHomepage = detail.homepage.replace(/<[^>]*>/g, "").trim();
        if (cleanHomepage) {
          window.open(cleanHomepage, "_blank", "noopener,noreferrer");
          return;
        }
      }

      toast("이 관광지는 홈페이지 정보가 없습니다.", {
        icon: "🌐",
        duration: 2000,
      });
    } catch (error) {
      console.error("Failed to fetch tour detail:", error);
      toast("홈페이지 정보를 불러올 수 없습니다.", {
        icon: "⚠️",
        duration: 2000,
      });
    }
  };

  return (
    <div 
      className={styles.card}
      onMouseEnter={handleMouseEnter}
    >
      {/* 이미지 영역 */}
      {item.firstImage ? (
        <div className={styles.imageWrapper}>
          <span className={styles.badge}>
            {getContentTypeName(item.contentTypeId)}
          </span>
          <Image
            src={item.firstImage}
            alt={item.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className={styles.noImage}>
          <span className={styles.badge}>
            {getContentTypeName(item.contentTypeId)}
          </span>
          <span>이미지 없음</span>
        </div>
      )}

      {/* 콘텐츠 영역 */}
      <div className={styles.content}>
        <div className={styles.infoSection}>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.address}>{item.addr1}</p>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.actionButton}
            data-tip="길찾기"
            onClick={openMap}
          >
            <MapPinnedIcon />
          </button>

          <button
            className={styles.actionButton}
            data-tip="홈페이지"
            onClick={openHomepage}
          >
            <HouseIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
