"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./header.module.css";
import Avatar from "./Avatar";
import { useUserStore } from "@/app/stores/useUserStore";

// ─────── 페이지 목록 ───────
const pages = [
  { name: "Home", path: "/" },
  { name: "Cities", path: "/cities" },
  { name: "Landmark", path: "/landmark" },
  { name: "About", path: "/about" },
];

function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isMypageDropdownOpen, setIsMypageDropdownOpen] = React.useState(false);

  // Zustand 스토어에서 상태와 액션
  const user = useUserStore((state) => state.user); // 유저 정보 데이터
  const clearUser = useUserStore((state) => state.clearUser); // 로그아웃 액션

  // 로그인 여부 확인
  const isLoggedIn = !!user;

  // 로그아웃 이벤트
  const handleLogout = () => {
    clearUser();
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
      }
    };

  // 토글로 드롭다운을 열고 닫는 기능
  const toggleMypageDropdown = () => {
    setIsMypageDropdownOpen((prev) => !prev);
  };

  // 마우스 클릭시 드롭다운과 안에 있는 요소들(회원가입,로그인 등..)(한번만 실행 :,[])
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mypageButton = document.getElementById("mypage-button");
      const mypageDropdown = document.getElementById("mypage-dropdown");

      // 클릭된 버튼과 드롭다운 요소 포함 여부 확인
      if (
        mypageButton &&
        !mypageButton.contains(event.target as Node) &&
        mypageDropdown &&
        !mypageDropdown.contains(event.target as Node)
      ) {
        setIsMypageDropdownOpen(false); // 드롭다운 자동 닫힘
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
            {pages.map((page) => (
              <Link href={page.path} key={page.name} className={styles.navItem}>
                {page.name}
              </Link>
            ))}
            {/* 아이콘 버튼 */}
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
              {/* 드롭다운 내용 변경 */}
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
            {isLoggedIn ? (
              <>
                <li className={styles.drawerListItem}>
                  <Link
                    href="/mypage"
                    className={styles.drawerLink}
                    onClick={toggleDrawer(false)}
                  >
                    <Image
                      src="/assets/login-profile.png"
                      alt="마이페이지"
                      width={24}
                      height={24}
                      className={styles.drawerIcon}
                    />
                    마이페이지
                  </Link>
                </li>
                <li className={styles.drawerListItem}>
                  <button
                    className={styles.drawerLink}
                    onClick={() => {
                      handleLogout();
                      toggleDrawer(false);
                    }}
                  >
                    <Image
                      src="/assets/login-profile.png"
                      alt="로그아웃"
                      width={24}
                      height={24}
                      className={styles.drawerIcon}
                    />
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className={styles.drawerListItem}>
                  <Link
                    href="/signin"
                    className={styles.drawerLink}
                    onClick={toggleDrawer(false)}
                  >
                    <Image
                      src="/assets/login-profile.png"
                      alt="회원가입"
                      width={24}
                      height={24}
                      className={styles.drawerIcon}
                    />
                    회원가입
                  </Link>
                </li>
                <li className={styles.drawerListItem}>
                  <Link
                    href="/login"
                    className={styles.drawerLink}
                    onClick={toggleDrawer(false)}
                  >
                    <Image
                      src="/assets/login-profile.png"
                      alt="로그인"
                      width={24}
                      height={24}
                      className={styles.drawerIcon}
                    />
                    로그인
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
