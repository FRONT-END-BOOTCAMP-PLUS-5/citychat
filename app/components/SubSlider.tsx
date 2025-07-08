// Subslider.tsx
"use client";
import React, { useState, useRef } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./subSlider.css";
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

  const navSettings: Settings = {
    dots: false,
    infinite: false, // 무한 스크롤 여부. 세로 스크롤에서는 보통 false로 설정합니다.
    slidesToShow: 1, // 한 화면에 보여줄 슬라이드 개수
    slidesToScroll: 1, // 한 번에 스크롤될 슬라이드 개수
    vertical: true, // 세로 모드 활성화
    verticalSwiping: true, // 세로 스와이프 활성화
    swipeToSlide: true, // 스와이프 시 가장 가까운 슬라이드로 스냅
    centerMode: true, // 활성화된 슬라이드를 가운데로 정렬 (시각적 효과)
    centerPadding: "0px", // centerMode 사용 시 패딩
    beforeChange: (_current: number, next: number) => {
      setActiveCityIndex(next);
    },
    // 필요하다면 반응형 설정 추가
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
    <div className="app-container">
      <div className="brick-background">
        <div className="main-content-area">
          <div className="vertical-nav-container">
            <Slider {...navSettings} ref={cityNavSliderRef}>
              {cityData.map((city, index) => (
                <div
                  key={city.name}
                  className={`city-nav-item ${
                    activeCityIndex === index ? "active" : ""
                  }`}
                  onClick={() => handleCityNavClick(index)}
                >
                  {city.name}
                </div>
              ))}
            </Slider>
          </div>
          <div className="welcome-section">
            <h1>Welcome to {currentCity.name}</h1>
            <div className="content-card">
              <Image
                src={currentCity.image}
                alt={currentCity.name}
                className="card-image"
                width={400}
                height={300}
              />
              <div className="card-text-container">
                <p>{currentCity.description}</p>
                <button className="explore-button">explore</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubSlider;
