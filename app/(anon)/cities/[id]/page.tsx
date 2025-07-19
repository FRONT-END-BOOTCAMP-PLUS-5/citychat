"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCityStore } from "@/app/stores/useCitystore";
import CityLoader from "@/app/components/CityLoader";
import SharedPageLayout from "@/app/SharedPageLayout";

const Tags = ["#날씨", "#음식", "#패션", "#꿀팁", "#문화", "#교통"];

const activityCards = [
  {
    title: "도시에서 뭐하고 놀지 고민할 때",
    description: "이걸 눌러서 확인하면 재밌는 걸 찾을 수 있어요!",
  },
  {
    title: "현지인이 추천하는 핫플레이스",
    description: "숨은 매력을 찾아보세요!",
  },
  {
    title: "패션과 음식, 도시의 취향을 즐기자",
    description: "취향 저격 코스를 소개해 드릴게요!",
  },
  {
    title: "인기 명소 한눈에 보기",
    description: "이번 여행은 이걸로 완성!",
  },
];

export default function DetailPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const params = useParams();
  const cityId = parseInt(params.id as string, 10);
  //cities 정보 중 해당 도시 데이터 접근
  const getCityById = useCityStore((state) => state.getCityById);
  const currentCity = getCityById(cityId);
  //tour/route.ts 공공데이터 저장
  // const [tourList, setTourList] = useState<unknown[] | null>(null);

  // SSR hydration mismatch 방지
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const res = await fetch(`/api/tour?id=${cityId}`);
        const data = await res.json();
        // setTourList(data); // 배열
        console.log("공공데이터", data);
      } catch (err) {
        console.error("관광 정보 로딩 실패:", err);
      }
    };
    fetchTourData();
  }, [cityId]);

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
                  fontSize: "20px",
                }}
              >
                {currentCity.description}
              </p>
              <button style={{ float: "right", display: "inline-block" }}>
                채팅 시작
              </button>
            </header>
            <div
              className="tagWrap"
              style={{
                width: "200px",
                textAlign: "center",
                marginTop: "20px",
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
                marginTop: "20px",
                float: "left",
              }}
            >
              <span style={{ marginLeft: "25px" }}>
                내가 관심있을 만한 정보
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gap: "16px",
                gridTemplateColumns: "repeat(2, 1fr)",
                padding: "20px",
                height: "40vh",
              }}
            >
              {activityCards.map((card, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    background: "#fafafa",
                  }}
                >
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
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

