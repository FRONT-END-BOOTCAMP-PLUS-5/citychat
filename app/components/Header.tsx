"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./header.module.css";

// ─────── 페이지 목록 ───────
const pages = ["Home", "Citys", "Landmark", "About", "Mypage"];

function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

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
    };

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
              <a
                href={`/${page.toLowerCase()}`}
                key={page}
                className={styles.navItem}
              >
                {page}
              </a>
            ))}
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
              <li key={page} className={styles.drawerListItem}>
                <a
                  href={`/${page.toLowerCase()}`}
                  className={styles.drawerLink}
                  onClick={toggleDrawer(false)}
                >
                  {page}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
