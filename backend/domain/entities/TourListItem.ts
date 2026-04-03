export interface TourListItem {
  contentid: string;
  title: string;
  addr1: string;
  firstImage?: string;
  contentTypeId: number;
  areaCode: string;
  sigunguCode: string;
  mapx: string;
  mapy: string;
  tel?: string;
  cat1?: string; // 대분류 (문화/레포츠/쇼핑...)
}

export enum Language {
  KO = "ko",
  EN = "en",
}
