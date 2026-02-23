"use client";
import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./slider.module.css";
import type { CustomArrowProps } from "react-slick";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useGetCities } from "@/hooks/useGetCities";

const NextArrow = (props: CustomArrowProps) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} ${styles.arrow} ${styles.next}`}
      onClick={onClick}
    >
      ▶
    </div>
  );
};

const PrevArrow = (props: CustomArrowProps) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} ${styles.arrow} ${styles.prev}`}
      onClick={onClick}
    >
      ◀
    </div>
  );
};

export default function CenterModeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { cities, isLoading, error } = useGetCities();

  // 로딩, 오류, 데이터 없음 상태 처리
  if (isLoading) {
    return<LoadingSpinner size={15} />;
  }
  if (error) {
    return <div className={styles.errorState}>오류: {error.message}</div>;
  }
  if (cities.length === 0) {
    return <div className={styles.emptyState}>표시할 도시가 없습니다.</div>;
  }

  const settings = {
    autoplay: true,
    autoplaySpeed: 4000,
    centerMode: true,
    centerPadding: "10px",
    slidesToShow: 3,
    infinite: true,
    arrows: true,
    speed: 400,
    afterChange: (current: number) => setActiveIndex(current),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className={styles.sliderWrap}>
      <div className={styles.sliderContainer}>
        <div className={styles.customWrapper}>
          <Slider {...settings}>
            {cities.map((city, i) => {
              // 현재 활성화된 슬라이드를 기준으로 인덱스 계산
              const totalSlides = cities.length;
              let relativeIndex = i - activeIndex;

              // 무한 루프를 고려하여 상대적 인덱스 조정
              if (settings.infinite) {
                if (relativeIndex > totalSlides / 2) {
                  relativeIndex -= totalSlides;
                } else if (relativeIndex < -totalSlides / 2) {
                  relativeIndex += totalSlides;
                }
              }

              const isLeftVisible = relativeIndex === -1; // 왼쪽 슬라이드
              const isActive = relativeIndex === 0; // 가운데 활성화된 슬라이드
              const isRightVisible = relativeIndex === 1; // 오른쪽 슬라이드
              const isBeyondVisible =
                !isActive && !isLeftVisible && !isRightVisible; // 보이는 3개 외의 슬라이드

              return (
                <div key={city.id}>
                  {" "}
                  {/* 각 도시에 고유한 id를 key로 사용 */}
                  <div className="custom-slide-wrapper">
                    {" "}
                    <Link
                      href={`/cities/${city.id}`}
                      className={styles.linkArrow}
                    >
                      <div
                        className={`${styles.card} ${
                          isActive ? styles.cardActive : ""
                        } ${isLeftVisible ? styles.cardLeftVisible : ""} ${
                          isRightVisible ? styles.cardRightVisible : ""
                        } ${isBeyondVisible ? styles.cardBehind : ""}`} // cardBehind 클래스 추가
                      >
                        <div className={styles.cityLink}>
                          <h3 className={styles.cityName}>{city.name}</h3>
                        </div>
                        <Image
                          src={city.image || "assets/citychat2.png"}
                          alt={city.name}
                          className={styles.cityImage}
                          width={350}
                          height={380}
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
}

