// import "./globals.css"; // 전역 스타일
// import Slider from "./components/Slider"; // 메인 페이지 1용 슬라이더
// import SubSlider from "./components/SubSlider"; // 메인 페이지 2용 슬라이더
// import Section from "./components/Section";
// import SnapScrollContainer from "./components/SnapScrollContainer";

// export default function Home() {
//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "100vw",
//         height: "90vh",
//         overflow: "hidden",
//       }}
//     >
//       <SnapScrollContainer containerId="firstSection">
//         <Section bgImageUrl="https://miro.medium.com/v2/resize:fit:2000/1*nf5RvOUHclJqEYIljcNmEw.jpeg">
//           <div
//             style={{
//               position: "relative",
//               zIndex: 1,
//               left: "25%",
//               top: "26%",
//               width: 1000,
//               height: 450,
//               backgroundColor: "rgba(255, 255, 255, 0.3)",
//               borderRadius: "10px",
//               overflow: "hidden",
//             }}
//           >
//             <Slider />
//           </div>
//         </Section>
//       </SnapScrollContainer>
//       <SnapScrollContainer containerId="secondSection">
//         <Section bgImageUrl="https://uofhorang.com/wp-content/uploads/2024/08/Population-by-Age-Group-in-South-Korea-for-2023.jpg">
//           <SubSlider />
//         </Section>
//       </SnapScrollContainer>
//     </div>
//   );
// }

// ---------------------------------

// 수정 후
// Home.tsx
"use client";
import { useEffect, useRef } from "react";
import "./globals.css";
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
      }, 1000);
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
        height: "90vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      <Section
        bgImageUrl="https://miro.medium.com/v2/resize:fit:2000/1*nf5RvOUHclJqEYIljcNmEw.jpeg"
        style={{ height: "90vh", scrollSnapAlign: "start" }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 1,
            left: "25%",
            top: "26%",
            width: 1000,
            height: 450,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <Slider />
        </div>
      </Section>

      <Section
        bgImageUrl="https://uofhorang.com/wp-content/uploads/2024/08/Population-by-Age-Group-in-South-Korea-for-2023.jpg"
        style={{ height: "90vh", scrollSnapAlign: "start" }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 1,
            left: "25%",
            top: "26%",
            width: 1000,
            height: 450,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <SubSlider />
        </div>
      </Section>
    </div>
  );
}
