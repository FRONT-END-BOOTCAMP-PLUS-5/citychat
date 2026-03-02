export interface GetTourListRequestDto {
  areaCode: string;
  sigunguCode?: string;
  contentTypeId?: number;
  pageNo: number;
  numOfRows?: number;  
}
