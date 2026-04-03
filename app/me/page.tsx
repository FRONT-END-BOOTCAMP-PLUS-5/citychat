"use client";
import SharedPageLayout from "@/app/SharedPageLayout";
import styles from "./page.module.css";
import React from "react";
import { useUserStore } from "@/stores/useUserStore";
import Avatar from "@/app/components/Avatar";
import { ChevronRight, MessagesSquare, User, LucideIcon } from "lucide-react";
import Link from "next/link";
import { useSignout } from "@/hooks/useSignout";

const {
  ["page-container"]: pageContainer,
  ["content-wrapper"]: contentWrapper,
  ["mobile-avatar-container"]: mobileAvatarContainer,
  ["profile-section"]: profileSection,
  ["nickname"]: nickname,
  ["menu-list"]: menuList,
  ["menu-item"]: menuItem,
  ["menu-icon"]: menuIcon,
  ["menu-text"]: menuText,
  ["menu-arrow"]: menuArrow,
  ["sign-out-button"]: signOutButton,
} = styles;

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { icon: User, label: "My Account", href: "/me/account" },
  { icon: MessagesSquare, label: "My chats", href: "/me/chats" },
];

export default function MePage() {
  const user = useUserStore((state) => state.user);
  const { mutate: signout } = useSignout();

  return (
    <SharedPageLayout title="My page">
      <div className={pageContainer}>
        <div className={contentWrapper}>
          <div className={mobileAvatarContainer}>
            <div className={profileSection}>
              <Avatar name={user?.nickname} size={80} />
              <div className={nickname}>
                {user?.nickname || "Guest User"}
              </div>
            </div>
          </div>
          <div className={menuList}>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                scroll={false}
                className={menuItem}
              >
                <div className={menuIcon}>
                  <item.icon />
                </div>
                <span className={menuText}>{item.label}</span>
                <div className={menuArrow}>
                  <ChevronRight />
                </div>
              </Link>
            ))}
          </div>
          <button
            type="button"
            onClick={() => signout()}
            className={signOutButton}
          >
            Sign out
          </button>
        </div>
      </div>
    </SharedPageLayout>
  );
}

