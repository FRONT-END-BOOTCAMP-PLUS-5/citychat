"use client";

import { useEffect, useRef } from "react";
import Slider from "./components/Slider";
import SubSlider from "./components/SubSlider";
import Section from "./components/Section";

export default function Home() {
  // 컨테이너 마우스 스크롤
  const mainScrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const container = mainScrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;
      isScrolling.current = true;

      const direction = e.deltaY > 0 ? 1 : -1;
      const sectionHeight = window.innerHeight;
      const targetScrollTop = container.scrollTop + direction * sectionHeight;

      container.scrollTo({ top: targetScrollTop, behavior: "smooth" });

      setTimeout(() => {
        isScrolling.current = false;
      }, 1500);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // 렌더링 영역
  return (
    <div
      ref={mainScrollContainerRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      <Section
        bgImageUrl="https://miro.medium.com/v2/resize:fit:2000/1*nf5RvOUHclJqEYIljcNmEw.jpeg"
        style={{ height: "100vh", scrollSnapAlign: "start" }}
      >
        <Slider />
      </Section>

      <Section
        bgImageUrl="https://uofhorang.com/wp-content/uploads/2024/08/Population-by-Age-Group-in-South-Korea-for-2023.jpg"
        style={{ height: "100vh", scrollSnapAlign: "start" }}
      >
        <SubSlider />
      </Section>
    </div>
  );
}
