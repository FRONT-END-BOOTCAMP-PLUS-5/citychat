"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./subSlider.module.css";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/app/components/LoadingSpinner";


interface City {
  id: string;
  name: string;
  image: string;
  description: string;
}

const ITEM_HEIGHT = 35;
const ITEM_GAP = 10;
const SLIDE_HEIGHT = ITEM_HEIGHT + ITEM_GAP;

const SubSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/api/cities");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: City[] = await response.json();
        setCities(data);
      } catch (err: unknown) {
        console.error("도시 데이터를 불러오는 중 오류 발생:", err);
        setError("도시 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

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
        e.stopPropagation(); // SubSlider가 스크롤을 처리했으므로 이벤트 전파 중지
      } else {
        // SubSlider가 더 이상 스크롤할 수 없는 경우 (맨 위 또는 맨 아래)
        // 이벤트를 상위 (Home 컴포넌트)로 전파하도록 허용
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

  const handleNavClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (loading) {
    return <LoadingSpinner size={15} />;
  }
  if (error) {
    return <div className={styles.errorState}>오류: {error}</div>;
  }
  if (cities.length === 0) {
    return <div className={styles.emptyState}>도시를 찾을 수 없습니다.</div>;
  }

  const currentCity = cities[activeIndex];

  return (
    <div className={styles.appContainer}>
      <div className={styles.mainContentArea}>
        <div className={styles.verticalNavContainer}>
          <div className={styles.scrollSnapContainer}>
            <div
              ref={scrollRef}
              className={styles.scrollInner}
              style={{
                transform: `translateY(-${activeIndex * SLIDE_HEIGHT}px)`,
                transition: "transform 0.3s ease",
              }}
            >
              {cities.map((city, index) => (
                <div
                  key={city.id || city.name}
                  className={`${styles.cityNavItem} ${index === activeIndex ? styles.active : ""}`}
                  onClick={() => handleNavClick(index)}
                >
                  {city.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.welcomeSection}>
          <div className={styles.contentCard}>
            <div className={styles.imageWrapper}>
              {currentCity?.image && (
                <Image
                  src={currentCity.image}
                  alt={currentCity.name}
                  width={250}
                  height={320}
                  priority
                  unoptimized
                />
              )}
            </div>
            <div className={styles.cardTextContainer}>
              <h1>{currentCity.name}에 오신 것을 환영합니다!</h1>
              <p>{currentCity.description}</p>
              <Link href={`/cities/${currentCity.id}`} className={styles.exploreButton}>
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
