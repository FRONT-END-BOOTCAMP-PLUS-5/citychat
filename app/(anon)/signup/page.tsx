"use client";
import React from 'react';
import styles from './page.module.css';
import SharedPageLayout from '@/app/SharedPageLayout';

const {
  ["form-container"]: formContainer,
  ["signup-form"]: signupForm,
  ["form-title"]: formTitle,
  ["form-group"]: formGroup,
  ["form-label"]: formLabel,
  ["form-input"]: formInput,
  ["form-button"]: formButton,
} = styles;

export default function SignupPage() {
  return (
    <SharedPageLayout title="Sign up">
      <div className={formContainer}>
        <h3 className={formTitle}>Personal Information</h3>
        <form className={signupForm}>
          <div className={formGroup}>
            <label htmlFor="nickname" className={formLabel}>Nickname</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              className={formInput}
              placeholder="Enter Nickname"
              required
            />
          </div>
          
          <div className={formGroup}>
            <label htmlFor="userid" className={formLabel}>ID</label>
            <input
              type="text"
              id="userid"
              name="userid"
              className={formInput}
              placeholder="Enter ID"
              required
            />
          </div>

          <div className={formGroup}>
            <label htmlFor="email" className={formLabel}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className={formInput}
              placeholder="Enter Email"
              required
            />
          </div>

          <div className={formGroup}>
            <label htmlFor="password" className={formLabel}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={formInput}
              placeholder="Enter Password"
              required
            />
          </div>

          <div className={formGroup}>
            <label htmlFor="password" className={formLabel}>Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              className={formInput}
              placeholder="Confirm Password"
              required
            />
          </div>

          <button type="submit" className={formButton}>
            Sign Up
          </button>
        </form>
      </div>
    </SharedPageLayout>
  );
}
