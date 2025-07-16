"use client";

import { useUserStore } from "@/app/stores/useUserStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthGuardProps { children: React.ReactNode }

export default function AuthGuard({ children }: AuthGuardProps) {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  // 로그인이 필요한 페이지들
  const protectedPaths = ["/me", "/chatrooms"];

  // 로그인한 사용자가 접근하면 안 되는 페이지들 (로그인/회원가입)
  const authPaths = ["/signin", "/signup"];

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {

    if(!isHydrated) return;

    const isProtectedPath = protectedPaths.some((path) =>
      pathname.startsWith(path)
    );
    const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
    
    if (isProtectedPath && !user) {
      // 보호된 페이지인데 로그인하지 않은 경우
      router.push("/signin");
    } else if (isAuthPath && user) {
      // 로그인/회원가입 페이지인데 이미 로그인한 경우
      router.push("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pathname, router]);

  return <>{children}</>;
}
