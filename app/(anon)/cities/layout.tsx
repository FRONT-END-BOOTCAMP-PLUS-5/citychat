"use client";
import RootFooter from "@/app/components/Footer";
import RootHeader from "@/app/components/Header";

export default function AnonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <RootHeader />
      {children}
      <RootFooter />
    </div>
  );
}
