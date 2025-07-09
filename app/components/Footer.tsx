"use client";
import "./footer.css";

import Image from "next/image";

export default function Footer() {
  return (
    // Box 컴포넌트 역할(전체적인 영역)을 하는 div
    <div className="footer-container">
      {/* Container(분할 시켜줄 영역) 컴포넌트 역할을 하는 div */}
      <div className="footer-content-wrapper">
        {/* Left section: Logo and texts */}
        <div className="footer-left-section">
          <div className="footer-logo">
            <Image
              src="/assets/citychat2.png"
              alt="CityChat"
              width={50}
              height={50}
            />
            {/* Replace with your logo path */}
          </div>
          <div className="footer-links">
            <p className="footer-text personal-data-agreement">
              6조 1차 프로젝트
            </p>
            <p className="footer-text personal-data-agreement">
              배포 사이트 주소 링크
            </p>
          </div>
        </div>

        {/* Right section: Social media icons */}
        <div className="footer-right-section">
          <ul className="social-icons">
            <li>
              <a href="#">
                <Image
                  src="/assets/github.png"
                  alt="github"
                  width={24}
                  height={24}
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
