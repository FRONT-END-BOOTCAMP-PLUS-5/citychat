import { cityRegionMap } from "./cityRegionMap";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cityId = Number(searchParams.get("id"));
  const region = cityRegionMap[cityId];

  if (!region) {
    return NextResponse.json({ error: "Invalid cityId" }, { status: 400 });
  }

  const { areaCd, signguList } = region;
  const serviceKey = encodeURIComponent(process.env.TOUR_API_KEY || "");
  // 가장 최신의 정보 : 지난 달(이번 달은 정보 업데이트 전)
  const now = new Date();
  now.setMonth(now.getMonth() - 1);
  const baseYm =
    now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, "0");
  // 3개의 시군구를 병렬 fetch
  const results = await Promise.all(
    signguList.map(async ({ signguCd }: { signguCd: string }) => {
      const url = `https://apis.data.go.kr/B551011/TarRlteTarService1/areaBasedList1?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=MyApp&_type=json&baseYm=${baseYm}&areaCd=${areaCd}&signguCd=${signguCd}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.response?.body?.items?.item ?? [];
    })
  );

  // 결과를 평탄화해서 하나의 배열로 반환
  const merged = results.flat();

  return NextResponse.json(merged);
}

