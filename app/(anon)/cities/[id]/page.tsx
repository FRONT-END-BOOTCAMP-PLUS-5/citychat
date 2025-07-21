"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import TopTagList from "@/app/components/TopTagList";
import CityLoader from "@/app/components/CityLoader";
import SharedPageLayout from "@/app/SharedPageLayout";
import { useCityStore } from "@/app/stores/useCitystore";
import TourCard from "@/app/(anon)/cities/[id]/components/TourCard";
import ChatButton from "@/app/(anon)/cities/[id]/components/ChatButton";
import CategoryFilter from "@/app/(anon)/cities/[id]/components/CategoryFilter";
import LoadingSpinner from "@/app/components/LoadingSpinner";

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
  image: string;
}

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
        <SharedPageLayout title={currentCity.name} imgUrl={currentCity.image}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              maxWidth: "900px",
              color: "#333",
            }}
          >
            <section
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: "fit-content",
                alignSelf: "center",
              }}
            >
              <header
                style={{
                  display: "flex",
                }}
              >
                <p
                  style={{
                    marginBottom: "10px",
                    display: "inline-block",
                    fontSize: "16px",
                    color: "#a6a6a6",
                    marginRight: "2vw",
                  }}
                >
                  {currentCity.description}
                </p>
                <ChatButton cityId={cityId} />
              </header>

              {/* 인기 태그 */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginTop: "28px",
                  justifyContent: "space-between",
                  alignItems: "",
                }}
              >
                <div style={{ height: "20%" }}>
                  <TopTagList roomId={Number(cityId)} />
                </div>

                {/* 필터 및 카드 */}
                <div
                  style={{
                    flex: 1,
                    marginLeft: "30px",
                    marginTop: "5px",
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
                      <LoadingSpinner size={15} />
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </SharedPageLayout>
      ) : (
        <div style={{ padding: "20px", textAlign: "center" }}>
          도시 정보를 불러오는 중입니다...
        </div>
      )}
    </>
  );
}

