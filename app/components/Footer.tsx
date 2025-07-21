"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContentWrapper}>
        <Link href="/" className={styles.footerLogo}>
            <Image
              src="/assets/citychat2.png"
              alt="CityChat"
              width={50}
              height={50}
              priority
            />
          </Link>
        <div className={styles.footerLinks}>
            <p className={styles.footerText}>6조 1차 프로젝트</p>
            <p className={styles.footerText}>
              <Link
                href="https://citychat-beta.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                배포 사이트 주소 링크
              </Link>
            </p>
          </div>
        
        {/* 오른쪽: 소셜 아이콘 */}
        <ul className={styles.socialIcons}>
          <li>
            <Link
              href="https://github.com/FRONT-END-BOOTCAMP-PLUS-5/citychat"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/assets/github.png"
                alt="GitHub"
                width={24}
                height={24}
              />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
