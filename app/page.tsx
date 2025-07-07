import Slider from "./components/Slider"; // 슬라이더
import Image from "next/image"; // img태그 사용시 경고

export default function Home() {
  return (
    <div>
      <Slider />

      <Image
        src="/assets/background.jpg"
        alt="메인배경 이미지"
        width={1920}
        height={1080}
      />
    </div>
  );
}
