"use client";
import "./footer.css"; // Import your CSS file for styling

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
              src="/assets/CityChat.png"
              alt="CityChat"
              width={100}
              height={100}
            />
            {/* Replace with your logo path */}
          </div>
          <div className="footer-links">
            <p className="footer-text personal-data-agreement">
              사이트 경로 넣을 곳
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
