'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store';
import { ArrowRight, CheckSquare, Triangle } from 'lucide-react';

export function LoginPage() {
  const { guestLogin, isLoading } = useAuthStore();
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleGuestLogin = async () => {
    try {
      setError('');
      await guestLogin();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to login as guest');
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth route
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50" style={{ backgroundColor: '#fbfbfb' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="px-6 py-3 rounded-full text-sm font-medium shadow-lg bg-[var(--color-bg-card)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Main Page Container */}
      <div 
        className="flex flex-col items-center justify-center" 
        style={{ 
          width: '1280px', 
          maxWidth: '100%', 
          height: '900px', 
          maxHeight: '100vh',
          gap: '24px', 
          opacity: 1, 
          padding: '40px',
          boxSizing: 'border-box'
        }}
      >
        {/* Pyramid Logo */}
        <div className="flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.1s', width: '1200px', maxWidth: '100%', height: 'fit-content', gap: '8px', opacity: 1, borderRadius: '6px' }}>
          <div className="flex items-center justify-center bg-gray-900 shadow-sm" style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '12px', 
            backgroundColor: '#111111',
            padding: '10px',
            border: '1.5px solid var(--base-sidebar-primary-foreground, rgba(250, 250, 250, 1))',
            gap: '8px',
            boxSizing: 'border-box'
          }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--base-sidebar-primary-foreground, rgba(250, 250, 250, 1))"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4.186 16.202l3.615 5.313c.265 .39 .754 .57 1.215 .447l10.166 -2.718a1.086 1.086 0 0 0 .713 -1.511l-7.505 -15.483a.448 .448 0 0 0 -.787 -.033l-7.453 12.838a1.07 1.07 0 0 0 .037 1.147z" />
                <path d="M8.5 22l3.5 -20" />
              </svg>
          </div>
          <span className="font-bold tracking-tight text-[var(--color-text-primary)]" style={{ fontSize: '19px', color: '#111111', lineHeight: '24px' }}>
            Pyramid
          </span>
        </div>

        {/* The Card */}
        <div 
          className="bg-[var(--color-bg-card)] animate-fade-in flex flex-col" 
          style={{ 
            animationDelay: '0.2s',
            width: '384px',
            gap: '24px',
            opacity: 1,
            padding: '24px',
            borderRadius: '32px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgba(229, 229, 229, 1)',
            borderTop: '1px solid rgba(229, 229, 229, 1)',
            boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)',
            boxSizing: 'border-box'
          }}
        >
          {/* Text Content */}
          <div className="flex flex-col w-full" style={{ alignItems: 'center' }}>
            <h1 className="font-bold text-[var(--color-text-primary)] tracking-tight" style={{ fontSize: '20px', marginBottom: '8px', color: '#111111' }}>
              Let's get back on track
            </h1>
            <p className="text-[var(--color-text-secondary)]" style={{ 
              fontFamily: 'sans-serif',
              fontWeight: 'normal',
              fontStyle: 'normal',
              fontSize: '14px',
              lineHeight: '20px',
              letterSpacing: '0%',
              textAlign: 'center'
            }}>
              Enter your email below to login to your account.
            </p>
          </div>

          {/* Buttons */}
          <fieldset className="flex flex-col items-center" style={{ width: '336px', height: '84px', gap: '12px', opacity: 1, padding: 0, margin: 0, border: 'none' }}>
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="flex items-center justify-center transition-all duration-200 disabled:opacity-60 text-white"
              style={{ 
                width: '336px',
                height: '36px',
                gap: '6px',
                opacity: 1,
                padding: '8px 12px',
                borderRadius: '32px',
                backgroundColor: 'rgba(23, 23, 23, 1)',
                fontSize: '13px', 
                fontWeight: '500',
                boxSizing: 'border-box',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isLoading ? 'Loading...' : 'Continue as Guest'}
            </button>

            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center transition-all duration-200 text-gray-800"
              style={{ 
                width: '336px',
                height: '36px',
                gap: '6px',
                opacity: 1,
                padding: '8px 12px', 
                borderRadius: '32px', 
                backgroundColor: 'rgba(255, 255, 255, 1)',
                border: '1px solid rgba(229, 229, 229, 1)',
                borderTop: '1px solid rgba(229, 229, 229, 1)',
                borderWidth: '1px',
                fontSize: '13px', 
                fontWeight: '600', 
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '16px', height: '16px', opacity: 1, transform: 'rotate(0deg)' }}
              >
                <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.4273 13.95H12V10.0727H21.4364C21.5454 10.6818 21.6 11.3182 21.6 11.9727C21.6 14.8864 20.6136 17.3364 18.8182 19.0591C17.0864 20.7318 14.7682 21.6 12 21.6C8.09084 21.6 4.70909 19.3591 3.06364 16.0909C2.38638 14.8409 2 13.4455 2 12C2 10.5545 2.38638 9.1591 3.06364 7.50914Z"/>
              </svg>
              Login with Google
            </button>

            {error && (
              <p className="text-center mt-2 text-red-500 font-medium" style={{ fontSize: '13px' }}>
                {error}
              </p>
            )}
          </fieldset>
        </div>

        {/* Footer Terms */}
        <p
          className="text-gray-400 animate-fade-in"
          style={{ 
            animationDelay: '0.3s', 
            width: '208px',
            height: '48px',
            opacity: 1,
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0%',
            textAlign: 'center'
          }}
        >
          By clicking continue, you agree to our <br />
          <a href="#" className="hover:text-gray-600 transition-colors" style={{
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0%',
            textAlign: 'center',
            textDecoration: 'underline',
            textDecorationStyle: 'solid',
            textUnderlineOffset: 'auto',
            textDecorationThickness: 'auto'
          }}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="hover:text-gray-600 transition-colors" style={{
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0%',
            textAlign: 'center',
            textDecoration: 'underline',
            textDecorationStyle: 'solid',
            textUnderlineOffset: 'auto',
            textDecorationThickness: 'auto'
          }}>Privacy <br /> Policy</a>
        </p>

      </div>
    </div>
  );
}
