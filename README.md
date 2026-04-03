# 🌏CityChat (씨티챗)
### 공공 데이터와 실시간 소통의 결합, 도시별 통합 정보 공유 플랫폼
**👉배포: [citychat](https://citychat-beta.vercel.app)**

**테스트 계정**
- id : citychat
- pw: citychat1234
> ⚠️ **채팅 서버 Cold Start 안내**<br/>
> 채팅 서버는 Render 무료 플랜에 배포되어 있어, 일정 시간 미사용 시 서버가 슬립 상태로 전환됩니다.
> 처음 채팅방에 접속할 경우 서버가 깨어나기까지 **최대 10분 정도 소요**될 수 있습니다.

<p align="center"><img width="784" height="272" alt="image" src="https://github.com/user-attachments/assets/8b066cb3-811b-440b-afd9-c561fefdb79d" /></p>


> 지역 정보를 찾기 위해 여러 플랫폼을 오가는 번거로움을 해결하기 위해,
> 한국관광공사의 신뢰도 높은 데이터와 실시간 채팅 시스템을 한 곳에 통합했습니다.
> 사용자가 정보를 찾는 동시에 현지 사람들과 소통하며 가장 실용적인 정보를 얻을 수 있는 서비스입니다.

<br/>

## 🧭 프로젝트 소개

**CityChat**은 한국 여행을 계획하거나 현지에 있는 사람들을 위한 **도시별 통합 정보 공유 플랫폼**입니다.

- 🔴 **실시간 양방향 채팅** — 도시별 전용 채팅방에서 여행자와 거주자가 실시간으로 소통
- 🔵 **해시태그 기반 토픽 탐색** — `#맛집`, `#날씨` 같은 키워드로 핵심 정보를 빠르게 공유
- 🟢 **공공 데이터 통합** — 한국관광공사 Open API 연동으로 검증된 관광 정보 제공
- 🌐 **자동 번역 지원** — 언어 장벽 없이 외국인 사용자와 원활한 소통 가능

<br/>

## ✨ 주요 기능

### 1. 공공데이터 기반 통합 지역 정보 제공

<img width="760" height="808" alt="image" src="https://github.com/user-attachments/assets/6fdd69c1-a6ca-4c16-be16-fdab602dcb6f" />

- 한국관광공사 Open API와 연동하여 신뢰도 높은 공공데이터를 사용자 친화적인 UI로 제공
- 관광지, 음식점, 반려견 동반 장소 등 카테고리별 지역 정보 탐색 환경 제공

### 2. 지역별 실시간 정보 공유 채팅방
<img width="760" height="699" alt="image" src="https://github.com/user-attachments/assets/55e4c8e9-4403-4f48-80a9-c6c9bded5757" />

- 각 도시별 전용 채팅방을 통해 실시간 소통 공간 제공
- 공식 데이터가 놓칠 수 있는 현장의 생생한 정보(웨이팅 현황, 실시간 날씨 등)를 즉각 교환

### 3. 해시태그 기반 실시간 토픽 큐레이션
- 채팅 내 `#해시태그` 기능으로 핵심 키워드를 공유하고 대화의 주제를 시각화
- 도시 진입 페이지에서 해당 지역의 인기 해시태그를 통해 현재 핫한 주제를 한눈에 파악

<br/>

## 🛠️ 기술 스택

| 분류 | 기술 |
|---|---|
| **프론트엔드** | Next.js 15, React, TypeScript |
| **실시간 채팅** | Socket.io, Socket.io-client |
| **상태 관리** | Zustand, TanStack Query |
| **백엔드** | Next.js API Routes, Supabase (PostgreSQL) |
| **인증** | Next.js Middleware, JWT, Bcryptjs |
| **버전 관리** | GitHub |

<br/>

## 🏗️ 아키텍처

본 프로젝트는 **DDD(Domain-Driven Design) 기반 클린 아키텍처**를 백엔드 레이어에 적용합니다.
Next.js는 순수 백엔드(API Routes)로만 활용하며, 모든 페이지 렌더링은 CSR로 처리합니다.

```
┌─────────────────────────────────────────────┐
│              Presentation Layer             │
│        (Next.js Pages — CSR, React)         │
└──────────────────────┬──────────────────────┘
                       │ fetch
┌──────────────────────▼──────────────────────┐
│            Next.js API Routes               │
│         (app/api — Backend Only)            │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│           Application Layer                 │
│   UseCases / DTOs (backend/application)     │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│              Domain Layer                   │
│   Entities / Repository Interfaces          │
│         (backend/domain)                    │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│           Infrastructure Layer              │
│  Supabase Repositories / External Clients   │
│       (backend/infrastructure)              │
└─────────────────────────────────────────────┘
```
<br/>

## 📂 프로젝트 구조

```
📦 root
├─ app/                         # Next.js App Router
│  ├─ api/                      # Backend API Routes (서버 전용)
│  │  ├─ auth/                  # 인증 (signin, signout, refresh)
│  │  ├─ chat/                  # 채팅 (rooms, logs, search, translate, top-tags)
│  │  ├─ cities/                # 도시 목록 및 도시별 투어
│  │  ├─ tours/                 # 투어 상세
│  │  ├─ users/                 # 회원 관리
│  │  └─ weather/               # 날씨
│  ├─ chatrooms/[id]/           # 채팅방 페이지 (CSR)
│  ├─ cities/[id]/              # 도시 상세 페이지 (CSR)
│  ├─ me/                       # 마이페이지 (계정, 채팅 내역)
│  ├─ signin/ & signup/         # 인증 페이지
│  └─ components/               # 공통 UI 컴포넌트
│
├─ backend/                     # 클린 아키텍처 백엔드 레이어
│  ├─ application/              # UseCase, DTO
│  ├─ domain/                   # Entity, Repository Interface
│  └─ infrastructure/           # Supabase Repository 구현체, 외부 API 클라이언트
│
├─ hooks/                       # 커스텀 훅 (TanStack Query 기반)
├─ stores/                      # Zustand 전역 상태
├─ utils/                       # 유틸 함수 (auth, supabase)
├─ config/                      # 앱 설정 (auth, validation)
└─ types/                       # 공통 타입 정의
```
