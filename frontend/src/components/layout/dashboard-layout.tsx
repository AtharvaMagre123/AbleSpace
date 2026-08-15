'use client';

import { useState, useEffect } from 'react';
import { useTasksStore, useProjectsStore, useUIStore } from '@/store';
import { Sidebar } from './sidebar';
import { TaskBoard } from '@/components/tasks/task-board';
import { ProjectsPage } from '@/components/projects/projects-page';
import { SettingsPage } from '@/components/settings/settings-page';
import { FieldsDropdown } from '@/components/tasks/fields-dropdown';
import { TaskDetailsModal } from '@/components/tasks/task-details-modal';
import { FilterDropdown } from './filter-dropdown';
import { Sidebar as SidebarIcon, Plus, Search } from 'lucide-react';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const { fetchTasks, fetchStats, filter, setFilter } = useTasksStore();
  const [searchQuery, setSearchQuery] = useState(filter.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filter.search !== searchQuery) {
        setFilter({ search: searchQuery });
        fetchTasks();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filter.search, setFilter, fetchTasks]);
  const { fetchProjects } = useProjectsStore();
  const { activePage } = useUIStore();

  useEffect(() => {
    fetchTasks();
    fetchStats();
    fetchProjects();
  }, [fetchTasks, fetchStats, fetchProjects]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-card)]">
      {/* Desktop Sidebar */}
      {activePage !== 'settings' && (
        <div
          className={`hidden lg:block transition-all duration-300 ${sidebarOpen ? 'w-[232px] overflow-visible' : 'w-0 overflow-hidden'} shrink-0`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && activePage !== 'settings' && (
        <div
          className="lg:hidden fixed inset-0 z-50"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute left-0 top-0 bottom-0 w-[232px] animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Empty Header (with only sidebar toggle) */}
        {activePage !== 'settings' && (
          <div 
            className="w-full h-16 flex items-center px-4 border-b shrink-0 bg-[var(--color-bg-card)]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileSidebarOpen(true);
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
              className="p-1 hover:bg-neutral-200/40 rounded transition-colors outline-none text-[var(--color-text-secondary)]"
            >
              <SidebarIcon className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}

        {/* Page heading + actions row (below header) */}
        {activePage !== 'settings' && (
          <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0">
            <h1 className="text-[22px] font-bold tracking-tight text-[var(--color-text-primary)]">
              {activePage === 'tasks' ? 'Tasks' : 'Projects'}
            </h1>

            <div className="flex items-center gap-2">
              <div className="relative flex items-center hidden sm:flex">
                <Search className="w-4 h-4 absolute left-2.5 text-[var(--color-text-secondary)]" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border bg-transparent text-sm transition-all text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] outline-none focus:ring-1 focus:border-[var(--color-text-primary)] focus:ring-[var(--color-text-primary)] w-[160px] lg:w-[220px]"
                  style={{ borderColor: 'var(--color-border)' }}
                />
              </div>
              
              {activePage === 'tasks' && <FieldsDropdown />}
              
              <FilterDropdown />

              <button
                onClick={() => {
                  if (activePage === 'tasks') {
                    document.dispatchEvent(new CustomEvent('openCreateTaskModal'));
                  } else {
                    document.dispatchEvent(new CustomEvent('openCreateProjectModal'));
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-[13px] transition-all bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Add {activePage === 'tasks' ? 'Task' : 'Project'}
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-auto bg-transparent">
          {activePage === 'tasks' && <TaskBoard />}
          {activePage === 'projects' && <ProjectsPage />}
          {activePage === 'settings' && <SettingsPage />}
        </main>
      </div>

      <TaskDetailsModal />
    </div>
  );
}

