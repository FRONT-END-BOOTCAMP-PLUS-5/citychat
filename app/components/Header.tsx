"use client";

import React, { useRef } from "react"; // useRef 추가
import Image from "next/image";
import Link from "next/link";
import styles from "./header.module.css";
import Avatar from "./Avatar";
import { useUserStore } from "@/app/stores/useUserStore";
import { useGetCities } from "@/app/hooks/useGetCities";
import { MenuIcon, XIcon } from "lucide-react";

// ─────── 페이지 목록 ───────
const pages = [
  { name: "Home", path: "/" },
  { name: "Cities", path: "#" },
  // { name: "Landmark", path: "/" },
  { name: "About", path: "/" },
];
//  ─────── Cities의 드롭다운 항목 ───────
const cityRegions = [
  { name: "서울", path: "/cities/1" },
  { name: "부산", path: "/cities/2" },
  { name: "대전", path: "/cities/3" },
  { name: "강원", path: "/cities/4" },
  { name: "제주", path: "/cities/5" },
];

function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isCitiesDropdownOpen, setIsCitiesDropdownOpen] = React.useState(false);
  const [isDrawerCitiesDropdownOpen, setIsDrawerCitiesDropdownOpen] =
    React.useState(false); // 드로어 내 Cities 드롭다운을 위한 새로운 상태

  // 아코디언 콘텐츠의 높이를 측정하기 위한 Ref
  const citiesDropdownRef = useRef<HTMLUListElement>(null);

  // Zustand 스토어에서 상태와 액션
  const user = useUserStore((state) => state.user); // 유저 정보 데이터
  useGetCities(); // 도시 정보 데이터

  // 로그인 여부 확인
  const isLoggedIn = !!user;


  // 드로어 상태 변경을 막기 위해 예외 처리(키보드 이벤트인 경우 :Tap 과 Shift키 작동 막기)
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsDrawerOpen(open);
      if (open) {
        setIsCitiesDropdownOpen(false);
        setIsDrawerCitiesDropdownOpen(false); // 드로어가 열릴 때 드로어 내 Cities 드롭다운 닫기
      }
    };

  // 토글로 드롭다운을 열고 닫는 기능(cities)
  const toggleCitiesDropdown = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsCitiesDropdownOpen((prev) => !prev);
  };

  // New: 토글로 드로어 내 Cities 드롭다운을 열고 닫는 기능 (아코디언용)
  const toggleDrawerCitiesDropdown = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDrawerCitiesDropdownOpen((prev) => !prev);
  };

  // 마우스 클릭시 드롭다운과 안에 있는 요소들(회원가입,로그인 등..)(한번만 실행 :,[])
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const citiesDropdownWrapper = document.getElementById(
        "cities-dropdown-wrapper"
      );

      if (
        citiesDropdownWrapper &&
        !citiesDropdownWrapper.contains(event.target as Node)
      ) {
        setIsCitiesDropdownOpen(false);
      }
    };
    // 드롭다운 실행 후 이벤트 제거
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.appBar}>
      <div className={styles.containerWrapper}>
        <div className={styles.toolbar}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/assets/citychat.png"
              alt="CityChat Logo"
              className={styles.logoImage}
              width={664}
              height={173}
              priority
            />
          </Link>

          <div className={styles.mobileMenuIconWrapper}>
            <button
              className={styles.iconButton}
              aria-label="메뉴 열기"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </button>
          </div>

          <nav className={styles.navDesktop}>
            {/* 기존 pages.map 안에 "Cities" 조건 처리 */}
            {pages.map((page) =>
              page.name === "Cities" ? (
                <div
                  key={page.name}
                  className={styles.navItemDropdownWrapper}
                  id="cities-dropdown-wrapper"
                >
                  <Link
                    href={page.path} // Cities 경로 유지
                    className={`${styles.navItem} ${styles.citiesLink}`} // navItem 기본 스타일 적용
                    onClick={toggleCitiesDropdown} // Link 클릭 시 드롭다운 토글
                    aria-haspopup="true"
                    aria-expanded={isCitiesDropdownOpen}
                    id="cities-button" // 외부 클릭 감지를 위해 ID 유지 (옵션)
                  >
                    {page.name}
                  </Link>
                  {isCitiesDropdownOpen && (
                    <div id="cities-dropdown" className={styles.citiesDropdown}>
                      {cityRegions.map((region) => (
                        <Link
                          key={region.name}
                          href={region.path}
                          className={styles.dropdownItem}
                          onClick={() => setIsCitiesDropdownOpen(false)}
                        >
                          {region.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={page.name}
                  href={page.path}
                  className={styles.navItem}
                >
                  {page.name}
                </Link>
              )
            )}

            {/* 마이페이지 버튼 */}
            <div className={styles.mypageContainer}>
              <Link
                href="/me"
                id="mypage-button"
                className={styles.mypageIconButton}
              >
                {isLoggedIn && user?.nickname ? (
                  <Avatar name={user.nickname} />
                ) : (
                  <Image
                    src="/assets/login-profile.png"
                    alt="ME"
                    width={30}
                    height={30}
                    className={styles.mypageIcon}
                  />
                )}
              </Link>
            </div>
          </nav>
        </div>
      </div>
      {/* 반응형 영역 (드로어) */}
      <div
        className={`${styles.drawer} ${isDrawerOpen ? styles.open : ""}`.trim()}
      >
        <div className={styles.drawerContent}>
          <div className={styles.drawerCloseButtonWrapper}>
            <button
              className={styles.iconButton}
              aria-label="메뉴 닫기"
              onClick={toggleDrawer(false)}
            >
              <XIcon />
            </button>
          </div>

          <ul className={styles.drawerList}>
            {pages.map((page) =>
              page.name === "Cities" ? (
                <li key={page.name} className={styles.drawerListItem}>
                  <Link
                    href={page.path}
                    className={styles.drawerLink}
                    onClick={toggleDrawerCitiesDropdown} // 아코디언 토글 함수
                    aria-haspopup="true"
                    aria-expanded={isDrawerCitiesDropdownOpen}
                  >
                    {page.name}
                    {/* 아코디언 열림/닫힘 시 아이콘 변경 (선택 사항) */}
                    <span className={styles.dropdownArrow}>
                      {isDrawerCitiesDropdownOpen ? "" : ""}
                    </span>
                  </Link>
                  {/* 아코디언 콘텐츠 부분 */}
                  <ul
                    ref={citiesDropdownRef} // Ref 연결
                    className={`${styles.drawerSubList} ${
                      isDrawerCitiesDropdownOpen ? styles.openAccordion : ""
                    }`}
                    style={{
                      maxHeight: isDrawerCitiesDropdownOpen
                        ? `${citiesDropdownRef.current?.scrollHeight}px` // 열렸을 때 실제 높이로
                        : "0px", // 닫혔을 때 높이 0
                    }}
                  >
                    {cityRegions.map((region) => (
                      <li key={region.name}>
                        <Link
                          href={region.path}
                          className={styles.drawerSubLink}
                          onClick={toggleDrawer(false)} // 도시 선택 시 드로어 닫기
                        >
                          {region.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={page.name} className={styles.drawerListItem}>
                  <Link
                    href={page.path}
                    className={styles.drawerLink}
                    onClick={toggleDrawer(false)}
                  >
                    {page.name}
                  </Link>
                </li>
              )
            )}
            <li className={styles.drawerListItem}>
              <Link
                href="/me"
                className={styles.drawerLink}
              >{isLoggedIn ? "My page" : "Sign in" }</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
