import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// 서버에서 반환될 조인된 이미지 데이터의 실제 형태를 반영하는 인터페이스 추가
interface ImageRecord {
  storage_path: string;
}

// 클라이언트에 보낼 City 데이터의 형태
interface FormattedCity {
  id: string; // 데이터 아이디
  name: string; // 지역 명
  description: string; // 내용
  image: string; // 이미지 URL
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cities")
    .select("id, name, description, images(storage_path)");

  // 에러 처리
  if (error) {
    console.error("도시 정보를 가져오는 중 오류 발생:", error);
    return NextResponse.json({ error: "도시 정보를 가져오지 못했습니다." }, { status: 500 });
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!SUPABASE_URL) {
    console.error("환경 변수 NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.");
    return NextResponse.json(
      { error: "서버 설정 오류: Supabase URL이 정의되지 않았습니다. .env.local 파일을 확인해주세요." },
      { status: 500 }
    );
  }

  const getPublicImageUrl = (bucket: string, path: string) => {
    if (!path) {
      console.warn("이미지 경로가 비어 있습니다.");
      return "";
    }
    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
  };

  const citiesWithImageUrls: FormattedCity[] = data.map((city: {
      id: string;
      name: string;
      description: string;
      images: ImageRecord[];
  }) => {
    let imageUrl = "";
    if (city.images) {
      const fullPath = city.images.storage_path;
      const bucketName = "citychat-img";
      let relativePath = fullPath;
      if (fullPath.startsWith(bucketName)) {
        relativePath = fullPath.substring(bucketName.length + 1);
      }
      imageUrl = getPublicImageUrl(bucketName, relativePath);
    }

    return {
      id: city.id,
      name: city.name,
      description: city.description,
      image: imageUrl,
    };
  });

  return NextResponse.json(citiesWithImageUrls);
}
