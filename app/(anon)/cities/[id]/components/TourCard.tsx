"use client";
import React from "react";
import styles from "./tourCard.module.css";

interface TourCardProps {
  rlteTatsNm: string;
  areaNm: string;
  rlteSignguNm: string;
  rlteCtgrySclsNm: string;
}

const TourCard: React.FC<TourCardProps> = ({
  rlteTatsNm,
  areaNm,
  rlteSignguNm,
  rlteCtgrySclsNm,
}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{rlteTatsNm}</h3>
      <p className={styles.description}>지역: {areaNm} {rlteSignguNm}</p>
      <p className={styles.description}>분류: {rlteCtgrySclsNm}</p>
    </div>
  );
};

export default TourCard;
