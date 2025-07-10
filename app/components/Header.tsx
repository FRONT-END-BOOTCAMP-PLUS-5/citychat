"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./header.module.css";
// import Avatar from "./Avatar";

// ─────── 페이지 목록 ───────
const pages = [
  // { name: "Home", path: "/" },
  // { name: "CITIES", path: "/cities" },
  // { name: "LANDMARK", path: "/landmark" },
  // { name: "ABOUT", path: "/about" },
  { name: "Home", path: "/" },
  { name: "Cities", path: "/cities" },
  { name: "Landmark", path: "/landmark" },
  { name: "About", path: "/about" },
];

function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isMypageDropdownOpen, setIsMypageDropdownOpen] = React.useState(false); // MYPAGE 드롭다운 상태 추가

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
        setIsMypageDropdownOpen(false); // 드로어가 열리면 마이페이지 드롭다운 닫기
      }
    };

  // MYPAGE 드롭다운 토글 함수
  const toggleMypageDropdown = () => {
    setIsMypageDropdownOpen((prev) => !prev);
  };

  // 문서 클릭 시 드롭다운 닫기 (클릭 이벤트 버블링 방지)
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mypageButton = document.getElementById("mypage-button");
      const mypageDropdown = document.getElementById("mypage-dropdown");

      if (
        mypageButton &&
        !mypageButton.contains(event.target as Node) &&
        mypageDropdown &&
        !mypageDropdown.contains(event.target as Node)
      ) {
        setIsMypageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.appBar}>
      <div className={styles.containerWrapper}>
        <div className={styles.toolbar}>
          {/* ─────── 로고 / 타이틀 ─────── */}
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

          {/* ─────── 모바일 햄버거 아이콘 ─────── */}
          <div className={styles.mobileMenuIconWrapper}>
            <button
              className={styles.iconButton}
              aria-label="메뉴 열기"
              onClick={toggleDrawer(true)}
            >
              ☰
            </button>
          </div>

          {/* ─────── 데스크톱 내비게이션 ─────── */}
          <nav className={styles.navDesktop}>
            {pages.map((page) => (
              <Link href={page.path} key={page.name} className={styles.navItem}>
                {page.name}
              </Link>
            ))}

            {/* MYPAGE 아이콘 및 드롭다운 */}
            <div className={styles.mypageContainer}>
              <button
                id="mypage-button"
                className={styles.mypageIconButton}
                onClick={toggleMypageDropdown}
                aria-haspopup="true" // 접근성을 위해 추가
                aria-expanded={isMypageDropdownOpen} // 접근성을 위해 추가
              >
                <Image
                  src="/assets/login-profile.png"
                  alt="MYPAGE"
                  width={30}
                  height={30}
                  className={styles.mypageIcon}
                />
                {/* <Avatar name="유상현" /> */}
              </button>
              {/* 프로필 테스트 */}
              {isMypageDropdownOpen && (
                <div id="mypage-dropdown" className={styles.mypageDropdown}>
                  <Link
                    href="/signin"
                    className={styles.dropdownItem}
                    onClick={toggleMypageDropdown}
                  >
                    회원가입
                  </Link>
                  <Link
                    href="/login"
                    className={styles.dropdownItem}
                    onClick={toggleMypageDropdown}
                  >
                    로그인
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* ─────── 사이드 Drawer ─────── */}
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
            <li className={styles.drawerListItem}>
              <Link
                href="/#"
                className={styles.drawerLink}
                onClick={toggleDrawer(false)}
              >
                <Image
                  src="/assets/login-profile.png"
                  alt="MYPAGE"
                  width={24}
                  height={24}
                  className={styles.drawerIcon}
                />
                회원가입
              </Link>
            </li>
            <li className={styles.drawerListItem}>
              <Link
                href="/#"
                className={styles.drawerLink}
                onClick={toggleDrawer(false)}
              >
                <Image
                  src="/assets/login-profile.png"
                  alt="MYPAGE"
                  width={24}
                  height={24}
                  className={styles.drawerIcon}
                />
                로그인
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
