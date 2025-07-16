import { NextRequest, NextResponse } from "next/server";

// 요청에서 넘어오는 데이터 타입 정의
type RequestData = {
  baseYm: string;
  areaCd: string;
  signguCd: string;
};

// API 응답 item의 필드 타입 정의
type ApiItem = {
  baseYm: string;
  tAtsCd: string;
  tAtsNm: string;
  areaCd: string;
  areaNm: string;
  signguCd: string;
  signguNm: string;
  rlteTatsCd: string;
  rlteTatsNm: string;
  rlteRegnCd: string;
  rlteRegnNm: string;
  rlteSignguCd: string;
  rlteSignguNm: string;
  rlteCtgryLclsNm: string;
  rlteCtgryMclsNm: string;
  rlteCtgrySclsNm: string;
  rlteRank: string;
};

// 전체 API 응답 타입 정의
type ApiResponse = {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: ApiItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
};

// POST 메서드 핸들러
export async function POST(req: NextRequest) {
  const { baseYm, areaCd, signguCd }: RequestData = await req.json();

  const serviceKey = process.env.TOUR_API_AUTH_KEY;
  if (!serviceKey) {
    return NextResponse.json({ message: "인증키가 설정되지 않았습니다." }, { status: 500 });
  }

  const encodedKey = encodeURIComponent(serviceKey);
  const fetchUrl = `https://apis.data.go.kr/B551011/TarRlteTarService1/getTarRlteTarList?baseYm=${baseYm}&areaCd=${areaCd}&signguCd=${signguCd}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&serviceKey=${encodedKey}`;  try {
    const response = await fetch(fetchUrl);
    const data: ApiResponse = await response.json();

    // 응답코드 확인 후 조건 처리 (예: 실패 시 메시지 전달)
    if (data.response.header.resultCode !== "0000") {
      return NextResponse.json({ message: data.response.header.resultMsg }, { status: 400 });
    }

    const items: ApiItem[] = data.response.body.items.item;
    return NextResponse.json(items);
  } catch (error) {
    console.error("API 호출 오류:", error);
    return NextResponse.json({ message: "요청 실패" }, { status: 500 });
  }
}
