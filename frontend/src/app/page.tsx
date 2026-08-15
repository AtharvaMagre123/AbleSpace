'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { LoginPage } from '@/components/auth/login-page';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function Home() {
  const { isAuthenticated, loadUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for Google OAuth callback in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    
    if (token && userStr) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', userStr);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    loadUser();
  }, [loadUser]);

  // Don't render anything during SSR — avoids hydration mismatches
  // from browser extensions injecting attributes (e.g. bis_skin_checked)
  if (!mounted) {
    return null;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <DashboardLayout />;
}
