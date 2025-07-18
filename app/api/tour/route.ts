// app/api/tour/route.ts
import { NextRequest, NextResponse } from "next/server";

// 요청에서 넘어오는 데이터 타입 정의
type RequestData = {
  baseYm?: string;
  areaCd?: string;
  signguCd?: string;
  sigunguCd?: string;
  pageNo?: string;
  numOfRows?: string;
};


type ApiItem = {
  addr1?: string; // 주소
  addr2?: string; // 상세 주소
  areacd?: string; // 지역 코드 (숫자이지만 문자열로 올 수 있음)
  sigungucd?: string; // 시군구 코드 (숫자이지만 문자열로 올 수 있음)
  contentid?: string; // 콘텐츠 ID (고유 ID)
  contenttypeid?: string; // 콘텐츠 타입 ID (관광지, 음식점 등)
  firstimage?: string; // 대표 이미지 URL (원본)
  firstimage2?: string; // 대표 이미지 URL (썸네일)
  mapx?: string; // 경도 (X좌표, 문자열로 올 수 있음)
  mapy?: string; // 위도 (Y좌표, 문자열로 올 수 있음)
  mlevel?: string; // 지도 레벨
  tel?: string; // 전화번호
  title?: string; // 제목 (명칭)
  zipcode?: string; // 우편번호
};


type ApiResponse = {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: ApiItem[] | ApiItem;
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
};

// GET 메서드 핸들러
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const areaCd = searchParams.get("areaCd") || ""; // 예시: areaCode 파라미터
  const sigunguCd = searchParams.get("sigunguCd") || ""; // 예시: sigunguCode 파라미터
  const pageNo = searchParams.get("pageNo") || "1";
  const numOfRows = searchParams.get("numOfRows") || "10";

  const serviceKey = process.env.TOUR_API_AUTH_KEY;
  if (!serviceKey) {
    return NextResponse.json({ message: "인증키가 설정되지 않았습니다." }, { status: 500 });
  }

  const encodedKey = encodeURIComponent(serviceKey);

  const fetchUrl = `https://apis.data.go.kr/B551011/TarRlteTarService1/areaBasedList1?numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=AppTest&_type=json&serviceKey=${encodedKey}&areaCd=${areaCd}&sigunguCd=${sigunguCd}`;

  try {
    const response = await fetch(fetchUrl);

    // HTTP 응답 상태 코드 확인 (200 OK가 아니면 에러로 간주)
    if (!response.ok) {
      const errorText = await response.text(); // 오류 응답 내용을 텍스트로 확인
      console.error(`API 호출 실패: HTTP Status ${response.status}, Response: ${errorText}`);
      return NextResponse.json({ message: `API 호출 실패: 서버 응답 오류 (${response.status})` }, { status: response.status});
    }

    // JSON 응답을 먼저 'any'로 파싱하여 유연하게 에러 응답을 처리
    const rawData: any = await response.json();

    // 'response' 객체와 그 안의 'header'가 존재하는지 먼저 확인
    if (!rawData || !rawData.response || !rawData.response.header) {
      console.error("API 응답 형식이 예상과 다릅니다:", rawData);
      // 다른 형태의 에러 메시지가 있을 경우를 대비 (예: { message: "..." })
      const errorMessage = rawData?.message || rawData?.error_message || "알 수 없는 API 응답 형식 오류";
      return NextResponse.json({ message: `API 응답 처리 중 오류: ${errorMessage}` }, { status: 500 });
    }

    // 타입 가드를 통과한 후 'ApiResponse' 타입으로 안전하게 단언 (assert)
    const data: ApiResponse = rawData;

    // API 응답 코드 확인
    if (data.response.header.resultCode !== "0000") {
      console.error(`API 응답 오류: 코드 ${data.response.header.resultCode}, 메시지 ${data.response.header.resultMsg}`);
      return NextResponse.json({ message: data.response.header.resultMsg }, { status: 400 });
    }

    // items가 배열이 아닐 경우 배열로 변환 (공공데이터포털 API의 흔한 응답 패턴)
    const items = Array.isArray(data.response.body.items.item)
      ? data.response.body.items.item
      : data.response.body.items.item ? [data.response.body.items.item] : [];

    // 최종적으로 클라이언트에 JSON 데이터 반환
    return NextResponse.json(items);

  } catch (error) {
    console.error("API 호출 중 예기치 않은 오류:", error);
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ message: `요청 실패: ${errorMessage}` }, { status: 500 });
  }
}

// POST 메서드 핸들러 (GET과 동일하게 수정)
export async function POST(req: NextRequest) {
  const { areaCd, sigunguCd, pageNo = "1", numOfRows = "10" }: RequestData = await req.json();

  const serviceKey = process.env.TOUR_API_AUTH_KEY;
  if (!serviceKey) {
    return NextResponse.json({ message: "인증키가 설정되지 않았습니다." }, { status: 500 });
  }

  const encodedKey = encodeURIComponent(serviceKey);
  const fetchUrl = `https://apis.data.go.kr/B551011/TarRlteTarService1/areaBasedList1?numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=AppTest&_type=json&serviceKey=${encodedKey}&areaCd=${areaCd}&sigunguCd=${sigunguCd}`;

  try {
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API 호출 실패 (POST): HTTP Status ${response.status}, Response: ${errorText}`);
      return NextResponse.json({ message: `API 호출 실패: 서버 응답 오류 (${response.status})` }, { status: response.status});
    }

    const rawData: any = await response.json(); 

    if (!rawData || !rawData.response || !rawData.response.header) {
      console.error("API 응답 형식이 예상과 다릅니다 (POST):", rawData);
      const errorMessage = rawData?.message || rawData?.error_message || "알 수 없는 API 응답 형식 오류";
      return NextResponse.json({ message: `API 응답 처리 중 오류: ${errorMessage}` }, { status: 500 });
    }

    const data: ApiResponse = rawData; // 타입 단언

    if (data.response.header.resultCode !== "0000") {
      console.error(`API 응답 오류 (POST): 코드 ${data.response.header.resultCode}, 메시지 ${data.response.header.resultMsg}`);
      return NextResponse.json({ message: data.response.header.resultMsg }, { status: 400 });
    }

    const items = Array.isArray(data.response.body.items.item)
      ? data.response.body.items.item
      : data.response.body.items.item ? [data.response.body.items.item] : [];

    return NextResponse.json(items);

  } catch (error) {
    console.error("API 호출 중 예기치 않은 오류 (POST):", error);
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ message: `요청 실패: ${errorMessage}` }, { status: 500 });
  }
}
