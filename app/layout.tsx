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
  // 배경 이미지 URL
  const ImageUrl =
    "https://miro.medium.com/v2/resize:fit:2000/1*nf5RvOUHclJqEYIljcNmEw.jpeg";

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
          src={ImageUrl}
          alt="메인배경 이미지"
          fill // 영역에 꽉 채우게 해줌
          quality={100} // 이미지 품질 (선택 사항)
          style={{ zIndex: -1, objectFit: "cover" }} // 다른 요소들보다 뒤에 오도록 z-index 낮추기
          priority
          sizes="100vw"
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
