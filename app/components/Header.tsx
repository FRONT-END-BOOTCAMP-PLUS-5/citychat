"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./header.module.css";
import Avatar from "./Avatar";
import { useEffect } from "react";
import { useUserStore } from "@/app/stores/useUserStore";
import { useSignout } from "@/app/hooks/useSignout";
import { useCityStore } from "../stores/useCitystore";
import { GetCityListUseCase } from "@/backend/application/cities/usecases/GetCityListUseCase";
import { SbCityRepository } from "@/backend/infrastructure/repositories/SbCityRepository";

// ─────── 페이지 목록 ───────
const pages = [
  { name: "Home", path: "/" },
  { name: "Cities", path: "/cities" },
  { name: "Landmark", path: "/landmark" },
  { name: "About", path: "/about" },
];
//  ─────── Cities의 드롭다운 항목 ───────
const cityRegions = [
  { name: "서울", path: "/cities/1" },
  { name: "부산", path: "/cities/2" },
  { name: "대전", path: "/cities/3" },
  { name: "강릉", path: "/cities/4" },
  { name: "제주", path: "/cities/5" },
];

function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isMypageDropdownOpen, setIsMypageDropdownOpen] = React.useState(false);
  const [isCitiesDropdownOpen, setIsCitiesDropdownOpen] = React.useState(false);

  // Zustand 스토어에서 상태와 액션
  const user = useUserStore((state) => state.user); // 유저 정보 데이터
  const { mutate: signout } = useSignout();
  const addCities = useCityStore((state) => state.addCities); //도시 정보 데이터

  // Supabase 정보 스토어 저장
  useEffect(() => {
    const fetchCities = async () => {
      const useCase = new GetCityListUseCase(new SbCityRepository());
      const cities = await useCase.execute();
      addCities(cities);
    };

    fetchCities();
  }, [addCities]);

  // 로그인 여부 확인
  const isLoggedIn = !!user;

  // 로그아웃 이벤트
  const handleLogout = () => {
    signout();
  };

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
        setIsMypageDropdownOpen(false);
        setIsCitiesDropdownOpen(false);
      }
    };

  // 토글로 드롭다운을 열고 닫는 기능(me)
  const toggleMypageDropdown = () => {
    setIsMypageDropdownOpen((prev) => !prev);
  };

  // 토글로 드롭다운을 열고 닫는 기능(cities)
  const toggleCitiesDropdown = (event : React.MouseEvent) => {
    event.preventDefault();
    setIsCitiesDropdownOpen((prev) => !prev);
  };

  // 마우스 클릭시 드롭다운과 안에 있는 요소들(회원가입,로그인 등..)(한번만 실행 :,[])
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mypageButton = document.getElementById("mypage-button");
      const mypageDropdown = document.getElementById("mypage-dropdown");
      const citiesDropdownWrapper = document.getElementById("cities-dropdown-wrapper");

      // 클릭된 버튼과 드롭다운 요소 포함 여부 확인
      if (
        mypageButton &&
        !mypageButton.contains(event.target as Node) &&
        mypageDropdown &&
        !mypageDropdown.contains(event.target as Node)
      ) {
        setIsMypageDropdownOpen(false); // 드롭다운 자동 닫힘
      }
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
              ☰
            </button>
          </div>

          <nav className={styles.navDesktop}>
            {/* ✅ 기존 pages.map 안에 "Cities" 조건 처리 */}
            {pages.map((page) =>
              page.name === "Cities" ? (
                <div key={page.name} className={styles.navItemDropdownWrapper} id="cities-dropdown-wrapper">
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
              <button
                id="mypage-button"
                className={styles.mypageIconButton}
                onClick={toggleMypageDropdown}
                aria-haspopup="true"
                aria-expanded={isMypageDropdownOpen}
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
              </button>
              {isMypageDropdownOpen && (
                <div id="mypage-dropdown" className={styles.mypageDropdown}>
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/me"
                        className={styles.dropdownItem}
                        onClick={toggleMypageDropdown}
                      >
                        마이페이지
                      </Link>
                      <Link
                        href="#"
                        className={styles.dropdownItem}
                        onClick={() => {
                          handleLogout();
                          toggleMypageDropdown();
                        }}
                      >
                        로그아웃
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signup"
                        className={styles.dropdownItem}
                        onClick={toggleMypageDropdown}
                      >
                        회원가입
                      </Link>
                      <Link
                        href="/signin"
                        className={styles.dropdownItem}
                        onClick={toggleMypageDropdown}
                      >
                        로그인
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
      {/* 반응형 영역 */}
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
              ✕
            </button>
          </div>

          <ul className={styles.drawerList}>
            {pages.map((page) => (
              <li key={page.name} className={styles.drawerListItem}>
                <Link
                  href={page.path}
                  className={styles.drawerLink}
                  onClick={toggleDrawer(false)}
                >
                  {page.name}
                </Link>
              </li>
            ))}
            <Link
              href="/signin"
              onClick={toggleDrawer(false)}
            >
              <Image
                src="/assets/login-profile.png"
                alt="마이페이지"
                width={24}
                height={24}
                className={styles.drawerIcon}
              />
            </Link>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;

