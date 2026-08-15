"use client";

import { useState } from "react";
import { useAuthStore, useUIStore } from "@/store";
import { useTheme } from "@/lib/theme-provider";
import {
  LayoutGrid,
  Folder,
  Settings,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Check,
  X,
} from "lucide-react";

interface SidebarProps {
  onClose: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { user } = useAuthStore();
  const { activePage, setActivePage } = useUIStore();
  const { themeMode, setThemeMode, colorMode, setColorMode, colorModes } =
    useTheme();

  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);

  const DashboardSquare03Icon = (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      color="currentColor"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.75 3H5.75C5.05222 3 4.70333 3 4.41943 3.08612C3.78023 3.28002 3.28002 3.78023 3.08612 4.41943C3 4.70333 3 5.05222 3 5.75C3 6.44778 3 6.79667 3.08612 7.08057C3.28002 7.71977 3.78023 8.21998 4.41943 8.41388C4.70333 8.5 5.05222 8.5 5.75 8.5H9.75C10.4478 8.5 10.7967 8.5 11.0806 8.41388C11.7198 8.21998 12.22 7.71977 12.4139 7.08057C12.5 6.79667 12.5 6.44778 12.5 5.75C12.5 5.05222 12.5 4.70333 12.4139 4.41943C12.22 3.78023 11.7198 3.28002 11.0806 3.08612C10.7967 3 10.4478 3 9.75 3Z"></path>
      <path d="M21 9.75V5.75C21 5.05222 21 4.70333 20.9139 4.41943C20.72 3.78023 20.2198 3.28002 19.5806 3.08612C19.2967 3 18.9478 3 18.25 3C17.5522 3 17.2033 3 16.9194 3.08612C16.2802 3.28002 15.78 3.78023 15.5861 4.41943C15.5 4.70333 15.5 5.05222 15.5 5.75V9.75C15.5 10.4478 15.5 10.7967 15.5861 11.0806C15.78 11.7198 16.2802 12.22 16.9194 12.4139C17.2033 12.5 17.5522 12.5 18.25 12.5C18.9478 12.5 19.2967 12.5 19.5806 12.4139C20.2198 12.22 20.72 11.7198 20.9139 11.0806C21 10.7967 21 10.4478 21 9.75Z"></path>
      <path d="M16.9194 20.9139C17.2033 21 17.5522 21 18.25 21C18.9478 21 19.2967 21 19.5806 20.9139C20.2198 20.72 20.72 20.2198 20.9139 19.5806C21 19.2967 21 18.9478 21 18.25C21 17.5522 21 17.2033 20.9139 16.9194C20.72 16.2802 20.2198 15.78 19.5806 15.5861C19.2967 15.5 18.9478 15.5 18.25 15.5C17.5522 15.5 17.2033 15.5 16.9194 15.5861C16.2802 15.78 15.78 16.2802 15.5861 16.9194C15.5 17.2033 15.5 17.5522 15.5 18.25C15.5 18.9478 15.5 19.2967 15.5861 19.5806C15.78 20.2198 16.2802 20.72 16.9194 20.9139Z"></path>
      <path d="M8.5 11.5H7C5.11438 11.5 4.17157 11.5 3.58579 12.0858C3 12.6716 3 13.6144 3 15.5V17C3 18.8856 3 19.8284 3.58579 20.4142C4.17157 21 5.11438 21 7 21H8.5C10.3856 21 11.3284 21 11.9142 20.4142C12.5 19.8284 12.5 18.8856 12.5 17V15.5C12.5 13.6144 12.5 12.6716 11.9142 12.0858C11.3284 11.5 10.3856 11.5 8.5 11.5Z"></path>
    </svg>
  );

  const GalleryVerticalEndIcon = (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 2h10" />
      <path d="M5 6h14" />
      <rect width="18" height="12" x="3" y="10" rx="2" />
    </svg>
  );

  const navItems = [
    { id: "tasks", icon: DashboardSquare03Icon, label: "Tasks" },
    { id: "projects", icon: GalleryVerticalEndIcon, label: "Projects" },
  ] as const;

  return (
    <div className="w-full h-full bg-[var(--color-bg-primary)] border-r border-[var(--color-border)] p-3 flex flex-col shrink-0 relative z-50">
      {/* Mobile Close Button */}
      <div
        className="lg:hidden flex justify-end p-2 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <button
          onClick={onClose}
          className="p-2 rounded-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Top User Profile */}
      <div className="relative mb-4">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-full flex items-center justify-between px-1.5 py-1 rounded-md transition-colors outline-none hover:bg-neutral-200/40"
        >
          <div className="flex items-center gap-2">
            <img
              src={
                user?.avatar ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"
              }
              alt="Avatar"
              className="w-[26px] h-[26px] rounded-full shrink-0 object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "Guest"}` }}
            />
            <span className="text-[13px] font-medium text-[var(--color-text-primary)]">
              {user?.fullName || user?.username || "Guest User"}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <ChevronDown className="w-3 h-3 text-[var(--color-text-tertiary)]" />
          </div>
        </button>
        {userMenuOpen && (
          <div
            className="absolute top-full left-0 w-full mt-1 p-2 rounded-xl shadow-lg border animate-scale-in z-50"
            style={{
              background: "var(--color-bg-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <div
              className="flex flex-col items-center p-4 border-b mb-2"
              style={{ borderColor: "var(--color-border)" }}
            >
              <img
                src={
                  user?.avatar ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"
                }
                alt="Avatar"
                className="w-16 h-16 rounded-full mb-3"
                style={{ border: "2px solid var(--color-border)" }}
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "Guest"}` }}
              />
              <h3
                className="text-sm font-semibold truncate"
                style={{ color: "var(--color-text-primary)" }}
              >
                {user?.fullName || user?.username || "Guest User"}
              </h3>
              <p
                className="text-xs truncate"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {user?.email || "guest@pyramid.com"}
              </p>
            </div>

            {/* Submenus */}
            <div className="space-y-1 relative">
              {/* Change Theme Toggle */}
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-[var(--color-bg-hover)]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <span className="flex items-center gap-2">
                  <Sun className="w-4 h-4" /> Change Theme
                </span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${themeMenuOpen ? "rotate-90" : ""}`}
                />
              </button>

              {themeMenuOpen && (
                <div
                  className="absolute left-full ml-2 top-0 w-36 rounded-lg py-1 shadow-lg border z-50 animate-scale-in"
                  style={{
                    background: "var(--color-bg-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <button
                    onClick={() => {
                      setThemeMode("light");
                      setThemeMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--color-bg-hover)]"
                  >
                    <span className="flex items-center gap-2">
                      <Sun className="w-4 h-4" /> Light
                    </span>
                    {themeMode === "light" && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setThemeMode("dark");
                      setThemeMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--color-bg-hover)]"
                  >
                    <span className="flex items-center gap-2">
                      <Moon className="w-4 h-4" /> Dark
                    </span>
                    {themeMode === "dark" && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </button>
                </div>
              )}

              {/* Color Mode Toggle */}
              <button
                onClick={() => setColorMenuOpen(!colorMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-[var(--color-bg-hover)]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <span className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{
                      backgroundColor:
                        colorModes.find((m) => m.id === colorMode)?.preview ||
                        "#3b82f6",
                    }}
                  />
                  Color Mode
                </span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${colorMenuOpen ? "rotate-90" : ""}`}
                />
              </button>

              {colorMenuOpen && (
                <div
                  className="absolute left-full ml-2 top-0 w-36 rounded-lg py-1 shadow-lg border z-50 animate-scale-in"
                  style={{
                    background: "var(--color-bg-card)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  {colorModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setColorMode(mode.id);
                        setColorMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--color-bg-hover)]"
                    >
                      <span className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: mode.preview }}
                        />
                        {mode.name}
                      </span>
                      {colorMode === mode.id && (
                        <Check className="w-4 h-4 text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Settings Button */}
              <button
                onClick={() => {
                  setActivePage("settings");
                  setUserMenuOpen(false);
                  if (window.innerWidth < 1024) onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-[var(--color-bg-hover)]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Workspace Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="mt-4">
          <div
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="flex items-center justify-between px-2 mb-1 cursor-pointer group"
          >
            <span className="text-[12px] font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
              Workspace
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${workspaceOpen ? "" : "-rotate-90"}`}
              style={{ color: "var(--color-text-tertiary)" }}
            />
          </div>

          {workspaceOpen && (
            <div className="flex flex-col gap-[2px]">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${isActive ? "bg-neutral-200/40 text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] hover:bg-neutral-200/40 hover:text-[var(--color-text-primary)]"}`}
                  >
                    <div className="relative w-4 h-4 shrink-0">
                      <item.icon
                        className="absolute"
                        style={{
                          width: "12px",
                          height: "12px",
                          top: "2px",
                          left: "2px",
                          strokeWidth: "1.5px",
                          color: "var(--base-foreground, rgba(10, 10, 10, 1))",
                        }}
                      />
                    </div>
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
