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
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      <Section
        bgImageUrl="https://images.unsplash.com/photo-1603883055407-968560f7522e?q=80&w=920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        style={{
          height: "100vh",
          scrollSnapAlign: "start",
          position: "relative",
          backgroundSize: "cover",
          backgroundPosition: "top", // ✅ 여기를 추가
          backgroundRepeat: "no-repeat",
        }}
      >
        <Slider />
      </Section>

      <Section
        bgImageUrl="https://images.unsplash.com/photo-1603883055407-968560f7522e?q=80&w=920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        style={{ height: "100vh", scrollSnapAlign: "start" }}
      >
        <SubSlider />
      </Section>
    </div>
  );
}

