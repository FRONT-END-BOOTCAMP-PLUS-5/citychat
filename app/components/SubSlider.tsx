"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./subSlider.module.css";
import Image from "next/image";

interface City {
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
  

  // Supabase에서 도시 목록 불러오기
  // Fetch cities from the API route
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/api/cities"); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: City[] = await response.json();
        setCities(data);
      } catch (err: any) {
        console.error("도시 데이터를 불러오는 중 오류 발생:", err);
        setError("도시 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

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

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex, cities]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

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

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex, cities]);
  
  

  // 마우스 휠로 도시 전환
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let wheelTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (wheelTimeout) return;

      if (e.deltaY > 0 && activeIndex < cities.length - 1) {
        setActiveIndex((prev) => prev + 1);
      } else if (e.deltaY < 0 && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }

      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 500);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [activeIndex,cities]);

  useEffect(() => {
    const container = scrollRef.current;
    const target = container?.children[activeIndex] as HTMLElement | undefined;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeIndex, cities]);

  const handleNavClick = (index: number) => {
    setActiveIndex(index);
  };


  if (loading) {
    return <div>도시를 불러오는 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  if (cities.length === 0) {
    return <div>도시를 찾을 수 없습니다.</div>;
  }

  
  const currentCity = cities[activeIndex];

  return (
    <div className={styles.appContainer}>
      <div className={styles.brickBackground}>
        <div className={styles.mainContentArea}>
          <div className={styles.verticalNavContainer}>
            <div ref={scrollRef} className={styles.scrollSnapContainer}>
              {cities.map((city, index) => (
                <div
                  key={city.name}
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
                {/* 조건부 랜더링으로 에러를 막고 이미지가 없더라도 동작 */}
                {currentCity?.image && (
                  <Image
                    src={currentCity.image} // 전체 URL을 직접 사용
                    alt={currentCity.name}
                    width={300}
                    height={400}
                    priority
                    unoptimized
                  />
                )}
              </div>
              <div className={styles.cardTextContainer}>
                <h1>{currentCity.name}에 오신 것을 환영합니다!</h1>
                <p>{currentCity.description}</p>
                <button className={styles.exploreButton}>Explore</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubSlider;
