import "./globals.css"; // 전역 스타일
import Image from "next/image"; // img태그 사용시 경고
import Slider from "./components/Slider"; // 슬라이더

export default function Home() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 배경 이미지 */}
      <Image
        src="/assets/background.jpg"
        alt="메인배경 이미지"
        layout="fill" // 영역에 꽉 채우게 해줌
        objectFit="cover" // 이미지가 부모 요소를 꽉 채우면서 비율을 유지
        quality={100} // 이미지 품질 (선택 사항)
        style={{ zIndex: -1 }} // 다른 요소들보다 뒤에 오도록 z-index 낮추기
      />

      {/* 크로셀 슬라이드 */}
      <div
        style={{
          position: "relative", // 부모 요소에 상대 위치 지정
          zIndex: 1,
          left: "60%",
          top: "44%",
          width: 500,
          height: 300,
          backgroundColor: "rgba(255, 255, 255, 0.3)", // 반투명 흰색 배경
          borderRadius: "10px", // 모서리 둥글게
          overflow: "hidden", // 카드들이 튀어나오는 것을 방지
          paddingTop: "25px", // 상단 패딩
        }}
      >
        <Slider />
      </div>
    </div>
  );
}
