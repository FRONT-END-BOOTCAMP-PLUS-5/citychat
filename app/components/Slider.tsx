"use client";

import React from "react";
import Slider from "react-slick";
// import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./slider.module.css";
import { CustomArrowProps } from "react-slick";

// ▶ 커스텀 화살표 컴포넌트
function NextArrow({ className, style, onClick }: CustomArrowProps) {
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: 10, zIndex: 1 }}
      onClick={onClick}
    />
  );
}

function PrevArrow({ className, style, onClick }: CustomArrowProps) {
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: 10, zIndex: 1 }}
      onClick={onClick}
    />
  );
}

export default function CenterModeCarousel() {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "40px",
        },
      },
    ],
  };

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        // right& bottom
        left: "25%",
        top: "26%",
        // 영역을 px대신 %로
        width: 1000,
        height: 450,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div className={styles.sliderContainer}>
        <Slider {...settings}>
          {/* h3 대신 이미지 사용 예 */}
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n}>
              <h3>{n}</h3>
              {/* <Image src={`/assets/slide-${n}.jpg`} alt={`slide ${n}`} fill /> */}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
