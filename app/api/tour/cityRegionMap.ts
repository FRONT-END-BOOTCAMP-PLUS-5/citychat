//각 도시 id에 맞춰서 api 호출 코드 매핑
type Signgu = { name: string; signguCd: string };
type Region = {
  name: string;
  areaCd: string;
  signguList: Signgu[];
};

export const cityRegionMap: Record<number, Region> = {
  1: {
    name: "서울",
    areaCd: "11",
    signguList: [
      { name: "강남구", signguCd: "11680" },
      { name: "종로구", signguCd: "11110" },
      { name: "마포구", signguCd: "11440" },
    ],
  },
  2: {
    name: "부산",
    areaCd: "26",
    signguList: [
      { name: "해운대구", signguCd: "26350" },
      { name: "중구", signguCd: "26110" },
      { name: "서구", signguCd: "26140" },
    ],
  },
  3: {
    name: "대전",
    areaCd: "30",
    signguList: [
      { name: "서구", signguCd: "30170" },
      { name: "유성구", signguCd: "30200" },
      { name: "중구", signguCd: "30140" },
    ],
  },
  4: {
    name: "강원",
    areaCd: "51",
    signguList: [
      { name: "강릉시", signguCd: "51150" },
      { name: "동해시", signguCd: "51170" },
      { name: "속초시", signguCd: "51210" },
    ],
  },
  5: {
    name: "제주",
    areaCd: "50",
    signguList: [
      { name: "제주시", signguCd: "50110" },
      { name: "서귀포시", signguCd: "50130" },
    ],
  },
};

