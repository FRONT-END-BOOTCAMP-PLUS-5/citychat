import "./globals.css"; // 전역 스타일
import Slider from "./components/Slider"; // 슬라이더

export default function Home() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "90vh",
        overflow: "hidden",
      }}
    >
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
