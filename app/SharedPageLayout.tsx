"use client";
import React from "react";
import "./shared-page-layout.css";
import "./globals.css"; // 전역 스타일
import Footer from "./components/Footer";

interface SharedPageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function SharedPageLayout({
  children,
  title,
}: SharedPageLayoutProps) {
  return (
    <div> 
      <div className="layout-container">
        <div className="fixed-background"></div>
        <main className="content-wrapper">
          <div style={{ height: "10vh", backgroundColor: "transparent", position: "sticky", top: 0, zIndex: 5 }}></div>
          <div style={{ height: "10vh", backgroundColor: "transparent" }}></div>
          <div className="content-box">
            <div className="content-inner">
              <h1 className="page-title">{title}</h1>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div> 

  );
}
