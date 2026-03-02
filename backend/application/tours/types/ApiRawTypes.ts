export interface TourApiResponse<TItem> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: { item: TItem | TItem[] };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// KorService2 areaBasedList2 응답 item
export interface KorItem {
  lclsSystm3: string;
  firstimage: string;
  firstimage2: string;
  mapx: string;
  mapy: string;
  mlevel: string;
  addr2: string;
  areacode: string;
  modifiedtime: string;
  cpyrhtDivCd: string;
  cat1: string;
  sigungucode: string;
  tel: string;
  title: string;
  addr1: string;
  cat2: string;
  cat3: string;
  contentid: string;
  contenttypeid: string;
  createdtime: string;
  zipcode: string;
  lDongRegnCd: string;
  lDongSignguCd: string;
  lclsSystm1: string;
  lclsSystm2: string;
}

// KorPetTourService areaBasedList 응답 item
export interface PetItem {
  cpyrhtDivCd: string;
  contentid: string;
  contenttypeid: string;
  title: string;
  createdtime: string;
  modifiedtime: string;
  tel: string;
  cat1: string;
  cat2: string;
  cat3: string;
  zipcode: string;
  addr1: string;
  addr2: string;
  areacode: string;
  sigungucode: string;
  mapx: string;
  mapy: string;
  mlevel: string;
  firstimage: string;
  firstimage2: string;
}

export type TourItemType = KorItem | PetItem;

export interface TourDetailRaw {
  contentid: string;
  title: string;
  homepage?: string;
  overview: string;
  tel: string;
  telname: string;
  firstimage?: string;
  addr1: string;
  restdate?: string;
}
