// app/api/tour/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";

const TOUR_API_URL = process.env.TOUR_API_URL;
const TOUR_API_AUTH_KEY = process.env.TOUR_API_AUTH_KEY;

// .env에서 가져오지 않고 직접 값을 설정
const TOUR_MOBILE_OS = "WEB"; // 원하는 OS 구분 값으로 직접 설정
const TOUR_MOBILE_APP = "CityChat"; // 원하는 서비스명(어플명)으로 직접 설정

// POST 요청 처리 함수
export async function POST(req: NextRequest) {
  // 클라이언트에서 pageNo, numOfRows, baseYm, areaCd, signguCd를 받음
  const {
    pageNo = "1",
    numOfRows = "10",
    baseYm,     // ✨ 추가된 필수 파라미터
    areaCd,     // ✨ 추가된 필수 파라미터
    signguCd    // ✨ 추가된 필수 파라미터
  } = await req.json();

  // 필수 파라미터 누락 체크 (서버 단에서 유효성 검사)
  if (!TOUR_API_AUTH_KEY) {
    console.error("환경 변수 TOUR_API_AUTH_KEY가 설정되지 않았습니다.");
    return NextResponse.json(
      { message: "서버 설정 오류: API 인증키가 누락되었습니다." },
      { status: 500 }
    );
  }

  //
  if (!baseYm || !areaCd || !signguCd) {
    return NextResponse.json(
      { message: "필수 파라미터 (baseYm, areaCd, signguCd)가 누락되었습니다." },
      { status: 400 } // Bad Request
    );
  }

  // 모든 필수 파라미터를 포함하여 fetchUrl 구성
  const fetchUrl = `${TOUR_API_URL}?serviceKey=${TOUR_API_AUTH_KEY}&pageNo=${pageNo}&numOfRows=${numOfRows}&MobileOS=${TOUR_MOBILE_OS}&MobileApp=${TOUR_MOBILE_APP}&baseYm=${baseYm}&areaCd=${areaCd}&signguCd=${signguCd}&_type=json`;

  console.log(`최종 API 호출 URL: ${fetchUrl}`);

  try {
    const response = await fetch(
      fetchUrl,
      {
        method: "GET", // 공공데이터포털 API는 대부분 GET 방식
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`공공데이터 API 호출 실패: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { message: "외부 API 호출에 실패했습니다.", details: errorText },
        { status: response.status }
      );
    }

    const data: ApiResponse = await response.json();

    if (data.header.resultCode !== "00") {
      console.error(`공공데이터 API 응답 오류: ${data.header.resultMsg}`);
      return NextResponse.json(
        { message: "공공데이터 API에서 오류 응답을 받았습니다.", details: data.header.resultMsg },
        { status: 500 }
      );
    }

    return NextResponse.json(data.body.items.item);
  } catch (error) {
    console.error("API 처리 중 오류 발생:", error);
    return NextResponse.json(
      { message: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
