// api/tour/route.ts의 타입 명시

export interface ApiItem {
  contentid?: string; 
  title?: string; 
  rlteCtgryMclsNm: string;
  rlteCtgrySclsNm: string;
  rlteRank: string;
  baseYm: string;
  tAtsNm: string;
  areaCd: string;
  areaNm: string;
  signguCd: string;
  signguNm: string;
  rlteTatsNm: string;
  rlteRegnCd: string;
  rlteRegnNm: string;
  rlteSignguCd: string;
  rlteSignguNm: string;
  rlteCtgryLclsNm: string;
  tAtsCd: string;
  rlteTatsCd: string;
}

export interface ApiResponse {
  header: {
    resultCode: string;
    resultMsg: string;
  };
  body: {
    pageNo: number;
    totalCount: number;
    items: {
    //   item: ApiItem; // 단일 item일 경우
      // 배열 item일 경우 아래 둘 중 하나로 변경 
      item: ApiItem[] | ApiItem;
      // items: ApiItem[];
    };
    numOfRows: number;
  };
}
