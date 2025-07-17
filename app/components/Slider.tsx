import React, { useState, useEffect} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./slider.module.css";
import type { CustomArrowProps } from "react-slick";
import Image from "next/image";

interface City {
  id: string;
  name: string;
  image: string;
}


const NextArrow = (props: CustomArrowProps) => {
  const { className, onClick } = props;
  return (
    <div className={`${className} ${styles.arrow} ${styles.next}`} onClick={onClick}>
      ▶
    </div>
  );
};

const PrevArrow = (props: CustomArrowProps) => {
  const { className, onClick } = props;
  return (
    <div className={`${className} ${styles.arrow} ${styles.prev}`} onClick={onClick}>
      ◀
    </div>
  );
};

export default function CenterModeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cities, setCities] = useState<City[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);


  // Supabase에서 도시 목록 불러오기 (API 라우트 사용)
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/api/cities"); // SubSlider와 동일한 API 라우트 사용
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: City[] = await response.json();
        setCities(data); // 불러온 데이터를 cities 상태에 저장
      } catch (err: unknown) {
        console.error("도시 데이터를 불러오는 중 오류 발생:", err);
        setError("도시 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchCities();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 로딩, 오류, 데이터 없음 상태 처리
  if (loading) {
    return <div className={styles.loadingState}>도시 정보를 불러오는 중...</div>;
  }
  if (error) {
    return <div className={styles.errorState}>오류: {error}</div>;
  }
  if (cities.length === 0) {
    return <div className={styles.emptyState}>표시할 도시가 없습니다.</div>;
  }


  const settings = {
    autoplay: true,
    autoplaySpeed: 4000,
    centerMode: true,
    centerPadding: "20px",
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
            {cities.map((city, i) => (
              <div key={city.id}> {/* 각 도시에 고유한 id를 key로 사용 */}
                <div className="custom-slide-wrapper">
                  <div
                    className={`${styles.card} ${
                      i === activeIndex ? styles.cardActive : ""
                    }`}
                  >
                    <h3 className={styles.cityName}>{city.name}</h3> {/* 도시 이름 */}
                    <Image src={city.image} alt={city.name} className={styles.cityImage} width={350} height={380}/>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
