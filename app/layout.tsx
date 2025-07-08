import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Image from "next/image"; // img태그 사용시 경고

export const metadata: Metadata = {
  title: "CityChat",
  description: "A city chat application",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <title>Title</title>
      <body>
        <Header />
        {/* 배경 이미지 */}
        <Image
          src="/assets/background.jpg"
          alt="메인배경 이미지"
          layout="fill" // 영역에 꽉 채우게 해줌
          objectFit="cover" // 이미지가 부모 요소를 꽉 채우면서 비율을 유지
          quality={100} // 이미지 품질 (선택 사항)
          style={{ zIndex: -1 }} // 다른 요소들보다 뒤에 오도록 z-index 낮추기
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
