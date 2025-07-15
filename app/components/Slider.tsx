import React, { useState} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./slider.module.css";

export default function CenterModeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const settings = {
    centerMode: true,
    centerPadding: "10px",
    slidesToShow: 3,
    infinite: true,
    arrows:true,
    afterChange: (current: number) => setActiveIndex(current),
  };

  return (
    <div className={styles.sliderWrap}>
      <div className={styles.sliderContainer}>
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
  );
}
