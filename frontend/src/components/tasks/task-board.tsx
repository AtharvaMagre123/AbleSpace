'use client';

import { useState, useEffect } from 'react';
import { useTasksStore, useUIStore } from '@/store';
import { TaskCard } from './task-card';
import { CreateTaskModal } from './create-task-modal';
import { TaskStatus } from '@/types';
import { Plus, ChevronDown } from 'lucide-react';

export function TaskBoard() {
  const { tasks, isLoading, updateTask } = useTasksStore();
  const { viewMode } = useUIStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [initialTaskStatus, setInitialTaskStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [expandedSections, setExpandedSections] = useState({
    todo: true,
    inProgress: true,
    completed: true,
    onHold: true,
  });

  // Event listener for create task modal opened from dashboard header
  useEffect(() => {
    const handleOpenModal = (event: any) => {
      setInitialTaskStatus(event.detail?.status || TaskStatus.TODO);
      setShowCreateModal(true);
    };
    document.addEventListener('openCreateTaskModal', handleOpenModal);
    return () => document.removeEventListener('openCreateTaskModal', handleOpenModal);
  }, []);

  const handleOpenCreateModal = (status?: TaskStatus) => {
    setInitialTaskStatus(status || TaskStatus.TODO);
    setShowCreateModal(true);
  };

  const todoTasks = tasks.filter((t) => t.status === TaskStatus.TODO && !t.parentId);
  const inProgressTasks = tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS && !t.parentId);
  const completedTasks = tasks.filter((t) => t.status === TaskStatus.COMPLETED && !t.parentId);
  const onHoldTasks = tasks.filter((t) => t.status === TaskStatus.ON_HOLD && !t.parentId);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDrop = async (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    const task = tasks.find((t) => t._id === taskId);
    if (task && task.status !== status) {
      await updateTask(taskId, { status });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-[var(--color-text-secondary)]">Loading tasks...</div>;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full w-full">
      {viewMode === 'list' && (
        <div className="flex flex-col flex-1 overflow-y-auto px-6 pb-6">
          <div className="mt-0 max-w-7xl mx-auto w-full">

          <TaskSectionList 
            title="To Do" 
            status={TaskStatus.TODO}
            tasks={todoTasks} 
            isExpanded={expandedSections.todo}
            onToggle={() => toggleSection('todo')}
            onAdd={() => handleOpenCreateModal(TaskStatus.TODO)}
            onDrop={(e: React.DragEvent) => handleDrop(e, TaskStatus.TODO)}
          />

          <TaskSectionList 
            title="Doing" 
            status={TaskStatus.IN_PROGRESS}
            tasks={inProgressTasks} 
            isExpanded={expandedSections.inProgress}
            onToggle={() => toggleSection('inProgress')}
            onAdd={() => handleOpenCreateModal(TaskStatus.IN_PROGRESS)}
            onDrop={(e: React.DragEvent) => handleDrop(e, TaskStatus.IN_PROGRESS)}
          />
          
          <TaskSectionList 
            title="Completed" 
            status={TaskStatus.COMPLETED}
            tasks={completedTasks} 
            isExpanded={expandedSections.completed}
            onToggle={() => toggleSection('completed')}
            onAdd={() => handleOpenCreateModal(TaskStatus.COMPLETED)}
            onDrop={(e: React.DragEvent) => handleDrop(e, TaskStatus.COMPLETED)}
          />

          </div>
        </div>
      )}

      {viewMode === 'board' && (
        <div className="flex gap-4 overflow-x-auto p-6 flex-1 min-h-0 snap-x snap-mandatory md:snap-none items-start">
          <TaskColumnBoard status={TaskStatus.TODO} title="To Do" count={todoTasks.length} tasks={todoTasks} onAdd={() => handleOpenCreateModal(TaskStatus.TODO)} onDrop={(e: React.DragEvent) => handleDrop(e, TaskStatus.TODO)} />
          <TaskColumnBoard status={TaskStatus.IN_PROGRESS} title="Doing" count={inProgressTasks.length} tasks={inProgressTasks} onAdd={() => handleOpenCreateModal(TaskStatus.IN_PROGRESS)} onDrop={(e: React.DragEvent) => handleDrop(e, TaskStatus.IN_PROGRESS)} />
          <TaskColumnBoard status={TaskStatus.COMPLETED} title="Completed" count={completedTasks.length} tasks={completedTasks} onAdd={() => handleOpenCreateModal(TaskStatus.COMPLETED)} onDrop={(e: React.DragEvent) => handleDrop(e, TaskStatus.COMPLETED)} />
          <TaskColumnBoard status={TaskStatus.ON_HOLD} title="On Hold" count={onHoldTasks.length} tasks={onHoldTasks} onAdd={() => handleOpenCreateModal(TaskStatus.ON_HOLD)} onDrop={(e: React.DragEvent) => handleDrop(e, TaskStatus.ON_HOLD)} />
        </div>
      )}

      {showCreateModal && (
        <CreateTaskModal onClose={() => setShowCreateModal(false)} initialStatus={initialTaskStatus} />
      )}
    </div>
  );
}

// ─── List View Section ──────────────────────────────────────────
function TaskSectionList({ title, tasks, isExpanded, onToggle, onAdd, onDrop }: any) {
  const { visibleFields } = useUIStore();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    setIsDragOver(false);
    onDrop(e);
  };

  return (
    <div 
      className={`mb-4 rounded-lg transition-colors ${isDragOver ? 'ring-2 ring-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <button 
        onClick={onToggle}
        className="flex items-center gap-2 w-full px-1 py-2 outline-none mb-1"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className={`transition-transform text-gray-800 ${isExpanded ? '' : '-rotate-90'}`}>
          <polygon points="0,2 10,2 5,9" />
        </svg>
        <span className="text-[14px] font-medium text-[var(--color-text-primary)]">{title}</span>
      </button>
      
      {isExpanded && (
        <div className="border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] overflow-hidden">
          {/* Table Header */}
          <div 
            className="hidden sm:flex items-center px-4 py-3 text-sm font-medium border-b border-[var(--color-border)] text-[var(--color-text-primary)] bg-[var(--color-bg-tertiary)]"
          >
            <div className="flex-[2] min-w-0">Task</div>
            {visibleFields.priority && <div className="w-[120px] shrink-0">Priority</div>}
            {visibleFields.members && <div className="w-[120px] shrink-0">Members</div>}
            {visibleFields.dueDate && <div className="w-[140px] shrink-0">Due Date</div>}
            <div className="w-[60px] shrink-0 text-right pr-2">Actions</div>
          </div>
          
          {/* Tasks List */}
          <div className="flex flex-col">
            {tasks.map((task: any) => (
              <TaskCard key={task._id} task={task} variant="list" />
            ))}
            
            <button 
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-3 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors outline-none w-full text-left"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Board View Column ──────────────────────────────────────────
function TaskColumnBoard({ title, count, tasks, onAdd, onDrop }: any) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    setIsDragOver(false);
    onDrop(e);
  };

  return (
    <div 
      className={`flex flex-col w-[300px] min-w-[300px] shrink-0 snap-center md:snap-align-none rounded-xl p-3 bg-[var(--color-bg-tertiary)] border transition-colors ${isDragOver ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-400' : 'border-[var(--color-border)]'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center gap-1.5 px-1 py-1 mb-3">
        <div className="flex items-center gap-2 flex-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-tertiary)]">
            <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
          </svg>
          <h3 className="text-[16px] font-semibold flex-1 text-[var(--color-text-primary)]">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onAdd} className="p-1 hover:bg-[var(--color-bg-hover)] rounded text-[var(--color-text-secondary)] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
          <button className="p-1 hover:bg-[var(--color-bg-hover)] rounded text-[var(--color-text-secondary)] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>
      </div>
      
      {/* Task Cards Container */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pb-1 min-h-[10px]">
        {tasks.map((task: any) => (
          <TaskCard key={task._id} task={task} variant="card" />
        ))}
      </div>

      {/* Add Task Button inside Column */}
      <button 
        onClick={onAdd}
        className="flex items-center gap-2 mt-3 px-1 py-2 text-[14px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors bg-transparent border-none w-full outline-none"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Add Task
      </button>
    </div>
  );
}
