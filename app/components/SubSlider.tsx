"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./subSlider.module.css";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useGetCities } from "@/hooks/useGetCities";

const SWIPE_THRESHOLD = 50;

const SubSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const { cities, isLoading, error } = useGetCities(); 

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    
    const targetItem = container.querySelector(
      `[data-index="${activeIndex}"]`
    ) as HTMLElement;

    if (targetItem) {
      targetItem.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [activeIndex]);

  // 휠 이벤트로 인덱스 변경
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || cities.length === 0) return;

    let wheelTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      // 기본 스크롤 동작 방지
      e.preventDefault();

      if (wheelTimeout) return;

      let newIndex = activeIndex;
      let handledBySubSlider = false; // SubSlider가 이 이벤트를 처리했는지 여부

      if (e.deltaY > 0) {
        // 아래로 스크롤
        if (activeIndex < cities.length - 1) {
          newIndex = activeIndex + 1;
          handledBySubSlider = true;
        }
      } else {
        // 위로 스크롤
        if (activeIndex > 0) {
          newIndex = activeIndex - 1;
          handledBySubSlider = true;
        }
      }

      if (handledBySubSlider) {
        setActiveIndex(newIndex);
        e.stopPropagation();
      }

      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 300); // 디바운스
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [activeIndex, cities]);

  // 터치 이벤트로 인덱스 변경 (모바일)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || cities.length === 0) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchStartX.current - touchEndX;
      const deltaY = touchStartY.current - touchEndY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX > 0 && activeIndex < cities.length - 1) {
          // 왼쪽으로 스와이프 (다음)
          setActiveIndex(activeIndex + 1);
        } else if (deltaX < 0 && activeIndex > 0) {
          // 오른쪽으로 스와이프 (이전)
          setActiveIndex(activeIndex - 1);
        }
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };

  }, [activeIndex, cities]);

  const handleNavClick = (index: number) => {
    setActiveIndex(index);
  };

  if (isLoading) {
    return <LoadingSpinner size={15} />;
  }
  if (error) {
    return <div className={styles.errorState}>오류: {error.message}</div>;
  }
  if (cities.length === 0) {
    return <div className={styles.emptyState}>도시를 찾을 수 없습니다.</div>;
  }

  const currentCity = cities[activeIndex];

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* 도시 네비게이션 */}
        <div className={styles.cityNav}>
          <div
            ref={scrollRef}
            className={styles.cityNavInner}
          >
            {cities.map((city, index) => (
              <div
                key={city.id || city.name}
                data-index={index}
                className={`${styles.cityNavItem} ${index === activeIndex ? styles.active : ""}`}
                onClick={() => handleNavClick(index)}
              >
                {city.name}
              </div>
            ))}
          </div>
        </div>
        {/* 도시 정보 섹션 */}
        <div className={styles.cityDetail}>
          <div className={styles.detailCard}>
            {currentCity?.image && (
              <div className={styles.imageWrapper}>
                <Image
                  src={currentCity.image}
                  alt={currentCity.name}
                  width={250}
                  height={320}
                  className={styles.cityImage}
                  priority
                  // unoptimized
                />
              </div>
            )}
            <div className={styles.textContainer}>
              <h1>{currentCity.name}에 오신 것을 환영합니다!</h1>
              <p>{currentCity.description}</p>
              <Link href={`/cities/${currentCity.id}`} scroll={false} className={styles.exploreButton}>
                Explore
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubSlider;
