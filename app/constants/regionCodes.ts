export interface DistrictCode {
  nameKo: string;
  nameEn: string;
  korServiceSignguCode: string;
  tarServiceSignguCode: string;
  petServiceSignguCode: string;
  engServiceSignguCode: string;
}

export interface RegionCode {
  id: number; // 한국관광공사 api에서 받아오는 정보의 id 값
  dbCityId: number; // table에 저장되어 있는 도시 id
  nameKo: string;
  nameEn: string;
  displayNameKo?: string;
  displayNameEn?: string;
  korServiceAreaCode: string;
  tarServiceAreaCode: string;
  petServiceAreaCode: string;
  engServiceAreaCode: string;
  districts: DistrictCode[];
}

export const regionCodeMap: RegionCode[] = [
  {
    "id": 1,
    "dbCityId": 1, 
    "nameKo": "서울",
    "nameEn": "Seoul",
    "korServiceAreaCode": "1",
    "tarServiceAreaCode": "11",
    "petServiceAreaCode": "1",
    "engServiceAreaCode": "1",
    "districts": [
      {
        "nameKo": "강남구",
        "nameEn": "Gangnam-gu",
        "korServiceSignguCode": "1",
        "tarServiceSignguCode": "11680",
        "petServiceSignguCode": "1",
        "engServiceSignguCode": "1"
      },
      {
        "nameKo": "강동구",
        "nameEn": "Gangdong-gu",
        "korServiceSignguCode": "2",
        "tarServiceSignguCode": "11740",
        "petServiceSignguCode": "2",
        "engServiceSignguCode": "2"
      },
      {
        "nameKo": "강북구",
        "nameEn": "Gangbuk-gu",
        "korServiceSignguCode": "3",
        "tarServiceSignguCode": "11305",
        "petServiceSignguCode": "3",
        "engServiceSignguCode": "3"
      },
      {
        "nameKo": "강서구",
        "nameEn": "Gangseo-gu",
        "korServiceSignguCode": "4",
        "tarServiceSignguCode": "11500",
        "petServiceSignguCode": "4",
        "engServiceSignguCode": "4"
      },
      {
        "nameKo": "관악구",
        "nameEn": "Gwanak-gu",
        "korServiceSignguCode": "5",
        "tarServiceSignguCode": "11620",
        "petServiceSignguCode": "5",
        "engServiceSignguCode": "5"
      },
      {
        "nameKo": "광진구",
        "nameEn": "Gwangjin-gu",
        "korServiceSignguCode": "6",
        "tarServiceSignguCode": "11215",
        "petServiceSignguCode": "6",
        "engServiceSignguCode": "6"
      },
      {
        "nameKo": "구로구",
        "nameEn": "Guro-gu",
        "korServiceSignguCode": "7",
        "tarServiceSignguCode": "11530",
        "petServiceSignguCode": "7",
        "engServiceSignguCode": "7"
      },
      {
        "nameKo": "금천구",
        "nameEn": "Geumcheon-gu",
        "korServiceSignguCode": "8",
        "tarServiceSignguCode": "11545",
        "petServiceSignguCode": "8",
        "engServiceSignguCode": "8"
      },
      {
        "nameKo": "노원구",
        "nameEn": "Nowon-gu",
        "korServiceSignguCode": "9",
        "tarServiceSignguCode": "11350",
        "petServiceSignguCode": "9",
        "engServiceSignguCode": "9"
      },
      {
        "nameKo": "도봉구",
        "nameEn": "Dobong-gu",
        "korServiceSignguCode": "10",
        "tarServiceSignguCode": "11320",
        "petServiceSignguCode": "10",
        "engServiceSignguCode": "10"
      },
      {
        "nameKo": "동대문구",
        "nameEn": "Dongdaemun-gu",
        "korServiceSignguCode": "11",
        "tarServiceSignguCode": "11230",
        "petServiceSignguCode": "11",
        "engServiceSignguCode": "11"
      },
      {
        "nameKo": "동작구",
        "nameEn": "Dongjak-gu",
        "korServiceSignguCode": "12",
        "tarServiceSignguCode": "11590",
        "petServiceSignguCode": "12",
        "engServiceSignguCode": "12"
      },
      {
        "nameKo": "마포구",
        "nameEn": "Mapo-gu",
        "korServiceSignguCode": "13",
        "tarServiceSignguCode": "11440",
        "petServiceSignguCode": "13",
        "engServiceSignguCode": "13"
      },
      {
        "nameKo": "서대문구",
        "nameEn": "Seodaemun-gu",
        "korServiceSignguCode": "14",
        "tarServiceSignguCode": "11410",
        "petServiceSignguCode": "14",
        "engServiceSignguCode": "14"
      },
      {
        "nameKo": "서초구",
        "nameEn": "Seocho-gu",
        "korServiceSignguCode": "15",
        "tarServiceSignguCode": "11650",
        "petServiceSignguCode": "15",
        "engServiceSignguCode": "15"
      },
      {
        "nameKo": "성동구",
        "nameEn": "Seongdong-gu",
        "korServiceSignguCode": "16",
        "tarServiceSignguCode": "11200",
        "petServiceSignguCode": "16",
        "engServiceSignguCode": "16"
      },
      {
        "nameKo": "성북구",
        "nameEn": "Seongbuk-gu",
        "korServiceSignguCode": "17",
        "tarServiceSignguCode": "11290",
        "petServiceSignguCode": "17",
        "engServiceSignguCode": "17"
      },
      {
        "nameKo": "송파구",
        "nameEn": "Songpa-gu",
        "korServiceSignguCode": "18",
        "tarServiceSignguCode": "11710",
        "petServiceSignguCode": "18",
        "engServiceSignguCode": "18"
      },
      {
        "nameKo": "양천구",
        "nameEn": "Yangcheon-gu",
        "korServiceSignguCode": "19",
        "tarServiceSignguCode": "11470",
        "petServiceSignguCode": "19",
        "engServiceSignguCode": "19"
      },
      {
        "nameKo": "영등포구",
        "nameEn": "Yeongdeungpo-gu",
        "korServiceSignguCode": "20",
        "tarServiceSignguCode": "11560",
        "petServiceSignguCode": "20",
        "engServiceSignguCode": "20"
      },
      {
        "nameKo": "용산구",
        "nameEn": "Yongsan-gu",
        "korServiceSignguCode": "21",
        "tarServiceSignguCode": "11170",
        "petServiceSignguCode": "21",
        "engServiceSignguCode": "21"
      },
      {
        "nameKo": "은평구",
        "nameEn": "Eunpyeong-gu",
        "korServiceSignguCode": "22",
        "tarServiceSignguCode": "11380",
        "petServiceSignguCode": "22",
        "engServiceSignguCode": "22"
      },
      {
        "nameKo": "종로구",
        "nameEn": "Jongno-gu",
        "korServiceSignguCode": "23",
        "tarServiceSignguCode": "11110",
        "petServiceSignguCode": "23",
        "engServiceSignguCode": "23"
      },
      {
        "nameKo": "중구",
        "nameEn": "Jung-gu",
        "korServiceSignguCode": "24",
        "tarServiceSignguCode": "11140",
        "petServiceSignguCode": "24",
        "engServiceSignguCode": "24"
      },
      {
        "nameKo": "중랑구",
        "nameEn": "Jungnang-gu",
        "korServiceSignguCode": "25",
        "tarServiceSignguCode": "11260",
        "petServiceSignguCode": "25",
        "engServiceSignguCode": "25"
      }
    ]
  },
  {
    "id": 6,
    "dbCityId": 2, 
    "nameKo": "부산",
    "nameEn": "Busan",
    "korServiceAreaCode": "6",
    "tarServiceAreaCode": "26",
    "petServiceAreaCode": "6",
    "engServiceAreaCode": "6",
    "districts": [
      {
        "nameKo": "강서구",
        "nameEn": "Gangseo-gu",
        "korServiceSignguCode": "1",
        "tarServiceSignguCode": "26440",
        "petServiceSignguCode": "1",
        "engServiceSignguCode": "1"
      },
      {
        "nameKo": "금정구",
        "nameEn": "Geumjeong-gu",
        "korServiceSignguCode": "2",
        "tarServiceSignguCode": "26410",
        "petServiceSignguCode": "2",
        "engServiceSignguCode": "2"
      },
      {
        "nameKo": "기장군",
        "nameEn": "Gijang-gun",
        "korServiceSignguCode": "3",
        "tarServiceSignguCode": "26710",
        "petServiceSignguCode": "3",
        "engServiceSignguCode": "3"
      },
      {
        "nameKo": "남구",
        "nameEn": "Nam-gu",
        "korServiceSignguCode": "4",
        "tarServiceSignguCode": "26290",
        "petServiceSignguCode": "4",
        "engServiceSignguCode": "4"
      },
      {
        "nameKo": "동구",
        "nameEn": "Dong-gu",
        "korServiceSignguCode": "5",
        "tarServiceSignguCode": "26170",
        "petServiceSignguCode": "5",
        "engServiceSignguCode": "5"
      },
      {
        "nameKo": "동래구",
        "nameEn": "Dongnae-gu",
        "korServiceSignguCode": "6",
        "tarServiceSignguCode": "26260",
        "petServiceSignguCode": "6",
        "engServiceSignguCode": "6"
      },
      {
        "nameKo": "부산진구",
        "nameEn": "Busanjin-gu",
        "korServiceSignguCode": "7",
        "tarServiceSignguCode": "26230",
        "petServiceSignguCode": "7",
        "engServiceSignguCode": "7"
      },
      {
        "nameKo": "북구",
        "nameEn": "Buk-gu",
        "korServiceSignguCode": "8",
        "tarServiceSignguCode": "26320",
        "petServiceSignguCode": "8",
        "engServiceSignguCode": "8"
      },
      {
        "nameKo": "사상구",
        "nameEn": "Sasang-gu",
        "korServiceSignguCode": "9",
        "tarServiceSignguCode": "26530",
        "petServiceSignguCode": "9",
        "engServiceSignguCode": "9"
      },
      {
        "nameKo": "사하구",
        "nameEn": "Saha-gu",
        "korServiceSignguCode": "10",
        "tarServiceSignguCode": "26380",
        "petServiceSignguCode": "10",
        "engServiceSignguCode": "10"
      },
      {
        "nameKo": "서구",
        "nameEn": "Seo-gu",
        "korServiceSignguCode": "11",
        "tarServiceSignguCode": "26140",
        "petServiceSignguCode": "11",
        "engServiceSignguCode": "11"
      },
      {
        "nameKo": "수영구",
        "nameEn": "Suyeong-gu",
        "korServiceSignguCode": "12",
        "tarServiceSignguCode": "26500",
        "petServiceSignguCode": "12",
        "engServiceSignguCode": "12"
      },
      {
        "nameKo": "연제구",
        "nameEn": "Yeonje-gu",
        "korServiceSignguCode": "13",
        "tarServiceSignguCode": "26470",
        "petServiceSignguCode": "13",
        "engServiceSignguCode": "13"
      },
      {
        "nameKo": "영도구",
        "nameEn": "Yeongdo-gu",
        "korServiceSignguCode": "14",
        "tarServiceSignguCode": "26200",
        "petServiceSignguCode": "14",
        "engServiceSignguCode": "14"
      },
      {
        "nameKo": "중구",
        "nameEn": "Jung-gu",
        "korServiceSignguCode": "15",
        "tarServiceSignguCode": "26110",
        "petServiceSignguCode": "15",
        "engServiceSignguCode": "15"
      },
      {
        "nameKo": "해운대구",
        "nameEn": "Haeundae-gu",
        "korServiceSignguCode": "16",
        "tarServiceSignguCode": "26350",
        "petServiceSignguCode": "16",
        "engServiceSignguCode": "16"
      }
    ]
  },
  {
    "id": 3,
    "dbCityId": 3,
    "nameKo": "대전",
    "nameEn": "Daejeon",
    "korServiceAreaCode": "3",
    "tarServiceAreaCode": "30",
    "petServiceAreaCode": "3",
    "engServiceAreaCode": "3",
    "districts": [
      {
        "nameKo": "대덕구",
        "nameEn": "Daedeok-gu",
        "korServiceSignguCode": "1",
        "tarServiceSignguCode": "30230",
        "petServiceSignguCode": "1",
        "engServiceSignguCode": "1"
      },
      {
        "nameKo": "동구",
        "nameEn": "Dong-gu",
        "korServiceSignguCode": "2",
        "tarServiceSignguCode": "30110",
        "petServiceSignguCode": "2",
        "engServiceSignguCode": "2"
      },
      {
        "nameKo": "서구",
        "nameEn": "Seo-gu",
        "korServiceSignguCode": "3",
        "tarServiceSignguCode": "30170",
        "petServiceSignguCode": "3",
        "engServiceSignguCode": "3"
      },
      {
        "nameKo": "유성구",
        "nameEn": "Yuseong-gu",
        "korServiceSignguCode": "4",
        "tarServiceSignguCode": "30200",
        "petServiceSignguCode": "4",
        "engServiceSignguCode": "4"
      },
      {
        "nameKo": "중구",
        "nameEn": "Jung-gu",
        "korServiceSignguCode": "5",
        "tarServiceSignguCode": "30140",
        "petServiceSignguCode": "5",
        "engServiceSignguCode": "5"
      }
    ]
  },
  {
    "id": 32,
    "dbCityId": 4,
    "nameKo": "강원특별자치도",
    "nameEn": "Gangwon-do",
    "displayNameKo": "강원",
    "displayNameEn": "Gangwon",
    "korServiceAreaCode": "32",
    "tarServiceAreaCode": "51",
    "petServiceAreaCode": "32",
    "engServiceAreaCode": "32",
    "districts": [
      {
        "nameKo": "강릉시",
        "nameEn": "Gangneung-si",
        "korServiceSignguCode": "1",
        "tarServiceSignguCode": "51150",
        "petServiceSignguCode": "1",
        "engServiceSignguCode": "1"
      },
      {
        "nameKo": "고성군",
        "nameEn": "Goseong-gun",
        "korServiceSignguCode": "2",
        "tarServiceSignguCode": "51820",
        "petServiceSignguCode": "2",
        "engServiceSignguCode": "2"
      },
      {
        "nameKo": "동해시",
        "nameEn": "Donghae-si",
        "korServiceSignguCode": "3",
        "tarServiceSignguCode": "51170",
        "petServiceSignguCode": "3",
        "engServiceSignguCode": "3"
      },
      {
        "nameKo": "삼척시",
        "nameEn": "Samcheok-si",
        "korServiceSignguCode": "4",
        "tarServiceSignguCode": "51230",
        "petServiceSignguCode": "4",
        "engServiceSignguCode": "4"
      },
      {
        "nameKo": "속초시",
        "nameEn": "Sokcho-si",
        "korServiceSignguCode": "5",
        "tarServiceSignguCode": "51210",
        "petServiceSignguCode": "5",
        "engServiceSignguCode": "5"
      },
      {
        "nameKo": "양구군",
        "nameEn": "Yanggu-gun",
        "korServiceSignguCode": "6",
        "tarServiceSignguCode": "51800",
        "petServiceSignguCode": "6",
        "engServiceSignguCode": "6"
      },
      {
        "nameKo": "양양군",
        "nameEn": "Yangyang-gun",
        "korServiceSignguCode": "7",
        "tarServiceSignguCode": "51830",
        "petServiceSignguCode": "7",
        "engServiceSignguCode": "7"
      },
      {
        "nameKo": "영월군",
        "nameEn": "Yeongwol-gun",
        "korServiceSignguCode": "8",
        "tarServiceSignguCode": "51750",
        "petServiceSignguCode": "8",
        "engServiceSignguCode": "8"
      },
      {
        "nameKo": "원주시",
        "nameEn": "Wonju-si",
        "korServiceSignguCode": "9",
        "tarServiceSignguCode": "51130",
        "petServiceSignguCode": "9",
        "engServiceSignguCode": "9"
      },
      {
        "nameKo": "인제군",
        "nameEn": "Inje-gun",
        "korServiceSignguCode": "10",
        "tarServiceSignguCode": "51810",
        "petServiceSignguCode": "10",
        "engServiceSignguCode": "10"
      },
      {
        "nameKo": "정선군",
        "nameEn": "Jeongseon-gun",
        "korServiceSignguCode": "11",
        "tarServiceSignguCode": "51770",
        "petServiceSignguCode": "11",
        "engServiceSignguCode": "11"
      },
      {
        "nameKo": "철원군",
        "nameEn": "Cheorwon-gun",
        "korServiceSignguCode": "12",
        "tarServiceSignguCode": "51780",
        "petServiceSignguCode": "12",
        "engServiceSignguCode": "12"
      },
      {
        "nameKo": "춘천시",
        "nameEn": "Chuncheon-si",
        "korServiceSignguCode": "13",
        "tarServiceSignguCode": "51110",
        "petServiceSignguCode": "13",
        "engServiceSignguCode": "13"
      },
      {
        "nameKo": "태백시",
        "nameEn": "Taebaek-si",
        "korServiceSignguCode": "14",
        "tarServiceSignguCode": "51190",
        "petServiceSignguCode": "14",
        "engServiceSignguCode": "14"
      },
      {
        "nameKo": "평창군",
        "nameEn": "Pyeongchang-gun",
        "korServiceSignguCode": "15",
        "tarServiceSignguCode": "51760",
        "petServiceSignguCode": "15",
        "engServiceSignguCode": "15"
      },
      {
        "nameKo": "홍천군",
        "nameEn": "Hongcheon-gun",
        "korServiceSignguCode": "16",
        "tarServiceSignguCode": "51720",
        "petServiceSignguCode": "16",
        "engServiceSignguCode": "16"
      },
      {
        "nameKo": "화천군",
        "nameEn": "Hwacheon-gun",
        "korServiceSignguCode": "17",
        "tarServiceSignguCode": "51790",
        "petServiceSignguCode": "17",
        "engServiceSignguCode": "17"
      },
      {
        "nameKo": "횡성군",
        "nameEn": "Hoengseong-gun",
        "korServiceSignguCode": "18",
        "tarServiceSignguCode": "51730",
        "petServiceSignguCode": "18",
        "engServiceSignguCode": "18"
      }
    ]
  },
  {
    "id": 39,
    "dbCityId": 5,
    "nameKo": "제주특별자치도",
    "nameEn": "Jeju-do",
    "displayNameKo": "제주",
    "displayNameEn": "Jeju",
    "korServiceAreaCode": "39",
    "tarServiceAreaCode": "50",
    "petServiceAreaCode": "39",
    "engServiceAreaCode": "39",
    "districts": [
      {
        "nameKo": "남제주군",
        "nameEn": "남제주군",
        "korServiceSignguCode": "1",
        "tarServiceSignguCode": "",
        "petServiceSignguCode": "1",
        "engServiceSignguCode": "1"
      },
      {
        "nameKo": "북제주군",
        "nameEn": "북제주군",
        "korServiceSignguCode": "2",
        "tarServiceSignguCode": "",
        "petServiceSignguCode": "2",
        "engServiceSignguCode": "2"
      },
      {
        "nameKo": "서귀포시",
        "nameEn": "Seogwipo-si",
        "korServiceSignguCode": "3",
        "tarServiceSignguCode": "50130",
        "petServiceSignguCode": "3",
        "engServiceSignguCode": "3"
      },
      {
        "nameKo": "제주시",
        "nameEn": "Jeju-si",
        "korServiceSignguCode": "4",
        "tarServiceSignguCode": "50110",
        "petServiceSignguCode": "4",
        "engServiceSignguCode": "4"
      }
    ]
  }
];

export const getRegionByDbCityId = (dbCityId: number): RegionCode | undefined => 
  regionCodeMap.find(r => r.dbCityId === dbCityId);

export const getRegionById = (id: number): RegionCode | undefined => 
  regionCodeMap.find(r => r.id === id);

export const getDistrictByCode = (
  regionId: number,
  sigunguCode:string,
): DistrictCode | undefined => {
  const region = getRegionById(regionId);
  return region?.districts.find(d => d.korServiceSignguCode === sigunguCode);
};

export const getDistrictByName = (
  regionId: number,
  districtNameKo: string
): DistrictCode | undefined => {
  const region = getRegionById(regionId);
  return region?.districts.find(d => d.nameKo === districtNameKo);
};

export const getDisplayName = (
  regionId: number,
  language: "ko" | "en" = "ko"
): string => {
  const region = getRegionById(regionId);
  if (!region) return "";
  return language === "ko" ? region.displayNameKo || region.nameKo : region.displayNameEn || region.nameEn;
};
