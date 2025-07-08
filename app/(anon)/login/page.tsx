import React from 'react';
import './page.module.css';
import SharedPageLayout from '@/app/SharedPageLayout';

export default function LoginPage() {
  return (
    <SharedPageLayout title="Login">
      <div className="login-page">
        <div className="login-container">
          
          <form className="login-form" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '400px',
            margin: '0 auto',
            padding: '2rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                placeholder="ID"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter Password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter Password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter Password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter Password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter Password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter Password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter Password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter Password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter Password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter Password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter Password"
                required
              />
            </div>
            
            <button type="submit" className="login-button">
              inscrever-se
            </button>
          </form>
        </div>
      </div>
    </SharedPageLayout>
    
  );
}
