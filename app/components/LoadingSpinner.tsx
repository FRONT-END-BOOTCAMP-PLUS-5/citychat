"use client";
import { BasicDot } from "basic-loading";
import styles from "./loading.module.css";

const {
  ["spinner-container"]: spinnerContainer,
} = styles;

interface LoadingSpinnerProps {
  size: number;
}

export default function LoadingSpinner({ size }: LoadingSpinnerProps) {

  return (
    <div className={spinnerContainer}>
      <BasicDot option={{
        size: size,
        color: "#FFB703",
      }} />
    </div>
  );
}
