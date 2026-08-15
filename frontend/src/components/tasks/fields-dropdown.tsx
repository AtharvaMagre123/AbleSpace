'use client';

import { useState, useRef, useEffect } from 'react';
import { useUIStore } from '@/store';
import { Columns3, Check, List as ListIcon, LayoutGrid } from 'lucide-react';

export function FieldsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { viewMode, setViewMode, visibleFields, toggleField } = useUIStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-[var(--color-bg-hover)] text-sm font-medium transition-colors"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
      >
        <Columns3 className="w-4 h-4" />
        Fields
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg border p-1 z-50 animate-scale-in"
          style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          {/* Tabs */}
          <div className="flex p-1 mb-2 rounded-lg bg-[var(--color-bg-hover)] border border-[var(--color-border)]">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'list' ? 'bg-[var(--color-bg-card)] shadow-sm text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
            >
              <ListIcon className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'board' ? 'bg-[var(--color-bg-card)] shadow-sm text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
            >
              <LayoutGrid className="w-4 h-4" /> Board
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-1">
            {Object.entries({
              priority: 'Priority',
              members: 'Members',
              dueDate: 'Due Date',
              labels: 'Labels',
              status: 'Status',
              reporter: 'Reporter'
            }).map(([key, label]) => {
              const fieldKey = key as keyof typeof visibleFields;
              const isVisible = visibleFields[fieldKey];
              return (
                <button
                  key={key}
                  onClick={() => toggleField(fieldKey)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-[var(--color-bg-hover)] transition-colors"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <span>{label}</span>
                  <div className={`w-[18px] h-[18px] rounded flex items-center justify-center transition-colors ${isVisible ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-card)]' : 'bg-[var(--color-bg-hover)]'}`}>
                    {isVisible && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
