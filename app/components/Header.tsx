"use client";
import * as React from "react";
import "./header.css"; // CSS 파일을 import

const pages = ["Home", "About", "Seoul", "Jeju", "Mypage"];

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
    <header className="app-bar">
      <div className="container-wrapper">
        <div className="toolbar">
          {/* 로고/타이틀 부분 */}
          {/* <a href="/" className="logo-link">
            <img
              src="/logo.png"
              alt="CityChat Logo"
              className="logo-image"
              style={{ height: "40px" }}
            />
          </a> */}

          {/* 모바일 메뉴 아이콘 (햄버거 메뉴) */}
          <div className="mobile-menu-icon-wrapper">
            <button
              className="icon-button menu-icon"
              aria-label="메뉴 열기"
              onClick={toggleDrawer(true)}
            >
              ☰ {/* 햄버거 아이콘 */}
            </button>
          </div>

          {/* 데스크톱 내비게이션 */}
          <nav className="nav-desktop">
            {pages.map((page) => (
              <a
                href={`/${page.toLowerCase()}`}
                key={page}
                className="nav-item"
              >
                {page}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* 사이드바 (Drawer) 컴포넌트 */}
      <div className={`drawer ${isDrawerOpen ? "open" : ""}`}>
        <div className="drawer-content">
          {/* 사이드바 닫기 버튼 */}
          <div className="drawer-close-button-wrapper">
            <button
              className="icon-button close-icon"
              onClick={toggleDrawer(false)}
            >
              ✕ {/* 닫기 아이콘 */}
            </button>
          </div>
          {/* 사이드바 메뉴 리스트 */}
          <ul className="drawer-list">
            {pages.map((page) => (
              <li key={page} className="drawer-list-item">
                <a href={`/${page.toLowerCase()}`} className="drawer-link">
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
