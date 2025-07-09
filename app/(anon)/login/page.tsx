"use client";
import React from 'react';
import styles from './page.module.css';
import SharedPageLayout from '@/app/SharedPageLayout';

const {
  ["form-container"]: formContainer,
  ["login-form"]: loginForm,
  ["form-title"]: formTitle,
  ["form-group"]: formGroup,
  ["form-label"]: formLabel,
  ["form-input"]: formInput,
  ["form-button"]: formButton,
} = styles;

export default function LoginPage() {
  return (
    <SharedPageLayout title="Login">
          <div className={formContainer}>
            <h3 className={formTitle}>Login</h3>
            <form className={loginForm}>
              
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
    
              <button type="submit" className={formButton}>
                Login
              </button>
            </form>
          </div>
        </SharedPageLayout>
  );
}
