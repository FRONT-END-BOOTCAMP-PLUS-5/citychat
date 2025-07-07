import React from 'react';
import './shared-page-layout.css';

interface SharedPageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function SharedPageLayout({ children, title }: SharedPageLayoutProps) {
  return (
    <div className="layout-container">
      <div className="fixed-background"></div>
      <main className="content-wrapper">
        <div className="content-box">
          <h1 className="page-title">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
