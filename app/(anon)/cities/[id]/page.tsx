"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react"; // Import useMemo
import { useCityStore } from "@/app/stores/useCitystore";
import CityLoader from "@/app/components/CityLoader";
import SharedPageLayout from "@/app/SharedPageLayout";

const Tags = ["#날씨", "#음식", "#패션", "#꿀팁", "#문화", "#교통"];

export default function DetailPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const cityId = parseInt(params.id as string, 10);
  const getCityById = useCityStore((state) => state.getCityById);
  const currentCity = getCityById(cityId);
  const [tourList, setTourList] = useState<unknown[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All"); // New state for selected category

  // SSR hydration mismatch 방지
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const res = await fetch(`/api/tour?id=${cityId}`);
        const data = await res.json();
        setTourList(data);
        console.log("공공데이터", data);
      } catch (err) {
        console.error("관광 정보 로딩 실패:", err);
      }
    };
    fetchTourData();
  }, [cityId]);

  // Extract unique categories from tourList
  const categories = useMemo(() => {
    if (!tourList) return [];
    const uniqueCategories = new Set(tourList.map((item: any) => item.rlteCtgrySclsNm));
    return ["All", ...Array.from(uniqueCategories)];
  }, [tourList]);

  // Filtered tour list based on selectedCategory
  const filteredTourList = useMemo(() => {
    if (selectedCategory === "All") {
      return tourList;
    }
    return tourList?.filter((item: any) => item.rlteCtgrySclsNm === selectedCategory);
  }, [tourList, selectedCategory]);

  // 버튼 이벤트 (채팅방으로)
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
              {/* 태그 */}
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
              {/* 정보 */}
              <div style={{display:"flex", alignItems:"center"}}>
                <span style={{ marginLeft: "25px" }}>
                내가 관심있을 만한 정보
                </span>
                {/* 필터링 selectbox */}
                <div style={{ marginLeft: "30px", }}>
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
                overflowY: "auto", // Add scroll for long lists
              }}
            >
              {filteredTourList && filteredTourList.length > 0 ? (
                filteredTourList.map((item: any, idx: number) => (
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
