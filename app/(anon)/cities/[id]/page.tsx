"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useCityStore } from "@/app/stores/useCitystore";
import CityLoader from "@/app/components/CityLoader";
import SharedPageLayout from "@/app/SharedPageLayout";

interface TourItem {
  rlteCtgrySclsNm: string;
  rlteTatsNm: string;
  areaNm: string;
  rlteSignguNm: string;
}

interface City {
  id: number;
  name: string;
  description: string;
}

const Tags = ["#날씨", "#음식", "#패션", "#꿀팁", "#문화", "#교통"];

export default function DetailPage() {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams();
  const cityId = parseInt(params.id as string, 10);

  // currentCity에 City 또는 undefined 타입을 명시
  const getCityById = useCityStore((state) => state.getCityById);
  const currentCity: City | undefined = getCityById(cityId);

  // tourList에 TourItem 배열 또는 null 타입을 명시
  const [tourList, setTourList] = useState<TourItem[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const res = await fetch(`/api/tour?id=${cityId}`);
        // 응답 데이터가 TourItem 배열임을 명시
        const data: TourItem[] = await res.json();
        setTourList(data);
        console.log("공공데이터", data);
      } catch (err) {
        console.error("관광 정보 로딩 실패:", err);
      }
    };
    fetchTourData();
  }, [cityId]);

  // tourList가 TourItem 배열임을 인지하고 category를 추출
  const categories = useMemo(() => {
    if (!tourList) return [];
    // map 함수 내의 item도 TourItem 타입으로 자동 추론
    const uniqueCategories = new Set(tourList.map((item: TourItem) => item.rlteCtgrySclsNm));
    return ["All", ...Array.from(uniqueCategories)];
  }, [tourList]);

  // 필터링된 목록도 TourItem 배열임을 명시
  const filteredTourList: TourItem[] | null | undefined = useMemo(() => {
    if (selectedCategory === "All") {
      return tourList;
    }
    // filter 함수 내의 item도 TourItem 타입으로 자동 추론
    return tourList?.filter((item: TourItem) => item.rlteCtgrySclsNm === selectedCategory);
  }, [tourList, selectedCategory]);

  const handleChatButtonClick = () => {
    if (cityId) {
      router.push(`/chatrooms/${cityId}`);
    }
  };

  if (!hasMounted) return null;

  const shouldLoadCity = !currentCity;
  return (
    <>
      {shouldLoadCity && <CityLoader />}
      {currentCity ? (
        <SharedPageLayout title={currentCity.name}>
          <section>
            <header>
              <p
                style={{
                  marginBottom: "10px",
                  display: "inline-block",
                  fontSize: "16px",
                }}
              >
                {currentCity.description}
              </p>
              <button
                style={{ float: "right", display: "inline-block" }}
                onClick={handleChatButtonClick}
              >
                채팅 시작
              </button>
            </header>
            <div
              className="tagWrap"
              style={{
                width: "200px",
                textAlign: "center",
                marginTop: "28px",
                float: "left",
              }}
            >
              <span>내가 관심있는 태그</span>
              <aside
                style={{
                  width: "200px",
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  padding: "10px",
                  borderRadius: "8px",
                  float: "left",
                }}
              >
                {Tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      margin: "8px",
                      padding: "6px 12px",
                      background: "#eee",
                      borderRadius: "15px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </aside>
            </div>
            <div
              style={{
                width: "calc(100% - 220px)",
                float: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginLeft: "25px" }}>내가 관심있을 만한 정보</span>
                <div style={{ marginLeft: "30px" }}>
                  <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gap: "16px",
                gridTemplateColumns: "repeat(2, 1fr)",
                padding: "20px",
                height: "40vh",
                overflowY: "auto",
              }}
            >
              {/* filteredTourList의 각 item이 TourItem임을 명시 */}
              {filteredTourList && filteredTourList.length > 0 ? (
                filteredTourList.map((item: TourItem, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      padding: "16px",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      background: "#fff",
                    }}
                  >
                    <h3 style={{ marginBottom: "6px" }}>{item.rlteTatsNm}</h3>
                    <p style={{ margin: "4px 0" }}>
                      지역: {item.areaNm} {item.rlteSignguNm}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      분류: {item.rlteCtgrySclsNm}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                  선택한 분류의 정보가 없습니다.
                </p>
              )}
            </div>
          </section>
        </SharedPageLayout>
      ) : (
        <div style={{ padding: "20px", textAlign: "center" }}>
          도시 정보를 불러오는 중입니다...
        </div>
      )}
    </>
  );
}
