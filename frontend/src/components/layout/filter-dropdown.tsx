'use client';

import { useState, useRef, useEffect } from 'react';
import { Filter, Check, ChevronRight, Circle, SignalHigh, SignalMedium, SignalLow, Hash } from 'lucide-react';
import { useTasksStore, useProjectsStore, useUIStore } from '@/store';
import { TaskPriority, TaskStatus } from '@/types';

export function FilterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Local state for filters not yet supported by backend API
  const [localFilters, setLocalFilters] = useState<{
    member?: string;
    dueDate?: string;
    team?: string;
    label?: string;
    reporter?: string;
  }>({});

  const { activePage } = useUIStore();
  const { filter: tasksFilter, setFilter: setTasksFilter } = useTasksStore();
  const { filter: projectsFilter, setFilter: setProjectsFilter } = useProjectsStore() as any; // We'll add this to store

  const currentFilter = activePage === 'tasks' ? tasksFilter : (projectsFilter || {});
  const setFilter = activePage === 'tasks' ? setTasksFilter : setProjectsFilter;

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrioritySelect = (priority: string) => {
    if (setFilter) {
      if (currentFilter.priority === priority) {
        setFilter({ priority: undefined }); // toggle off
      } else {
        setFilter({ priority });
      }
    }
  };

  const handleStatusSelect = (status: string) => {
    if (setFilter) {
      if (currentFilter.status === status) {
        setFilter({ status: undefined });
      } else {
        setFilter({ status });
      }
    }
  };

  const menuItems = [
    { id: 'status', label: 'Status', icon: Circle },
    { id: 'priority', label: 'Priority', icon: SignalHigh },
    { id: 'members', label: 'Members', icon: null },
    { id: 'dueDate', label: 'Due Date', icon: null },
    { id: 'teams', label: 'Teams', icon: null },
    { id: 'labels', label: 'Labels', icon: null },
    { id: 'reporter', label: 'Reporter', icon: null },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg border transition-colors ${isOpen || currentFilter.priority || currentFilter.status ? 'border-gray-400 bg-gray-50 text-[var(--color-text-primary)]' : 'border-[var(--color-border)] hover:bg-neutral-200/40 text-[var(--color-text-secondary)]'}`}
      >
        <Filter className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 py-1">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setActiveSubmenu(item.id)}
            >
              <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[var(--color-bg-hover)]">
                <div className="flex items-center gap-2">
                  {item.id === 'status' && <Circle className="w-4 h-4" />}
                  {item.id === 'priority' && <SignalHigh className="w-4 h-4" />}
                  {item.id === 'members' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                  {item.id === 'dueDate' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                  {item.id === 'teams' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                  {item.id === 'labels' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>}
                  {item.id === 'reporter' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                  {item.label}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {/* Status Submenu */}
              {item.id === 'status' && activeSubmenu === 'status' && (
                <div className="absolute top-0 right-full mr-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg py-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </div>
                  
                  <button onClick={() => handleStatusSelect(TaskStatus.TODO)} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[var(--color-bg-hover)]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      To Do
                    </div>
                    {currentFilter.status === TaskStatus.TODO && <Check className="w-4 h-4 text-blue-600" />}
                  </button>

                  <button onClick={() => handleStatusSelect(TaskStatus.IN_PROGRESS)} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[var(--color-bg-hover)]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      Doing
                    </div>
                    {currentFilter.status === TaskStatus.IN_PROGRESS && <Check className="w-4 h-4 text-blue-600" />}
                  </button>

                  <button onClick={() => handleStatusSelect(TaskStatus.COMPLETED)} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[var(--color-bg-hover)]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Completed
                    </div>
                    {currentFilter.status === TaskStatus.COMPLETED && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                </div>
              )}

              {/* Priority Submenu */}
              {item.id === 'priority' && activeSubmenu === 'priority' && (
                <div className="absolute top-0 right-full mr-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg py-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Priority
                  </div>
                  
                  <button onClick={() => handlePrioritySelect(TaskPriority.NONE)} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[var(--color-bg-hover)]">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg>
                      No Priority
                    </div>
                    {currentFilter.priority === TaskPriority.NONE && <Check className="w-4 h-4" />}
                  </button>

                  <button onClick={() => handlePrioritySelect(TaskPriority.URGENT)} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[var(--color-bg-hover)]">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg>
                      <span className="text-red-600">Urgent</span>
                    </div>
                    {currentFilter.priority === TaskPriority.URGENT && <Check className="w-4 h-4 text-red-600" />}
                  </button>

                  <button onClick={() => handlePrioritySelect(TaskPriority.HIGH)} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[var(--color-bg-hover)]">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg>
                      <span className="text-orange-500">High</span>
                    </div>
                    {currentFilter.priority === TaskPriority.HIGH && <Check className="w-4 h-4" />}
                  </button>

                  <button onClick={() => handlePrioritySelect(TaskPriority.MEDIUM)} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[var(--color-bg-hover)]">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg>
                      <span className="text-yellow-500">Medium</span>
                    </div>
                    {currentFilter.priority === TaskPriority.MEDIUM && <Check className="w-4 h-4" />}
                  </button>

                  <button onClick={() => handlePrioritySelect(TaskPriority.LOW)} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[var(--color-bg-hover)]">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg>
                      <span className="text-gray-400">Low</span>
                    </div>
                    {currentFilter.priority === TaskPriority.LOW && <Check className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Members Submenu */}
              {item.id === 'members' && activeSubmenu === 'members' && (
                <div className="absolute top-0 right-full mr-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg py-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Members
                  </div>
                  {['Unassigned', 'Me', 'Admin'].map(member => (
                    <button key={member} onClick={() => setLocalFilters(prev => ({ ...prev, member: prev.member === member ? undefined : member }))} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[var(--color-bg-hover)]">
                      <span>{member}</span>
                      {localFilters.member === member && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Due Date Submenu */}
              {item.id === 'dueDate' && activeSubmenu === 'dueDate' && (
                <div className="absolute top-0 right-full mr-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg py-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Due Date
                  </div>
                  {['Overdue', 'Today', 'Tomorrow', 'Next Week', 'No Due Date'].map(date => (
                    <button key={date} onClick={() => setLocalFilters(prev => ({ ...prev, dueDate: prev.dueDate === date ? undefined : date }))} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[var(--color-bg-hover)]">
                      <span>{date}</span>
                      {localFilters.dueDate === date && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Teams Submenu */}
              {item.id === 'teams' && activeSubmenu === 'teams' && (
                <div className="absolute top-0 right-full mr-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg py-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Teams
                  </div>
                  {['Engineering', 'Design', 'Marketing', 'Product'].map(team => (
                    <button key={team} onClick={() => setLocalFilters(prev => ({ ...prev, team: prev.team === team ? undefined : team }))} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[var(--color-bg-hover)]">
                      <span>{team}</span>
                      {localFilters.team === team && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Labels Submenu */}
              {item.id === 'labels' && activeSubmenu === 'labels' && (
                <div className="absolute top-0 right-full mr-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg py-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Labels
                  </div>
                  {['Frontend', 'Backend', 'Bug', 'Feature'].map(label => (
                    <button key={label} onClick={() => setLocalFilters(prev => ({ ...prev, label: prev.label === label ? undefined : label }))} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[var(--color-bg-hover)]">
                      <span>{label}</span>
                      {localFilters.label === label && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Reporter Submenu */}
              {item.id === 'reporter' && activeSubmenu === 'reporter' && (
                <div className="absolute top-0 right-full mr-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg py-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Reporter
                  </div>
                  {['Me', 'Admin'].map(reporter => (
                    <button key={reporter} onClick={() => setLocalFilters(prev => ({ ...prev, reporter: prev.reporter === reporter ? undefined : reporter }))} className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-[var(--color-bg-hover)]">
                      <span>{reporter}</span>
                      {localFilters.reporter === reporter && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
