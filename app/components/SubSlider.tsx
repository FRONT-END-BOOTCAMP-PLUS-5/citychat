"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./subSlider.module.css";
import Image from "next/image";
import Link from "next/link";

interface City {
  id: string; 
  name: string;
  image: string; 
  description: string;
}

const SubSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Supabase에서 도시 목록 불러오기 (API 라우트 사용)
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
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 스크롤 및 휠 이벤트 처리 통합 및 최적화
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || cities.length === 0) return;

    let wheelTimeout: NodeJS.Timeout | null = null;

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
      const children = Array.from(container.children);
      const scrollTop = container.scrollTop;

      const active = children.findIndex((child) => {
        const el = child as HTMLElement;
        return el.offsetTop - scrollTop >= -10;
      });

      if (active >= 0 && active !== activeIndex) {
        setActiveIndex(active);
      }
    };
    // 휠 이벤트 핸들러 (debouncing 적용)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // 기본 스크롤 동작 방지

      if (wheelTimeout) return; // 이미 휠 이벤트 처리 중이면 무시

      if (e.deltaY > 0 && activeIndex < cities.length - 1) {
        setActiveIndex((prev) => prev + 1);
      } else if (e.deltaY < 0 && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }

      // 휠 이벤트 발생 후 500ms 동안 추가 이벤트 무시
      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 700);
    };

    container.addEventListener("scroll", handleScroll);
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [activeIndex, cities]); 

  // activeIndex 변경 시 해당 도시로 부드럽게 스크롤
  // useEffect(() => {
  //   const container = scrollRef.current;
  //   if (container && cities.length > 0) {
  //     const target = container.children[activeIndex] as HTMLElement | undefined;
  //     if (target) {
  //       target.scrollIntoView({ behavior: "smooth", block: "center" });
  //     }
  //   }
  // }, [activeIndex, cities]);
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || cities.length === 0) return;

    const target = container.children[activeIndex] as HTMLElement | undefined;
    if (target) {
      container.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
    }
  }, [activeIndex, cities]);

  // 네비게이션 클릭 핸들러
  const handleNavClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (loading) {
    return <div className={styles.loadingState}>도시를 불러오는 중...</div>;
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
          <div ref={scrollRef} className={styles.scrollSnapContainer}>
            {cities.map((city, index) => (
              <div
                key={city.id || city.name} // id가 있다면 id를 key로 사용, 없으면 name
                className={`${styles.cityNavItem} ${
                  index === activeIndex ? styles.active : ""
                }`}
                onClick={() => handleNavClick(index)}
              >
                {city.name}
              </div>
            ))}
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
              <Link href="" className={styles.exploreButton}>Explore</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubSlider;
