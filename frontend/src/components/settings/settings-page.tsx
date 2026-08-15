'use client';

import { useState } from 'react';
import { useAuthStore, useUIStore } from '@/store';
import { useTheme } from '@/lib/theme-provider';
import { ArrowLeft, Search, Edit2, Check } from 'lucide-react';

type SettingsTab = 'profile' | 'theme' | 'color';

export function SettingsPage() {
  const { user, updateProfile, logout } = useAuthStore();
  const { setActivePage } = useUIStore();
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    title: user?.title || '',
    username: user?.username || '',
    email: user?.email || '',
  });

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const { themeMode, setThemeMode, colorMode, setColorMode, colorModes } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex w-full h-full bg-[var(--color-bg-card)]">
      {/* Settings Sidebar */}
      <div className="w-64 border-r shrink-0 flex flex-col" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-sidebar)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <button 
            onClick={() => setActivePage('tasks')}
            className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to app
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-[var(--color-bg-card)] focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'profile' ? 'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('theme')}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'theme' ? 'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"></path></svg>
              Theme
            </button>
            <button 
              onClick={() => setActiveTab('color')}
              className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'color' ? 'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
              }`}
            >
              <div className="w-4 h-4 rounded" style={{ background: 'var(--color-accent)' }} />
              Color
            </button>
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-8 overflow-y-auto flex flex-col">
        <div className="w-full max-w-[640px] m-auto">
          {activeTab === 'profile' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-medium leading-none tracking-normal text-[var(--color-text-primary)]">Profile</h1>
                {isSaving && <span className="text-sm text-[var(--color-text-secondary)]">Saving...</span>}
              </div>

              <div className="rounded-xl border bg-[var(--color-bg-card)] overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
                
                {/* Profile Picture */}
                <div className="flex items-center justify-between h-[82px] min-h-[60px] px-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-xs font-medium tracking-normal text-[var(--color-text-primary)]">Profile picture</span>
                  <img 
                    src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} 
                    alt="Avatar" 
                    className="w-12 h-12 rounded-full border"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "Guest"}` }}
                  />
                </div>

                {/* Email */}
                <div className="flex items-center justify-between h-[82px] min-h-[60px] px-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-xs font-medium tracking-normal text-[var(--color-text-primary)]">Email</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[var(--color-text-secondary)]">{formData.email || 'guest@pyramid.com'}</span>
                    <button className="p-1 rounded text-gray-400 hover:text-[var(--color-text-primary)] transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div className="flex items-center justify-between h-[82px] min-h-[60px] px-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-xs font-medium tracking-normal text-[var(--color-text-primary)]">Full name</span>
                  <input 
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleSave}
                    placeholder="Guest User"
                    className="w-64 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] bg-transparent text-[var(--color-text-primary)]"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                {/* Title */}
                <div className="flex items-center justify-between h-[82px] min-h-[60px] px-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <span className="block text-xs font-medium tracking-normal text-[var(--color-text-primary)] mb-1">Title</span>
                    <span className="block text-xs text-[var(--color-text-secondary)]">Your job title or role</span>
                  </div>
                  <input 
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={handleSave}
                    placeholder="Designer"
                    className="w-64 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] bg-transparent text-[var(--color-text-primary)]"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>

                {/* Username */}
                <div className="flex items-center justify-between h-[82px] min-h-[60px] px-6">
                  <div>
                    <span className="block text-xs font-medium tracking-normal text-[var(--color-text-primary)] mb-1">Username</span>
                    <span className="block text-xs text-[var(--color-text-secondary)]">One word, like a nickname or first name</span>
                  </div>
                  <input 
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleSave}
                    placeholder="Dexuser"
                    className="w-64 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] bg-transparent text-[var(--color-text-primary)]"
                    style={{ borderColor: 'var(--color-border)' }}
                  />
                </div>
              </div>

              <h2 className="text-base font-medium leading-none tracking-normal text-[var(--color-text-primary)] mt-12 mb-4">Workspace access</h2>
              <div className="rounded-xl border bg-[var(--color-bg-card)] p-6 flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-xs font-medium tracking-normal text-[var(--color-text-secondary)]">Remove yourself from the workspace</span>
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to leave this workspace?')) {
                      logout();
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                >
                  Leave Workspace
                </button>
              </div>
            </>
          )}

          {activeTab === 'theme' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-medium leading-none tracking-normal text-[var(--color-text-primary)]">Theme</h1>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setThemeMode('light')}
                  className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-3 transition-all ${
                    themeMode === 'light' ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]' : 'border-gray-200 hover:border-gray-300 dark:border-gray-800'
                  }`}
                  style={{ background: 'var(--color-bg-card)' }}
                >
                  <div className="w-16 h-12 bg-gray-50 border border-gray-200 rounded overflow-hidden flex flex-col">
                    <div className="h-3 bg-white border-b border-gray-200 w-full shrink-0" />
                    <div className="flex-1 flex p-1 gap-1">
                      <div className="w-4 h-full bg-gray-100 rounded-sm" />
                      <div className="flex-1 h-full bg-white rounded-sm border border-gray-100" />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">Light</span>
                </button>
                
                <button
                  onClick={() => setThemeMode('dark')}
                  className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-3 transition-all ${
                    themeMode === 'dark' ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]' : 'border-gray-200 hover:border-gray-300 dark:border-gray-800'
                  }`}
                  style={{ background: 'var(--color-bg-card)' }}
                >
                  <div className="w-16 h-12 bg-gray-900 border border-gray-700 rounded overflow-hidden flex flex-col">
                    <div className="h-3 bg-gray-800 border-b border-gray-700 w-full shrink-0" />
                    <div className="flex-1 flex p-1 gap-1">
                      <div className="w-4 h-full bg-gray-800 rounded-sm" />
                      <div className="flex-1 h-full bg-gray-900 rounded-sm border border-gray-800" />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">Dark</span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'color' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-medium leading-none tracking-normal text-[var(--color-text-primary)]">Color</h1>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {colorModes.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setColorMode(color.id)}
                    className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-3 transition-all ${
                      colorMode === color.id ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]' : 'border-gray-200 hover:border-gray-300 dark:border-gray-800'
                    }`}
                    style={{ background: 'var(--color-bg-card)' }}
                  >
                    <div 
                      className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center"
                      style={{ backgroundColor: color.preview }}
                    >
                      {colorMode === color.id && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{color.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
