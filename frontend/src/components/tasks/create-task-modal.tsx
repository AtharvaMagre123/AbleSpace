'use client';

import { useState } from 'react';
import { useTasksStore } from '@/store';
import { TaskStatus, TaskPriority } from '@/types';
import { X } from 'lucide-react';

interface CreateTaskModalProps {
  onClose: () => void;
  initialStatus?: TaskStatus;
}

export function CreateTaskModal({ onClose, initialStatus = TaskStatus.TODO }: CreateTaskModalProps) {
  const { createTask } = useTasksStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.NONE);
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate || undefined,
        tags: tagsArray,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-[500px] rounded-2xl p-6 animate-scale-in bg-[var(--color-bg-card)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            Add Task
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-4 py-2.5 rounded-lg text-sm border bg-[var(--color-bg-card)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none cursor-pointer"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <option value={TaskStatus.TODO}>To Do</option>
                <option value={TaskStatus.IN_PROGRESS}>Doing</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
                <option value={TaskStatus.ON_HOLD}>On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-4 py-2.5 rounded-lg text-sm border bg-[var(--color-bg-card)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none cursor-pointer"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <option value={TaskPriority.NONE}>No Priority</option>
                <option value={TaskPriority.LOW}>Low</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.HIGH}>High</option>
                <option value={TaskPriority.URGENT}>Urgent</option>
              </select>
            </div>
          </div>

          {/* Due Date & Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-[var(--color-bg-card)] cursor-pointer"
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">
                Tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Design, Frontend"
                className="w-full px-4 py-2.5 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-[var(--color-bg-card)]"
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 text-sm font-medium text-gray-600 hover:text-[var(--color-text-primary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-6 rounded-lg font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 text-white"
              style={{ background: '#7c7c7c' }}
            >
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
