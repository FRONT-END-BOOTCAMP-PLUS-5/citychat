"use client";
import React, { useState, useRef, useEffect, useCallback } from "react"; // useCallback 추가
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
  const [activeCityIndex, setActiveCityIndex] = useState<number>(0);
  const cityNavSliderRef = useRef<Slider | null>(null);

  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // 마우스 드래그를 위한 상태
  const isDragging = useRef(false);
  const startY = useRef(0);
  const sliderContainerRef = useRef<HTMLDivElement>(null); // 슬라이더 컨테이너 참조

  // 휠 이벤트 핸들러
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (!cityNavSliderRef.current) return;

      if (scrollTimeout.current) return;
      scrollTimeout.current = setTimeout(() => {
        scrollTimeout.current = null;
      }, 700);

      if (event.deltaY > 0) {
        const nextIndex = (activeCityIndex + 1) % cityData.length;
        setActiveCityIndex(nextIndex);
        cityNavSliderRef.current.slickGoTo(nextIndex);
      } else {
        const prevIndex =
          (activeCityIndex - 1 + cityData.length) % cityData.length;
        setActiveCityIndex(prevIndex);
        cityNavSliderRef.current.slickGoTo(prevIndex);
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [activeCityIndex]);

  // 마우스 드래그 이벤트 핸들러
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (
      sliderContainerRef.current &&
      sliderContainerRef.current.contains(e.target as Node)
    ) {
      isDragging.current = true;
      startY.current = e.clientY;
      e.preventDefault(); // 기본 드래그 방지
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current || !cityNavSliderRef.current) return;

      const deltaY = e.clientY - startY.current;
      const dragThreshold = 50; // 이 값 이상 드래그해야 슬라이드 전환 (조절 가능)

      if (Math.abs(deltaY) > dragThreshold) {
        if (deltaY < 0) {
          // 위로 드래그 (다음 슬라이드)
          const nextIndex = (activeCityIndex + 1) % cityData.length;
          setActiveCityIndex(nextIndex);
          cityNavSliderRef.current.slickGoTo(nextIndex);
        } else {
          // 아래로 드래그 (이전 슬라이드)
          const prevIndex =
            (activeCityIndex - 1 + cityData.length) % cityData.length;
          setActiveCityIndex(prevIndex);
          cityNavSliderRef.current.slickGoTo(prevIndex);
        }
        isDragging.current = false; // 한 번 슬라이드 전환 후 드래그 상태 해제
        // startY.current = e.clientY; // 연속 드래그를 원하면 이 주석 해제
      }
    },
    [activeCityIndex]
  ); // activeCityIndex가 변경될 때마다 함수 재생성

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // 마우스 이벤트 리스너 등록 및 해제
  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  const navSettings: Settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true, // 이 설정은 터치 스크린에 더 효과적
    swipeToSlide: true, // 이 설정은 터치 스크린에 더 효과적
    centerMode: true,
    centerPadding: "0px",
    initialSlide: 0,
    beforeChange: (_c, n) => setActiveCityIndex(n),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          vertical: true,
          verticalSwiping: true,
          centerMode: false,
        },
      },
    ],
  };

  const handleCityNavClick = (index: number) => {
    if (cityNavSliderRef.current) {
      cityNavSliderRef.current.slickGoTo(index);
    }
  };

  const currentCity = cityData[activeCityIndex];

  return (
    <div className={styles.appContainer}>
      <div className={styles.brickBackground}>
        <div className={styles.mainContentArea}>
          <div className={styles.verticalNavContainer} ref={sliderContainerRef}>
            {" "}
            {/* 여기에 ref 추가 */}
            <Slider {...navSettings} ref={cityNavSliderRef}>
              {cityData.map((city, index) => (
                <div
                  key={city.name}
                  className={`${styles.cityNavItem} ${
                    activeCityIndex === index ? styles.active : ""
                  }`}
                  onClick={() => handleCityNavClick(index)}
                >
                  {city.name}
                </div>
              ))}
            </Slider>
          </div>
          <div className={styles.welcomeSection}>
            <h1>{currentCity.name}에 오신 것을 환영합니다!</h1>
            <div className={styles.contentCard}>
              <Image
                src={currentCity.image}
                alt={currentCity.name}
                className={styles.cardImage}
                width={400}
                height={300}
                priority
              />
              <div className={styles.cardTextContainer}>
                <p>{currentCity.description}</p>
                <button className={styles.exploreButton}>탐색하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubSlider;
