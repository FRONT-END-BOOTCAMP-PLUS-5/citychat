"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TopTagList from "@/app/components/TopTagList";
import SharedPageLayout from "@/app/SharedPageLayout";
import { useCityStore } from "@/app/stores/useCityStore";
import ChatButton from "@/app/(anon)/cities/[id]/components/ChatButton";
import LoadingSpinner from "@/app/components/LoadingSpinner";

import styles from "./page.module.css";
import CityTourList from "./components/CityTourList";

export default function DetailPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const params = useParams();
  const cityId = Number(params.id);

  const getCityById = useCityStore((state) => state.getCityById);
  const currentCity = getCityById(cityId);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <SharedPageLayout title="로딩 중..." imgUrl="">
        <div className={styles.loadingContainer}>
          <LoadingSpinner size={10} />
        </div>
      </SharedPageLayout>
    );
  }

  return (
    <SharedPageLayout title={currentCity?.name || ""} imgUrl={currentCity?.image}>
      {currentCity ? (
        <div className={styles.container}>
          <section className={styles.section}>
            <header className={styles.header}>
              <div className={styles.chatButton}>
                <ChatButton cityId={cityId} />
              </div>
              <div className={styles.description}>
                {currentCity.description}
              </div>
            </header>
            <div className={styles.mainContainer}>
              {/* 인기 태그 목록 */}
              <div className={styles.tagsWrapper}>
                <TopTagList roomId={cityId} />
              </div>

              {/* 메인 콘텐츠: 투어 리스트 */}
              <div className={styles.mainContent}>
                <CityTourList cityId={cityId} />
              </div>
            </div>
          </section>
        </div>
      ) : (
        <LoadingSpinner size={15} />
      )}
    </SharedPageLayout>
  );
}
