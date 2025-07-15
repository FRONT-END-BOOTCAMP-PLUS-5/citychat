import React, { useState} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./slider.module.css";


const NextArrow = (props: any) => {
  const { className, onClick } = props;
  return (
    <div className={`${className} ${styles.arrow} ${styles.next}`} onClick={onClick}>
      ▶
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { className, onClick } = props;
  return (
    <div className={`${className} ${styles.arrow} ${styles.prev}`} onClick={onClick}>
      ◀
    </div>
  );
};

export default function CenterModeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const settings = {
    centerMode: true,
    centerPadding: "30px",
    slidesToShow: 3,
    infinite: true,
    arrows: true,
    speed: 500,
    afterChange: (current: number) => setActiveIndex(current),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className={styles.sliderWrap}>
      <div className={styles.sliderContainer}>
        <div className={styles.customWrapper}>
          <Slider {...settings}>
            {[1, 2, 3, 4, 5, 6].map((n, i) => (
              <div key={n}>
                <div className="custom-slide-wrapper">
                  <h3
                    className={`${styles.card} ${
                      i === activeIndex ? styles.cardActive : ""
                    }`}
                  >
                    {n}
                  </h3>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
