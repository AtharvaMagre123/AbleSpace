'use client';

import { useState, useEffect, useRef } from 'react';
import { useTasksStore, useAuthStore } from '@/store';
import { TaskStatus, TaskPriority, TaskMember, User } from '@/types';
import { usersApi } from '@/lib/api';
import {
  X, Lock, Eye, Share2, MoreHorizontal, Maximize2,
  Tag, Paperclip, ChevronDown, ChevronLeft, ChevronRight,
  Plus, Send, Calendar, Trash2, CheckCircle2,
  Circle, Clock, Pause, Smile, Settings, Users
} from 'lucide-react';

function PrioritySignalIcon({ priority, className = "" }: { priority: TaskPriority, className?: string }) {
  const bars = [1, 2, 3, 4];
  
  let activeBars = 0;
  if (priority === TaskPriority.LOW) activeBars = 1;
  else if (priority === TaskPriority.MEDIUM) activeBars = 2;
  else if (priority === TaskPriority.HIGH) activeBars = 3;
  else if (priority === TaskPriority.URGENT) activeBars = 4;

  if (activeBars === 0) {
    return <div className={`flex items-end h-[14px] pb-[2px] ${className}`}><div className="w-[3px] h-[3px] rounded-[1px] bg-current" /></div>;
  }

  return (
    <div className={`flex items-end gap-[2px] h-[14px] ${className}`}>
      {bars.slice(0, activeBars).map((bar) => (
        <div
          key={bar}
          className="w-[3px] rounded-[1px] bg-current transition-colors"
          style={{ height: `${(bar / 4) * 100}%` }}
        />
      ))}
    </div>
  );
}

// ─── Status & Priority helpers ───────────────────────────────
const STATUS_OPTIONS = [
  { value: TaskStatus.TODO, label: 'To Do', color: 'bg-blue-500' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-yellow-500' },
  { value: TaskStatus.COMPLETED, label: 'Completed', color: 'bg-green-500' },
  { value: TaskStatus.ON_HOLD, label: 'Backlog', color: 'bg-orange-500' },
];

const PRIORITY_OPTIONS = [
  { value: TaskPriority.NONE, label: 'No Priority', color: 'text-gray-700' },
  { value: TaskPriority.LOW, label: 'Low', color: 'text-gray-400' },
  { value: TaskPriority.MEDIUM, label: 'Medium', color: 'text-yellow-500' },
  { value: TaskPriority.HIGH, label: 'High', color: 'text-orange-500' },
  { value: TaskPriority.URGENT, label: 'Urgent', color: 'text-red-500' },
];

function getStatusOption(status: TaskStatus) {
  return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
}
function getPriorityOption(priority: TaskPriority) {
  return PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[0];
}

// ─── Mini Calendar ───────────────────────────────────────────
function MiniCalendar({ value, onChange, onClose }: { value?: string; onChange: (date: string) => void; onClose: () => void }) {
  const today = new Date();
  const selected = value ? new Date(value) : null;
  const [viewDate, setViewDate] = useState(selected || today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const cells: { day: number; inMonth: boolean; dateStr: string }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    cells.push({ day: d, inMonth: false, dateStr: new Date(year, month - 1, d).toISOString().split('T')[0] });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, dateStr: new Date(year, month, d).toISOString().split('T')[0] });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, inMonth: false, dateStr: new Date(year, month + 1, d).toISOString().split('T')[0] });
  }

  const isSelected = (dateStr: string) => value && dateStr === new Date(value).toISOString().split('T')[0];
  const isToday = (dateStr: string) => dateStr === today.toISOString().split('T')[0];

  return (
    <div className="w-[250px] bg-[var(--color-bg-card)] shadow-xl rounded-xl border p-4 z-50" style={{ borderColor: 'var(--color-border)' }} onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-3">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1 hover:bg-[var(--color-bg-hover)] rounded text-[var(--color-text-secondary)]"><ChevronLeft className="w-4 h-4" /></button>
        <div className="font-semibold text-sm text-[var(--color-text-primary)]">{monthName}</div>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1 hover:bg-[var(--color-bg-hover)] rounded text-[var(--color-text-secondary)]"><ChevronRight className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-[var(--color-text-secondary)] font-medium mb-1">
        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
        {cells.map((cell, i) => (
          <button
            key={i}
            onClick={() => { onChange(cell.dateStr); onClose(); }}
            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center transition-colors font-medium
              ${!cell.inMonth ? 'text-gray-300' : 'text-[var(--color-text-primary)]'}
              ${isSelected(cell.dateStr) ? 'bg-[var(--color-text-primary)] !text-[var(--color-bg-primary)]' : ''}
              ${isToday(cell.dateStr) && !isSelected(cell.dateStr) ? 'ring-1 ring-[var(--color-text-primary)]' : ''}
              hover:bg-[var(--color-bg-hover)]
            `}
          >
            {cell.day}
          </button>
        ))}
      </div>
      <button onClick={() => { onChange(''); onClose(); }} className="w-full mt-2 text-[10px] text-red-500 hover:text-red-700 transition-colors">Clear date</button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────
export function TaskDetailsModal() {
  const { selectedTask, setSelectedTask, updateTask, deleteTask, tasks, createTask } = useTasksStore();
  const { user } = useAuthStore();

  const isOwner = selectedTask && user && (
    typeof selectedTask.userId === 'string' 
      ? selectedTask.userId === user.id 
      : selectedTask.userId?._id === user.id
  );
  const isMember = selectedTask?.members?.some(m => m.userId === user?.id);
  const canEditStatus = isOwner || isMember;
  const canAddSubtasks = isOwner || isMember;

  const owner = selectedTask && typeof selectedTask.userId === 'object' ? selectedTask.userId : null;

  const subtasks = selectedTask ? tasks.filter(t => t.parentId === selectedTask._id) : [];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.NONE);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newTag, setNewTag] = useState('');

  const [statusOpen, setStatusOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<'start' | 'end' | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [membersOpen, setMembersOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberResults, setMemberResults] = useState<User[]>([]);
  const [memberSearchLoading, setMemberSearchLoading] = useState(false);
  const [openSubtaskMemberId, setOpenSubtaskMemberId] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description || '');
      setStatus(selectedTask.status);
      setPriority(selectedTask.priority);
      setStartDate(selectedTask.startDate ? new Date(selectedTask.startDate).toISOString().split('T')[0] : '');
      setDueDate(selectedTask.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : '');
      setCategory(selectedTask.category || '');
      setTags(selectedTask.tags || []);
      setStatusOpen(false); setPriorityOpen(false); setCalendarTarget(null); setMembersOpen(false);
      setEditingTitle(false); setEditingDesc(false); setEditingCategory(false);
      setShowDeleteConfirm(false);
    }
  }, [selectedTask]);

  useEffect(() => {
    if (!membersOpen || !memberSearch.trim()) {
      setMemberResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setMemberSearchLoading(true);
      try {
        const { data } = await usersApi.search(memberSearch);
        setMemberResults(data);
      } catch (err) {
        console.error('Failed to search users', err);
      } finally {
        setMemberSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [memberSearch, membersOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (statusOpen || priorityOpen || calendarTarget || membersOpen || openSubtaskMemberId) {
          setStatusOpen(false); setPriorityOpen(false); setCalendarTarget(null); setMembersOpen(false); setOpenSubtaskMemberId(null);
        } else {
          setSelectedTask(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedTask, statusOpen, priorityOpen, calendarTarget, membersOpen, openSubtaskMemberId]);

  if (!selectedTask) return null;

  // ─── Save helpers ─────────────────────────────────────────
  const saveField = async (field: string, value: any) => {
    setIsSaving(true);
    try {
      await updateTask(selectedTask._id, { [field]: value });
      setSelectedTask({ ...selectedTask, [field]: value });
    } catch (err) { console.error('Failed to update:', err); }
    finally { setIsSaving(false); }
  };

  const handleTitleSave = () => { setEditingTitle(false); if (title.trim() && title.trim() !== selectedTask.title) saveField('title', title.trim()); };
  const handleDescSave = () => { setEditingDesc(false); if (description !== (selectedTask.description || '')) saveField('description', description); };
  const handleStatusChange = (v: TaskStatus) => { setStatus(v); setStatusOpen(false); saveField('status', v); };
  const handlePriorityChange = (v: TaskPriority) => { setPriority(v); setPriorityOpen(false); saveField('priority', v); };
  const handleStartDateChange = (d: string) => { setStartDate(d); saveField('startDate', d || null); };
  const handleDueDateChange = (d: string) => { setDueDate(d); saveField('dueDate', d || null); };
  const handleCategorySave = () => { setEditingCategory(false); if (category !== (selectedTask.category || '')) saveField('category', category || null); };
  const handleAddTag = () => { const t = newTag.trim(); if (t && !tags.includes(t)) { const u = [...tags, t]; setTags(u); setNewTag(''); saveField('tags', u); } };
  const handleRemoveTag = (t: string) => { const u = tags.filter(x => x !== t); setTags(u); saveField('tags', u); };

  const handleAddMember = (member: Partial<User>) => {
    if (!member.id) return;
    const currentMembers = selectedTask.members || [];
    if (currentMembers.some(m => m.userId === member.id)) {
      setMembersOpen(false);
      return;
    }
    const updatedMembers = [...currentMembers, {
      userId: member.id,
      username: member.username || '',
      avatar: member.avatar,
      fullName: member.fullName
    }];
    saveField('members', updatedMembers);
    setMembersOpen(false);
    setMemberSearch('');
  };

  const handleRemoveMember = (userId: string) => {
    const currentMembers = selectedTask.members || [];
    const updatedMembers = currentMembers.filter(m => m.userId !== userId);
    saveField('members', updatedMembers);
  };
  const handleDelete = async () => { await deleteTask(selectedTask._id); setSelectedTask(null); };

  const statusOpt = getStatusOption(status);
  const priorityOpt = getPriorityOption(priority);
  const formattedStartShort = startDate ? new Date(startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : null;
  const formattedDueShort = dueDate ? new Date(dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : null;
  const formattedCreated = new Date(selectedTask.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const avatarUrl = user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest";
  const displayName = user?.fullName || user?.username || 'Guest User';

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    
    const newComment = {
      text: newCommentText.trim(),
      authorName: user?.username || displayName,
      authorAvatar: user?.avatar || avatarUrl,
    };
    
    const updatedComments = [...(selectedTask.comments || []), newComment];
    updateTask(selectedTask._id, { comments: updatedComments });
    
    // Also update local selectedTask optimistically
    setSelectedTask({ ...selectedTask, comments: updatedComments });
    setNewCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedTask(null)}>
      <div
        className="w-full h-full max-w-[1100px] max-h-[92vh] bg-[var(--color-bg-card)] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border animate-scale-in"
        style={{ borderColor: 'var(--color-border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ═══════════════════════════════════════════════════
            LEFT — Main Content
        ═══════════════════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 pb-6">
            {/* ── Header row ─────────────────────────────── */}
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1 min-w-0">
                {editingTitle ? (
                  <input
                    ref={titleRef}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={e => { if (e.key === 'Enter') handleTitleSave(); }}
                    autoFocus
                    className="w-full text-[22px] font-bold text-[var(--color-text-primary)] bg-transparent border-b-2 border-blue-500 outline-none pb-0.5"
                  />
                ) : (
                  <h1
                    className={`text-[22px] font-bold text-[var(--color-text-primary)] rounded px-1 -mx-1 transition-colors ${isOwner ? 'cursor-pointer hover:bg-[var(--color-bg-hover)]' : ''}`}
                    onClick={() => { if (isOwner) { setEditingTitle(true); setTimeout(() => titleRef.current?.focus(), 0); } }}
                  >
                    {title}
                  </h1>
                )}
              </div>

              {/* Action icons — matches the screenshot exactly */}
              <div className="flex items-center gap-1 shrink-0 ml-6">
                {isSaving && <span className="text-[11px] text-[var(--color-text-secondary)] mr-1">Saving...</span>}
                <button className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"><Lock className="w-4 h-4" /></button>
                <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-blue-600 bg-blue-50 text-xs font-semibold"><Eye className="w-3.5 h-3.5" /> 1</button>
                <button className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"><Share2 className="w-4 h-4" /></button>
                {isOwner && <button onClick={() => setShowDeleteConfirm(true)} className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"><MoreHorizontal className="w-4 h-4" /></button>}
                <button onClick={() => setSelectedTask(null)} className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"><Maximize2 className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Description */}
            {editingDesc ? (
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={handleDescSave}
                autoFocus
                rows={3}
                className="w-full mt-1 text-sm text-[var(--color-text-secondary)] bg-transparent border border-blue-500 rounded-lg p-2 outline-none resize-none leading-relaxed"
                placeholder="Add a description..."
              />
            ) : (
              <p
                className={`mt-1 text-sm text-[var(--color-text-secondary)] leading-relaxed rounded px-1 -mx-1 py-0.5 transition-colors ${isOwner ? 'cursor-pointer hover:bg-[var(--color-bg-hover)]' : ''}`}
                onClick={() => { if (isOwner) setEditingDesc(true); }}
              >
                {description || (isOwner ? <span className="italic text-gray-400">Click to add a description...</span> : null)}
              </p>
            )}

            {/* Delete confirmation */}
            {showDeleteConfirm && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-sm">
                <span className="text-red-700 font-medium">Delete this task?</span>
                <div className="flex gap-2">
                  <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors">Cancel</button>
                  <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete</button>
                </div>
              </div>
            )}

            {/* ── Properties / Labels / Resources ────────── */}
            <div className="mt-6 space-y-3 text-sm">
              {/* Properties */}
              <div className="flex items-center gap-8">
                <span className="w-20 text-[var(--color-text-secondary)] shrink-0">Properties</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {editingCategory ? (
                    <input
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      onBlur={handleCategorySave}
                      onKeyDown={e => { if (e.key === 'Enter') handleCategorySave(); }}
                      autoFocus
                      placeholder="e.g. Designer"
                      className="px-2.5 py-1 rounded-md text-xs border border-blue-500 bg-transparent outline-none text-[var(--color-text-primary)] w-28"
                    />
                  ) : (
                    <button
                      onClick={() => { if (isOwner) setEditingCategory(true); }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-medium text-xs transition-colors ${isOwner ? 'hover:bg-[var(--color-bg-hover)] cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className="w-4 h-4 rounded-full bg-neutral-300 flex items-center justify-center text-[9px] font-bold text-neutral-600">A</div>
                      {category || 'Add category'}
                    </button>
                  )}
                  {(startDate || dueDate) && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-600 font-medium text-xs">
                      <Calendar className="w-3 h-3" /> {formattedDueShort || formattedStartShort}
                    </span>
                  )}
                </div>
              </div>

              {/* Labels */}
              <div className="flex items-start gap-8">
                <span className="w-20 text-[var(--color-text-secondary)] shrink-0 pt-0.5">Labels</span>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-medium text-xs group cursor-default">
                      <Tag className="w-3 h-3 text-[var(--color-text-secondary)]" /> {tag}
                      {isOwner && <button onClick={() => handleRemoveTag(tag)} className="ml-0.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X className="w-3 h-3" /></button>}
                    </span>
                  ))}
                  {isOwner && (
                    <input
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                      placeholder="+ Add"
                      className="px-2 py-1 rounded-md text-xs bg-transparent outline-none text-[var(--color-text-secondary)] placeholder-gray-400 w-16 border border-transparent focus:border-[var(--color-border)] transition-colors"
                    />
                  )}
                </div>
              </div>

              {/* Resources */}
              <div className="flex items-center gap-8">
                <span className="w-20 text-[var(--color-text-secondary)] shrink-0">Resources</span>
                <button className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-xs">
                  <Paperclip className="w-3.5 h-3.5" /> Add document or link...
                </button>
              </div>
            </div>

            {/* ── Subtasks Section ───────────────────────── */}
            <div className="mt-8">
              <button className="flex items-center gap-2 font-semibold text-sm text-[var(--color-text-primary)] mb-4">
                <ChevronDown className="w-4 h-4" /> Subtasks
              </button>

              <div className="border rounded-xl" style={{ borderColor: 'var(--color-border)' }}>
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b text-[var(--color-text-secondary)]" style={{ borderColor: 'var(--color-border)' }}>
                      <th className="px-4 py-2.5 font-medium text-xs">Task</th>
                      <th className="px-4 py-2.5 font-medium text-xs">Priority</th>
                      <th className="px-4 py-2.5 font-medium text-xs">Members</th>
                      <th className="px-4 py-2.5 font-medium text-xs">Due Date</th>
                      <th className="px-4 py-2.5 font-medium text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subtasks.map(subtask => {
                      const isSubtaskOwner = subtask.userId === user?.id || subtask.userId?._id === user?.id || isOwner;
                      return (
                      <tr key={subtask._id} className="border-b hover:bg-[var(--color-bg-hover)]" style={{ borderColor: 'var(--color-border)' }}>
                        <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">{subtask.title}</td>
                        <td className="px-4 py-3">
                          <div className="relative inline-flex items-center">
                            <span className={`flex items-center gap-1.5 font-medium text-xs ${getPriorityOption(subtask.priority).color}`}>
                              <PrioritySignalIcon priority={subtask.priority} /> {getPriorityOption(subtask.priority).label}
                            </span>
                            <select
                              value={subtask.priority}
                              onChange={(e) => updateTask(subtask._id, { priority: e.target.value as TaskPriority })}
                              className={`absolute inset-0 opacity-0 w-full h-full ${isSubtaskOwner ? 'cursor-pointer' : 'cursor-default'}`}
                              disabled={!isSubtaskOwner}
                            >
                              {PRIORITY_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value} className="text-black">
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-4 py-3 relative">
                          <div
                            className={`flex items-center gap-1 ${isSubtaskOwner ? 'cursor-pointer' : 'cursor-default'}`}
                            onClick={() => { if (isSubtaskOwner) setOpenSubtaskMemberId(openSubtaskMemberId === subtask._id ? null : subtask._id) }}
                          >
                            {subtask.members && subtask.members.length > 0 ? (
                              <div className="flex -space-x-2">
                                {subtask.members.map((m) => (
                                  <img
                                    key={m.userId}
                                    src={m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username}`}
                                    className="w-6 h-6 rounded-full border border-[var(--color-bg-primary)] bg-[var(--color-bg-secondary)]"
                                    alt={m.username}
                                    title={m.username}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border border-dashed border-gray-400 flex items-center justify-center hover:border-gray-500 text-gray-400">
                                <Plus className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          {openSubtaskMemberId === subtask._id && (
                            <div className="absolute left-4 top-full mt-1 w-[200px] bg-[var(--color-bg-card)] border rounded-xl shadow-lg p-2 z-[100]" style={{ borderColor: 'var(--color-border)' }}>
                              <div className="text-xs font-semibold mb-2 text-[var(--color-text-secondary)]">Assign Members</div>
                              <div className="max-h-40 overflow-y-auto space-y-1">
                                {!selectedTask.members || selectedTask.members.length === 0 ? (
                                  <div className="text-xs text-gray-400 py-1">No members in parent task.</div>
                                ) : (
                                  selectedTask.members.map(parentMember => {
                                    const isAssigned = subtask.members?.some(m => m.userId === parentMember.userId);
                                    return (
                                      <button
                                        key={parentMember.userId}
                                        onClick={() => {
                                          const current = subtask.members || [];
                                          const updated = isAssigned 
                                            ? current.filter(m => m.userId !== parentMember.userId)
                                            : [...current, parentMember];
                                          updateTask(subtask._id, { members: updated });
                                        }}
                                        className="w-full flex items-center justify-between gap-2 px-2 py-1.5 text-xs rounded transition-colors hover:bg-[var(--color-bg-hover)] text-left"
                                      >
                                        <div className="flex items-center gap-2">
                                          <img src={parentMember.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${parentMember.username}`} alt="" className="w-5 h-5 rounded-full" />
                                          <span className="font-medium text-[var(--color-text-primary)]">{parentMember.username}</span>
                                        </div>
                                        {isAssigned && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                                      </button>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[var(--color-text-primary)]">
                          <div className="relative inline-flex items-center">
                            <span>
                              {subtask.dueDate ? new Date(subtask.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                            </span>
                            <input
                              type="date"
                              value={subtask.dueDate ? new Date(subtask.dueDate).toISOString().split('T')[0] : ''}
                              onChange={(e) => updateTask(subtask._id, { dueDate: e.target.value ? e.target.value : undefined })}
                              className={`absolute inset-0 opacity-0 w-full h-full ${isSubtaskOwner ? 'cursor-pointer' : 'cursor-default'}`}
                              disabled={!isSubtaskOwner}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isSubtaskOwner && (
                            <button onClick={() => deleteTask(subtask._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    )})}
                    {canAddSubtasks && (
                      <tr className="hover:bg-[var(--color-bg-hover)]">
                        <td colSpan={5} className="px-4 py-2 text-sm">
                          <input
                            type="text"
                            placeholder="+ Add Subtask"
                            className="w-full bg-transparent outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] font-medium"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                createTask({ title: e.currentTarget.value.trim(), parentId: selectedTask._id });
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Comments Section ───────────────────────── */}
            <div className="mt-8">
              <h3 className="font-semibold text-sm text-[var(--color-text-primary)] mb-4">Comments</h3>

              {/* Render dynamic comments */}
              {selectedTask.comments?.map((comment: any, index: number) => (
                <div key={comment._id || index} className="border rounded-xl p-4 mb-4" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex items-start gap-3 mb-3">
                    <img src={comment.authorAvatar} className="w-8 h-8 rounded-full shrink-0" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--color-text-primary)]">{comment.authorName}</span>
                        <span className="text-xs text-gray-400">
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'just now'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 shrink-0">
                      <Smile className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                      <MoreHorizontal className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-text-primary)] mb-4 pl-11">{comment.text}</p>
                </div>
              ))}

              {/* Add comment */}
              <div className="border rounded-xl px-4 py-3 flex items-center gap-3" style={{ borderColor: 'var(--color-border)' }}>
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
                  className="flex-1 bg-transparent text-sm outline-none text-[var(--color-text-primary)] placeholder-gray-400" 
                />
                <Paperclip className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                <Send onClick={handleAddComment} className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            RIGHT — Details Sidebar
        ═══════════════════════════════════════════════════ */}
        <div className="w-[280px] shrink-0 border-l bg-[var(--color-bg-card)] overflow-y-auto" style={{ borderColor: 'var(--color-border)' }}>
          <div className="p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-sm text-[var(--color-text-primary)] flex items-center gap-1.5">
                <ChevronDown className="w-4 h-4" /> Details
              </h2>
              <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                {isOwner && <Plus className="w-4 h-4 cursor-pointer hover:text-[var(--color-text-primary)]" />}
                {isOwner && <Settings className="w-4 h-4 cursor-pointer hover:text-[var(--color-text-primary)]" />}
              </div>
            </div>

            <div className="space-y-4 text-sm">

              {/* Status */}
              <div className="relative">
                <div className="grid grid-cols-[80px_1fr] items-center">
                  <span className="text-[var(--color-text-secondary)] text-xs">Status</span>
                  <button
                    onClick={() => { if (canEditStatus) { setStatusOpen(!statusOpen); setPriorityOpen(false); setCalendarTarget(null); } }}
                    className={`flex items-center gap-1.5 text-xs font-medium px-1.5 py-1 rounded transition-colors text-left ${canEditStatus ? 'hover:bg-[var(--color-bg-hover)] cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${statusOpt.color}`}></div>
                    {statusOpt.label}
                  </button>
                </div>
                {statusOpen && (
                  <div className="absolute left-[80px] top-full mt-1 w-40 bg-[var(--color-bg-card)] border rounded-xl shadow-lg py-1 z-50" style={{ borderColor: 'var(--color-border)' }}>
                    {STATUS_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => handleStatusChange(opt.value)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-[var(--color-bg-hover)] transition-colors ${opt.value === status ? 'bg-[var(--color-bg-hover)]' : ''}`}>
                        <div className={`w-2 h-2 rounded-full ${opt.color}`}></div> {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="relative">
                <div className="grid grid-cols-[80px_1fr] items-center">
                  <span className="text-[var(--color-text-secondary)] text-xs">Priority</span>
                  <button
                    onClick={() => { if (isOwner) { setPriorityOpen(!priorityOpen); setStatusOpen(false); setCalendarTarget(null); } }}
                    className={`flex items-center gap-2 text-xs font-medium px-1.5 py-1 rounded transition-colors text-left ${priorityOpt.color} ${isOwner ? 'hover:bg-[var(--color-bg-hover)] cursor-pointer' : 'cursor-default'}`}
                  >
                    <PrioritySignalIcon priority={priority} /> {priorityOpt.label}
                  </button>
                </div>
                {priorityOpen && (
                  <div className="absolute left-[80px] top-full mt-1 w-[160px] bg-[var(--color-bg-card)] border rounded-xl shadow-lg py-1 z-50" style={{ borderColor: 'var(--color-border)' }}>
                    {PRIORITY_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => handlePriorityChange(opt.value)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium hover:bg-[var(--color-bg-hover)] transition-colors ${opt.color}`}>
                        <div className="flex items-center gap-2.5">
                          <PrioritySignalIcon priority={opt.value} />
                          {opt.label}
                        </div>
                        {opt.value === priority && <CheckCircle2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Members */}
              <div className="relative">
                <div className="grid grid-cols-[80px_1fr] items-start">
                  <span className="text-[var(--color-text-secondary)] text-xs pt-1.5">Members</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedTask.members?.map(m => (
                      <div key={m.userId} className="flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--color-bg-hover)] text-xs font-medium text-[var(--color-text-primary)] group">
                        <img src={m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username}`} alt="" className="w-4 h-4 rounded-full" />
                        <span>{m.username}</span>
                        {isOwner && <X className="w-3 h-3 text-gray-400 cursor-pointer hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveMember(m.userId)} />}
                      </div>
                    ))}
                    {isOwner && (
                      <button
                        onClick={() => { setMembersOpen(!membersOpen); setStatusOpen(false); setPriorityOpen(false); setCalendarTarget(null); }}
                        className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-primary)] cursor-pointer hover:bg-[var(--color-bg-hover)] px-1.5 py-1 rounded transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" /> {selectedTask.members?.length ? '' : 'Add members'}
                      </button>
                    )}
                  </div>
                </div>
                {membersOpen && (
                  <div className="absolute left-[80px] top-full mt-1 w-[220px] bg-[var(--color-bg-card)] border rounded-xl shadow-lg p-2 z-50" style={{ borderColor: 'var(--color-border)' }}>
                    <input
                      type="text"
                      placeholder="Search username..."
                      value={memberSearch}
                      onChange={e => setMemberSearch(e.target.value)}
                      className="w-full text-xs px-2 py-1.5 mb-2 rounded border outline-none bg-[var(--color-bg-secondary)]"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      autoFocus
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {memberSearchLoading ? (
                        <div className="text-xs text-center text-gray-400 py-2">Searching...</div>
                      ) : memberResults.length > 0 ? (
                        memberResults.map(u => {
                          const isAssigned = selectedTask.members?.some(m => m.userId === u.id);
                          return (
                            <button
                              key={u.id}
                              onClick={() => handleAddMember(u)}
                              disabled={isAssigned}
                              className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 text-xs rounded transition-colors text-left ${isAssigned ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--color-bg-hover)]'}`}
                            >
                              <div className="flex items-center gap-2">
                                <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} alt="" className="w-5 h-5 rounded-full" />
                                <span className="font-medium text-[var(--color-text-primary)]">{u.username}</span>
                              </div>
                              {isAssigned && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                            </button>
                          );
                        })
                      ) : memberSearch ? (
                        <div className="text-xs text-center text-gray-400 py-2">No users found</div>
                      ) : (
                        <div className="text-xs text-center text-gray-400 py-2">Type to search</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="relative">
                <div className="grid grid-cols-[80px_1fr] items-center">
                  <span className="text-[var(--color-text-secondary)] text-xs">Dates</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => { if (isOwner) { setCalendarTarget(calendarTarget === 'start' ? null : 'start'); setStatusOpen(false); setPriorityOpen(false); } }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-medium transition-colors ${startDate ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'} ${calendarTarget === 'start' ? 'ring-1 ring-blue-500' : ''} ${isOwner ? 'hover:bg-[var(--color-bg-hover)] cursor-pointer' : 'cursor-default'}`}
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <Calendar className="w-3 h-3" /> {formattedStartShort || 'Start'}
                    </button>
                    <span className="text-gray-400 text-[10px]">→</span>
                    <button
                      onClick={() => { if (isOwner) { setCalendarTarget(calendarTarget === 'end' ? null : 'end'); setStatusOpen(false); setPriorityOpen(false); } }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-medium transition-colors ${dueDate ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'} ${calendarTarget === 'end' ? 'ring-1 ring-blue-500' : ''} ${isOwner ? 'hover:bg-[var(--color-bg-hover)] cursor-pointer' : 'cursor-default'}`}
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <Calendar className="w-3 h-3" /> {formattedDueShort || 'End'}
                    </button>
                  </div>
                </div>
                {calendarTarget === 'start' && (
                  <div className="absolute right-0 top-full mt-1 z-50">
                    <MiniCalendar value={startDate} onChange={handleStartDateChange} onClose={() => setCalendarTarget(null)} />
                  </div>
                )}
                {calendarTarget === 'end' && (
                  <div className="absolute right-0 top-full mt-1 z-50">
                    <MiniCalendar value={dueDate} onChange={handleDueDateChange} onClose={() => setCalendarTarget(null)} />
                  </div>
                )}
              </div>

              {/* Labels */}
              <div className="grid grid-cols-[80px_1fr] items-start">
                <span className="text-[var(--color-text-secondary)] text-xs pt-0.5">Labels</span>
                <div className="flex flex-wrap gap-1">
                  {tags.length > 0 ? tags.map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">{t}</span>
                  )) : <span className="text-xs text-gray-400">None</span>}
                </div>
              </div>

              {/* Owner */}
              <div className="grid grid-cols-[80px_1fr] items-center">
                <span className="text-[var(--color-text-secondary)] text-xs">Owner</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-primary)]">
                  <img src={owner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${owner?.username || 'Guest'}`} className="w-5 h-5 rounded-full" alt="" />
                  {owner?.fullName || owner?.username || 'Unknown'}
                </span>
              </div>
            </div>

            {/* Activity feed */}
            <div className="mt-6 pt-5 border-t space-y-3" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0"><PrioritySignalIcon priority={TaskPriority.URGENT} /></div>
                <div className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                  <span className="font-semibold text-[var(--color-text-primary)]">{owner?.fullName || owner?.username || 'Unknown'}</span> changed priority to Ur...
                  <br />posted an update · {new Date(selectedTask.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <img src={owner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${owner?.username || 'Guest'}`} className="w-6 h-6 rounded-full shrink-0" alt="" />
                <div className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                  <span className="font-semibold text-[var(--color-text-primary)]">{owner?.fullName || owner?.username || 'Unknown'}</span>
                  <br />posted an update · {new Date(selectedTask.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
