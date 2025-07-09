"use client";
import React from "react";
import useSnapScroll from "../features/pageTransition/useSnapScroll"; // useSnapScroll 훅 불러오기

interface SnapScrollContainerProps {
  containerId: string;
  children: React.ReactNode;
}

export default function SnapScrollContainer({
  containerId,
  children,
}: SnapScrollContainerProps) {
  useSnapScroll(containerId);

  return <div id={containerId}>{children}</div>;
}
