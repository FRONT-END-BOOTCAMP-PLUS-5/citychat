"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./header.module.css";
import Avatar from "./Avatar";

// ─────── 페이지 목록 ───────
const pages = [
  { name: "Home", path: "/" },
  { name: "Cities", path: "/cities" },
  { name: "Landmark", path: "/landmark" },
  { name: "About", path: "/about" },
];

interface UserInfo {
  email: string;
  nickname: string;
  language: string;
  userRole: string;
  deletedFlag: boolean;
}

function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isMypageDropdownOpen, setIsMypageDropdownOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      const token = localStorage.getItem("userToken");
      const user = localStorage.getItem("user");

      if (token && user) {
        try {
          const parsedUser: UserInfo = JSON.parse(user);
          // ─── 여기에 console.log 추가 ───
          console.log("파싱된 사용자 데이터:", parsedUser);
          console.log("파싱된 닉네임:", parsedUser.nickname);
          // ────────────────────────────────
          setUserInfo(parsedUser);
          setIsLoggedIn(true);
        } catch (err) {
          console.error("user 파싱 실패:", err);
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    handleUpdate();
    window.addEventListener("storageUpdate", handleUpdate);
    return () => window.removeEventListener("storageUpdate", handleUpdate);
  }, []);

  // ... (나머지 코드는 동일)

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserInfo(null);
  };

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

  const toggleMypageDropdown = () => {
    setIsMypageDropdownOpen((prev) => !prev);
  };

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

            <div className={styles.mypageContainer}>
              <button
                id="mypage-button"
                className={styles.mypageIconButton}
                onClick={toggleMypageDropdown}
                aria-haspopup="true"
                aria-expanded={isMypageDropdownOpen}
              >
                {isLoggedIn && userInfo?.nickname ? (
                  <Avatar name={userInfo.nickname} />
                ) : (
                  <Image
                    src="/assets/login-profile.png"
                    alt="MYPAGE"
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
                        href="/mypage"
                        className={styles.dropdownItem}
                        onClick={toggleMypageDropdown}
                      >
                        마이페이지
                      </Link>
                      <button
                        className={styles.dropdownItem}
                        onClick={() => {
                          handleLogout();
                          toggleMypageDropdown();
                        }}
                      >
                        로그아웃
                      </button>
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
                        href="/login"
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
