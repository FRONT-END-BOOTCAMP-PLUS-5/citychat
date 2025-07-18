"use client";
import React, { useState, useEffect } from "react";
import SharedPageLayout from "@/app/SharedPageLayout";
import { useParams } from "next/navigation";

// 태그 값 배열
const Tags = ["#날씨", "#음식", "#패션", "#꿀팁", "#문화", "#교통"];

// 카드 값 배열
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

interface City {
  id: number;
  name: string;
  // image: string;
  description: string;
  // 여기에 해당 도시에 특화된 activityCards나 다른 데이터를 추가
  // 예를 들어: activities?: { title: string; description: string; }[];
}

const styles = {
  loadingState: {
    padding: "20px",
    fontSize: "18px",
    color: "#555",
    textAlign: "center" as const,
  },
  errorState: {
    padding: "20px",
    fontSize: "18px",
    color: "red",
    textAlign: "center" as const,
  },
};

export default function DetailPage() {
  const params = useParams(); // URL의 동적 파라미터를 가져옵니다.
  const cityIdFromUrl = params.id as string; // URL에서 가져온 id는 문자열 형태입니다.
  const cityId = parseInt(cityIdFromUrl, 10); // parseInt를 사용하여 문자열 id를 10진수 정수로 변환합니다.

  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`/api/cities?cityId=${cityId}`);
        if (!response.ok) {
          throw new Error(`HTTP 오류! 상태: ${response.status}`);
        }
        const data: City[] = await response.json();
        setCities(data);
      } catch (err: unknown) {
        console.error("도시 데이터를 불러오는 중 오류 발생:", err);
        setError("도시 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  // URL의 id가 유효한 숫자가 아닐 경우 (예: /cities/abc)
  if (isNaN(cityId)) {
    return (
      <div style={styles.errorState}>
        잘못된 도시 ID입니다. 올바른 숫자를 입력해주세요.
      </div>
    );
  }

  if (loading) {
    return <div style={styles.loadingState}>데이터 불러오는 중</div>;
  }
  if (error) {
    return <div style={styles.errorState}>오류: {error}</div>;
  }

  if (!cities.length) {
    return <div style={styles.errorState}>데이터 없음</div>;
  }

  // URL에서 가져온 cityId와 일치하는 도시를 cities 배열에서 찾습니다.
  const currentCity = cities.find((city) => city.id === cityId);

  // 해당 ID의 도시를 찾지 못했을 경우
  if (!currentCity) {
    return (
      <div style={styles.errorState}>
        선택된 도시 정보를 찾을 수 없습니다: ID {cityId}
      </div>
    );
  }

  return (
    <div>
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
          {/* 좌측 태그 리스트 */}
          <div
            className="tagWrap"
            style={{
              width: "200px",
              display: "block",
              textAlign: "center",
              marginTop: "20px",
              float: "left",
            }}
          >
            <span>내가 관심있는 태그</span>
            <aside
              className="tagList"
              style={{
                width: "200px",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                padding: "10px",
                borderRadius: "8px",
                float: "left",
                justifyContent: "center",
                alignItems: "start",
              }}
            >
              {/* 태그 한개의 영역 */}
              {Tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    margin: "8px",
                    padding: "6px 12px",
                    background: "#eee",
                    borderRadius: "15px",
                    height: "30px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </aside>
          </div>
          {/* 우측 컨텐츠 카드 */}
          <div
            className="tagWrap"
            style={{
              width: "calc(100% - 220px)",
              display: "block",
              marginTop: "20px",
              float: "left",
            }}
          >
            <span className="infoTitle" style={{ marginLeft: "25px" }}>
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
            {/* 현재는 하드코딩된 activityCards를 사용합니다. */}
            {/* 만약 currentCity 객체에 activities 속성이 있다면, 아래처럼 사용할 수 있습니다: */}
            {/* {currentCity.activities?.map((card, idx) => ( */}
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
    </div>
  );
}

