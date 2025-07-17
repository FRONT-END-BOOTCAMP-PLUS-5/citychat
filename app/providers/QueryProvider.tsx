"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // 창이 포커스될 때 자동으로 다시 가져오지 않음
        retry: 1, // 실패 시 재시도 횟수
      },
      mutations: {
        retry: 1, // 실패 시 재시도 횟수
      },
    }});

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
