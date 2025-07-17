import React from "react";
import SharedPageLayout from "@/app/SharedPageLayout";

// 태그 값 배열
const Tags = ["#날씨", "#음식", "#패션", "#꿀팁", "#문화", "#교통"];

// 카드 값 배열
const activityCards = [
  {
    title: "서울에서 뭐하고 놀지 고민할 때",
    description: "이걸 눌러서 확인하면 재밌는 걸 찾을 수 있어요!",
  },
  {
    title: "현지인이 추천하는 핫플레이스",
    description: "서울의 숨은 매력을 찾아보세요!",
  },
  {
    title: "패션과 음식, 서울의 취향을 즐기자",
    description: "취향 저격 코스를 소개해 드릴게요!",
  },
  {
    title: "서울 인기 명소 한눈에 보기",
    description: "이번 여행은 이걸로 완성!",
  },
];

export default function DetailPage() {
  return (
    <div>
      <SharedPageLayout title="Seoul">
        <section>
          <header>
            <p
              style={{
                marginBottom: "10px",
                display: "inline-block",
                fontSize: "20px",
              }}
            >
              서울은 대한민국의 수도이자 아시아에서 가장 활기차고 현대적인 도시 중
              하나입니다.
            </p>
            <button style={{ float: "right", display: "inline-block" }}>
              Start Chat
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
                // backgroundColor: "#222",
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
