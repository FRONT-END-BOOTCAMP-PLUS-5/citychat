// app/api/tour/route.ts
import { NextRequest, NextResponse } from "next/server";

// 요청에서 넘어오는 데이터 타입 정의
type RequestData = {
  baseYm?: string;
  areaCd?: string;
  signguCd?: string;
  pageNo?: string;
  numOfRows?: string;
};


type ApiItem = {
  rlteCtgryLclsNm?: string, // 연관 카테고리 대분류명. 제일 큰 카테고리 분류
  rlteCtgryMclsNm?: string, // 연관 카테고리 중분류명. 숙박, 음식점, 문화시설 같은 카테고리
  rlteCtgrySclsNm?: string, // 연관 카테고리 소분류명. 중분류보다 더 세분화된 카테고리 명칭
  rlteRank?: string,         // 연관 순위. 어떤 관광지랑 얼마나 연관이 높은지 순위
  baseYm?: string,           // 기준 연월. 데이터가 언제 기준으로 제공
  tAtsNm: string,           // 관광지명. 관광지 이름
  areaCd?: string,           // 지역 코드. 
  areaNm?: string,           // 지역명. 
  signguCd?: string,         // 시군구 코드. 시나 군, 구 같은 세부 행정구역 코드
  signguNm?: string,         // 시군구명. 시군구 이름
  rlteTatsNm?: string,       // 연관 관광지명. tAtsNm이랑 연관된 다른 관광지 이름
  rlteRegnCd?: string,       // 연관 지역 코드. 연관 관광지가 속한 지역 코드
  rlteRegnNm?: string,       // 연관 지역명. 연관 관광지 지역 이름
  rlteSignguCd?: string,     // 연관 시군구 코드. 연관 관광지 시군구 코드
  rlteSignguNm?: string,     // 연관 시군구명. 연관 관광지 시군구 이름
  tAtsCd?: string,           // 관광지 코드. 메인 관광지의 고유 식별 코드
  rlteTatsCd?: string      // 연관 관광지 코드. 연관 관광지의 고유 식별 코드
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

// A mapping for area names to their respective area codes
const AREA_CODES: { [key: string]: string } = {
  "seoul": "11",
  "busan": "26",
  "daejeon": "30",
  "gangwon-do": "42",
  "jeju-do": "49",
};



// GET 메서드 핸들러
export async function GET(req: NextRequest) {
  const { searchParams, pathname } = new URL(req.url);
  const cityId = searchParams.get("cityId");
  const pathSegments = pathname.split("/");
  const areaNameFromPath = pathSegments[pathSegments.length - 1]; 
  const areaCdFromPath = AREA_CODES[areaNameFromPath.toLowerCase()];
  const areaCd = searchParams.get("areaCd") || areaCdFromPath || ""; 
  const signguCd = searchParams.get("signguCd") || "";
  const pageNo = searchParams.get("pageNo") || "1";
  const numOfRows = searchParams.get("numOfRows") || "10";

  console.log(cityId);

  const serviceKey = process.env.TOUR_API_AUTH_KEY;
  if (!serviceKey) {
    return NextResponse.json({ message: "인증키가 설정되지 않았습니다." }, { status: 500 });
  }

  const encodedKey = encodeURIComponent(serviceKey);

  const fetchUrl = `https://apis.data.go.kr/B551011/TarRlteTarService1/areaBasedList1?numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=AppTest&_type=json&serviceKey=${encodedKey}&areaCd=${areaCd}&signguCd=${signguCd}`;

  try {
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API 호출 실패: HTTP Status ${response.status}, Response: ${errorText}`);
      return NextResponse.json({ message: `API 호출 실패: 서버 응답 오류 (${response.status})` }, { status: response.status});
    }

    const rawData: any = await response.json();

    if (!rawData || !rawData.response || !rawData.response.header) {
      console.error("API 응답 형식이 예상과 다릅니다:", rawData);
      const errorMessage = rawData?.message || rawData?.error_message || "알 수 없는 API 응답 형식 오류";
      return NextResponse.json({ message: `API 응답 처리 중 오류: ${errorMessage}` }, { status: 500 });
    }

    const data: ApiResponse = rawData;

    if (data.response.header.resultCode !== "0000") {
      console.error(`API 응답 오류: 코드 ${data.response.header.resultCode}, 메시지 ${data.response.header.resultMsg}`);
      return NextResponse.json({ message: data.response.header.resultMsg }, { status: 400 });
    }

    const items = Array.isArray(data.response.body.items.item)
      ? data.response.body.items.item
      : data.response.body.items.item ? [data.response.body.items.item] : [];

    return NextResponse.json(items);

  } catch (error) {
    console.error("API 호출 중 예기치 않은 오류:", error);
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ message: `요청 실패: ${errorMessage}` }, { status: 500 });
  }
}

// POST 메서드 핸들러 (GET과 동일하게 수정)
export async function POST(req: NextRequest) {
  const { areaCd, signguCd, pageNo = "1", numOfRows = "10" }: RequestData = await req.json();

  const serviceKey = process.env.TOUR_API_AUTH_KEY;
  if (!serviceKey) {
    return NextResponse.json({ message: "인증키가 설정되지 않았습니다." }, { status: 500 });
  }

  const encodedKey = encodeURIComponent(serviceKey);
  const fetchUrl = `https://apis.data.go.kr/B551011/TarRlteTarService1/areaBasedList1?numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=AppTest&_type=json&serviceKey=${encodedKey}&areaCd=${areaCd}&signguCd=${signguCd}`;

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
