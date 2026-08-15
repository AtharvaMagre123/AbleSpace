"use client";

import { useState, useEffect } from "react";
import { useTasksStore, useUIStore, useAuthStore } from "@/store";
import type { Task, TaskMember } from "@/types";
import { usersApi } from "@/lib/api";
import { MoreHorizontal, Calendar, Trash2, Tag, Pencil, CheckCircle2, X as XIcon } from "lucide-react";

function PrioritySignalIcon({
  priority,
  className = "",
}: {
  priority: string;
  className?: string;
}) {
  const bars = [1, 2, 3, 4];

  let activeBars = 0;
  if (priority === "LOW") activeBars = 1;
  else if (priority === "MEDIUM") activeBars = 2;
  else if (priority === "HIGH") activeBars = 3;
  else if (priority === "URGENT") activeBars = 4;

  if (activeBars === 0) {
    return (
      <div className={`flex items-end h-[14px] pb-[2px] ${className}`}>
        <div className="w-[3px] h-[3px] rounded-[1px] bg-current" />
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-[2px] h-[14px] pb-[3px] ${className}`}>
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

interface TaskCardProps {
  task: Task;
  variant: "card" | "list";
}

export function TaskCard({ task, variant }: TaskCardProps) {
  const { deleteTask, setSelectedTask, updateTask } = useTasksStore();
  const { visibleFields } = useUIStore();
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const [membersOpen, setMembersOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberResults, setMemberResults] = useState<any[]>([]);
  const [memberSearchLoading, setMemberSearchLoading] = useState(false);

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

  const handleAddMember = async (member: any) => {
    const userId = member.id || member.userId;
    if (!userId) return;
    const currentMembers = task.members || [];
    if (currentMembers.some(m => m.userId === userId)) {
      setMembersOpen(false);
      return;
    }
    const updatedMembers = [...currentMembers, {
      userId: userId,
      username: member.username || '',
      avatar: member.avatar,
      fullName: member.fullName
    }];
    await updateTask(task._id, { members: updatedMembers });
    setMembersOpen(false);
    setMemberSearch('');
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task._id);
    }
  };

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate).setHours(23, 59, 59, 999) < new Date().getTime() &&
    task.status !== "COMPLETED";

  if (variant === "list") {
    return (
      <div
        draggable
        onDragStart={(e) => e.dataTransfer.setData("taskId", task._id)}
        onClick={() => setSelectedTask(task)}
        className="flex flex-col sm:flex-row sm:items-center px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-hover)] transition-colors group cursor-pointer text-[13px] gap-2 sm:gap-0 outline-none"
      >
        {/* Task Name */}
        <div className="flex-[2] min-w-0 pr-4">
          <span className="font-medium text-[var(--color-text-primary)] truncate block">
            {task.title}
          </span>
        </div>

        {/* Priority */}
        {visibleFields.priority && (
          <div className="w-[120px] shrink-0 flex items-center gap-1.5">
            <>
              {task.priority === "HIGH" || task.priority === "URGENT" ? (
                <>
                  <PrioritySignalIcon
                    priority={task.priority}
                    className={
                      task.priority === "URGENT"
                        ? "text-red-500"
                        : "text-orange-500"
                    }
                  />
                  <span
                    className={`text-[12px] font-medium ${task.priority === "URGENT" ? "text-red-500" : "text-orange-500"}`}
                  >
                    {task.priority === "URGENT" ? "Urgent" : "High"}
                  </span>
                </>
              ) : task.priority === "MEDIUM" ? (
                <>
                  <PrioritySignalIcon
                    priority={task.priority}
                    className="text-yellow-500"
                  />
                  <span className="text-[12px] text-yellow-500 font-medium">
                    Medium
                  </span>
                </>
              ) : task.priority === "LOW" ? (
                <>
                  <PrioritySignalIcon
                    priority={task.priority}
                    className="text-gray-400"
                  />
                  <span className="text-[12px] text-gray-400 font-medium">
                    Low
                  </span>
                </>
              ) : (
                <span className="text-[12px] text-gray-400 font-medium">
                  No Priority
                </span>
              )}
            </>
          </div>
        )}

        {/* Members */}
        {visibleFields.members && (
          <div className="w-[120px] shrink-0 flex items-center relative">
            <div className="flex items-center -space-x-1.5">
              {task.members && task.members.length > 0 ? (
                task.members.slice(0, 3).map((m, i) => (
                  <img
                    key={m.userId}
                    src={m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username}`}
                    title={m.username}
                    className="w-[22px] h-[22px] rounded-full ring-2 ring-[var(--color-bg-card)] object-cover bg-gray-100 relative z-0"
                  />
                ))
              ) : null}
              {task.members && task.members.length > 3 && (
                <div className="w-[22px] h-[22px] rounded-full ring-2 ring-[var(--color-bg-card)] bg-[var(--color-bg-hover)] flex items-center justify-center text-[10px] font-medium text-[var(--color-text-secondary)] relative z-0">
                  +{task.members.length - 3}
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMembersOpen(!membersOpen);
                }}
                className={`w-[22px] h-[22px] rounded-full bg-[var(--color-bg-hover)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors border border-dashed border-gray-300 relative z-10 ${task.members?.length ? 'ml-1' : ''}`}
              >
                <span className="text-[14px] leading-none mb-[2px]">+</span>
              </button>
            </div>
            
            {membersOpen && (
              <div className="absolute left-0 top-full mt-1 w-[220px] bg-[var(--color-bg-card)] border rounded-xl shadow-lg p-2 z-50" style={{ borderColor: 'var(--color-border)' }} onClick={e => e.stopPropagation()}>
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
                    <div className="text-xs text-center text-[var(--color-text-secondary)] py-2">Searching...</div>
                  ) : memberResults.length > 0 ? (
                    memberResults.map(u => {
                      const isAssigned = task.members?.some(m => m.userId === (u.id || u.userId));
                      return (
                        <button
                          key={u.id || u.userId}
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
                    <div className="text-xs text-center text-[var(--color-text-secondary)] py-2">No users found</div>
                  ) : (
                    <div className="text-xs text-center text-[var(--color-text-secondary)] py-2">Type to search</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Due Date */}
        {visibleFields.dueDate && (
          <div
            className={`w-[140px] shrink-0 text-[13px] ${isOverdue ? "text-red-500 font-semibold" : "text-[var(--color-text-secondary)]"}`}
          >
            {formattedDate || "-"}
          </div>
        )}

        {/* Actions */}
        <div className="w-[60px] shrink-0 flex justify-end pr-2 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] opacity-0 group-hover:opacity-100 transition-all outline-none"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-32 rounded-lg py-1 shadow-lg border border-[var(--color-border)] z-10 bg-[var(--color-bg-card)]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-gray-700 hover:bg-[var(--color-bg-hover)] transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Card Variant for Board View ──────────────────────────────
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("taskId", task._id)}
      onClick={() => setSelectedTask(task)}
      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 hover:shadow-md transition-all block outline-none group relative cursor-pointer"
    >
      {/* Title + Menu */}
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-[16px] font-semibold leading-snug pr-2 text-[var(--color-text-primary)]">
          {task.title}
        </h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 rounded text-gray-600 hover:bg-[var(--color-bg-hover)] transition-colors shrink-0 outline-none"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
        {showMenu && (
          <div className="absolute right-3 top-8 w-32 rounded-lg py-1 shadow-lg border z-10 bg-[var(--color-bg-card)] border-[var(--color-border)]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-gray-700 hover:bg-[var(--color-bg-hover)] transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Assignee + Due Date row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center -space-x-1.5 relative">
          {task.members && task.members.length > 0 ? (
            task.members.slice(0, 3).map((m, i) => (
              <img
                key={m.userId}
                src={m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.username}`}
                title={m.username}
                className="w-6 h-6 rounded-full object-cover border border-[var(--color-border)] relative z-0 bg-[var(--color-bg-card)]"
              />
            ))
          ) : (
            <div className="w-6 h-6 rounded-full border border-dashed border-gray-400 flex items-center justify-center bg-[var(--color-bg-hover)] text-gray-400">
              <span className="text-xs">?</span>
            </div>
          )}
          {task.members && task.members.length > 3 && (
            <div className="w-6 h-6 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-hover)] flex items-center justify-center text-[10px] font-medium text-[var(--color-text-secondary)] relative z-0">
              +{task.members.length - 3}
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMembersOpen(!membersOpen);
            }}
            className={`w-6 h-6 rounded-full bg-[var(--color-bg-hover)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors border border-dashed border-gray-300 relative z-10 ${task.members?.length ? 'ml-1' : ''}`}
          >
            <span className="text-[14px] leading-none mb-[2px]">+</span>
          </button>
          
          {membersOpen && (
            <div className="absolute left-0 top-full mt-1 w-[220px] bg-[var(--color-bg-card)] border rounded-xl shadow-lg p-2 z-50" style={{ borderColor: 'var(--color-border)' }} onClick={e => e.stopPropagation()}>
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
                  <div className="text-xs text-center text-[var(--color-text-secondary)] py-2">Searching...</div>
                ) : memberResults.length > 0 ? (
                  memberResults.map(u => {
                    const isAssigned = task.members?.some(m => m.userId === (u.id || u.userId));
                    return (
                      <button
                        key={u.id || u.userId}
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
                  <div className="text-xs text-center text-[var(--color-text-secondary)] py-2">No users found</div>
                ) : (
                  <div className="text-xs text-center text-[var(--color-text-secondary)] py-2">Type to search</div>
                )}
              </div>
            </div>
          )}
        </div>

        {formattedDate && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-medium ${isOverdue ? "bg-red-50 text-red-500" : "bg-[var(--color-bg-hover)] text-gray-600"}`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {formattedDate}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        {task.priority === "HIGH" || task.priority === "URGENT" ? (
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${task.priority === "URGENT" ? "bg-red-50 text-red-600 border-red-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}
          >
            <PrioritySignalIcon priority={task.priority} />{" "}
            {task.priority === "URGENT" ? "Urgent" : "High"}
          </span>
        ) : task.priority === "MEDIUM" ? (
          <span className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded text-[10px] font-medium border border-yellow-100">
            <PrioritySignalIcon priority={task.priority} /> Medium
          </span>
        ) : task.priority === "LOW" ? (
          <span className="flex items-center gap-1 bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200">
            <PrioritySignalIcon priority={task.priority} /> Low
          </span>
        ) : null}
      </div>

      {/* Label tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {task.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] overflow-hidden text-ellipsis whitespace-nowrap"
            >
              <svg
                className="shrink-0 text-gray-500"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              <span className="truncate">{tag}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
