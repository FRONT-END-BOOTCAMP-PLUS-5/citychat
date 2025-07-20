"use client";
import React from "react";
import "./shared-page-layout.css";
import "./globals.css"; // 전역 스타일
import Footer from "./components/Footer";

interface SharedPageLayoutProps {
  children: React.ReactNode;
  title: string;
  imgUrl?: string;
}

export default function SharedPageLayout({
  children,
  title,
  imgUrl = "https://images.unsplash.com/photo-1603883055407-968560f7522e?q=80&w=920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
}: SharedPageLayoutProps) {
  return (
    <div> 
      <div className="layout-container">
        <div className="fixed-background" style={{ backgroundImage: `url(${imgUrl})` }}></div>
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
