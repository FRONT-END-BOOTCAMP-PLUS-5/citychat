"use client";

import { useUserStore } from "@/app/stores/useUserStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AUTH_CONFIG } from "@/config/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const user = useUserStore((state) => state.user);
  const isLoggingOut = useUserStore((state) => state.isLoggingOut);
  const setLoggingOut = useUserStore((state) => state.setLoggingOut);
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // 로그아웃 진행 중일 때는 로직 무시
    if (isLoggingOut) {
      // 메인 페이지 도착시 로그아웃 상태 해제
      if (pathname === "/") {
        setLoggingOut(false);
      }
      return;
    }

    const isProtectedPath = AUTH_CONFIG.protectedPaths.some((path) =>
      pathname.startsWith(path)
    );
    const isAuthPath = AUTH_CONFIG.authPaths.some((path) =>
      pathname.startsWith(path)
    );

    if (isProtectedPath && !user) {
      // 보호된 페이지인데 로그인하지 않은 경우
      router.push("/signin");
    } else if (isAuthPath && user) {
      // 로그인/회원가입 페이지인데 이미 로그인한 경우
      router.push("/");
    }
  }, [user, pathname, router, isHydrated, isLoggingOut, setLoggingOut]);

  return <>{children}</>;
}

