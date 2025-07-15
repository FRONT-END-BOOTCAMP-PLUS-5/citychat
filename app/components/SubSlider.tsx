"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./subSlider.module.css";
import Image from "next/image";

interface City {
  name: string;
  image: string;
  description: string;
}

const cityData: City[] = [
  {
    name: "Seoul",
    image: "https://via.placeholder.com/400x300/F0F0F0/000000?text=Seoul+Image",
    description:
      "서울은 대한민국의 수도이자 아시아에서 가장 활기차고 현대적인 도시 중 하나입니다.",
  },
  {
    name: "Busan",
    image: "https://via.placeholder.com/400x300/F0F0F0/000000?text=Busan+Image",
    description:
      "부산은 대한민국의 대형 항구 도시로, 해변, 산, 사찰로 유명합니다.",
  },
  {
    name: "Ulsan",
    image: "https://via.placeholder.com/400x300/F0F0F0/000000?text=Ulsan+Image",
    description:
      "울산은 대한민국의 산업 중심지로, 자동차 및 조선업으로 유명합니다.",
  },
  {
    name: "Jeju",
    image: "https://via.placeholder.com/400x300/F0F0F0/000000?text=Jeju+Image",
    description:
      "제주도는 화산섬으로, 인기 있는 휴양지이자 유네스코 세계유산입니다.",
  },
];

const SubSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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
  }, [activeIndex]);

  // 마우스 휠로 도시 전환
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let wheelTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (wheelTimeout) return;

      if (e.deltaY > 0 && activeIndex < cityData.length - 1) {
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
  }, [activeIndex]);

  useEffect(() => {
    const container = scrollRef.current;
    const target = container?.children[activeIndex] as HTMLElement | undefined;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeIndex]);

  const handleNavClick = (index: number) => {
    setActiveIndex(index);
  };

  const currentCity = cityData[activeIndex];

  return (
    <div className={styles.appContainer}>
      <div className={styles.brickBackground}>
        <div className={styles.mainContentArea}>
          <div className={styles.verticalNavContainer}>
            <div ref={scrollRef} className={styles.scrollSnapContainer}>
              {cityData.map((city, index) => (
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
                <Image
                  src={currentCity.image}
                  alt={currentCity.name}
                  className={styles.cardImage}
                  width={300}
                  height={400}
                  priority
                  unoptimized
                />
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
