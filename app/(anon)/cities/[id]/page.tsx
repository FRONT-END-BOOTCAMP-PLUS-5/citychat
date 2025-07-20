"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useCityStore } from "@/app/stores/useCitystore";
import CityLoader from "@/app/components/CityLoader";
import SharedPageLayout from "@/app/SharedPageLayout";
import ChatButton from "@/app/(anon)/cities/[id]/components/ChatButton";
import CategoryFilter from "@/app/(anon)/cities/[id]/components/CategoryFilter";
import TourCard from "@/app/(anon)/cities/[id]/components/TourCard";

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
  const [hasMounted, setHasMounted] = useState(false);
  const params = useParams();
  const cityId = parseInt(params.id as string, 10);

  const getCityById = useCityStore((state) => state.getCityById);
  const currentCity: City | undefined = getCityById(cityId);

  const [tourList, setTourList] = useState<TourItem[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const res = await fetch(`/api/tour?id=${cityId}`);
        const data: TourItem[] = await res.json();
        setTourList(data);
        console.log("공공데이터", data);
      } catch (err) {
        console.error("관광 정보 로딩 실패:", err);
      }
    };
    fetchTourData();
  }, [cityId]);

  const categories = useMemo(() => {
    if (!tourList) return [];
    const unique = new Set(tourList.map((item) => item.rlteCtgrySclsNm));
    return ["All", ...Array.from(unique)];
  }, [tourList]);

  const filteredTourList = useMemo(() => {
    if (selectedCategory === "All") return tourList;
    return tourList?.filter(
      (item) => item.rlteCtgrySclsNm === selectedCategory
    );
  }, [tourList, selectedCategory]);

  if (!hasMounted) return null;

  const shouldLoadCity = !currentCity;

  return (
    <>
      {shouldLoadCity && <CityLoader />}
      {currentCity ? (
        <SharedPageLayout title={currentCity.name}>
          <ChatButton cityId={cityId} />

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
            </header>

            {/* 태그 목록 */}
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

            {/* 필터 및 카드 */}
            <div
              style={{
                width: "calc(100% - 220px)",
                float: "left",
              }}
            >
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onChange={setSelectedCategory}
              />

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
                {filteredTourList && filteredTourList.length > 0 ? (
                  filteredTourList.map((item, idx) => (
                    <TourCard
                      key={idx}
                      rlteTatsNm={item.rlteTatsNm}
                      areaNm={item.areaNm}
                      rlteSignguNm={item.rlteSignguNm}
                      rlteCtgrySclsNm={item.rlteCtgrySclsNm}
                    />
                  ))
                ) : (
                  <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                    선택한 분류의 정보가 없습니다.
                  </p>
                )}
              </div>
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
