'use client';

import { useState, useEffect } from 'react';
import { useProjectsStore } from '@/store';
import { CreateProjectModal } from '@/components/projects/create-project-modal';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';

export function ProjectsPage() {
  const { projects, filter, isLoading, deleteProject } = useProjectsStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredProjects = projects.filter(project => {
    if (filter.priority && project.priority !== filter.priority) return false;
    return true;
  });

  // Event listener for create project modal opened from dashboard header
  useEffect(() => {
    const handleOpenModal = () => setShowCreateModal(true);
    document.addEventListener('openCreateProjectModal', handleOpenModal);
    return () => document.removeEventListener('openCreateProjectModal', handleOpenModal);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 font-semibold';
      case 'HIGH': return 'text-red-500 font-medium';
      case 'MEDIUM': return 'text-orange-500 font-medium';
      case 'LOW': return 'text-blue-500 font-medium';
      default: return 'text-gray-400 font-medium';
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-[var(--color-text-secondary)]">Loading projects...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="space-y-4">
        
        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 px-2 pb-2 border-b text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider" style={{ borderColor: 'var(--color-border)' }}>
          <div className="col-span-5">Projects</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Lead</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Project List */}
        <div className="space-y-2">
          {filteredProjects.map((project) => (
            <div 
              key={project._id}
              className="grid grid-cols-12 gap-4 px-2 py-3 bg-[var(--color-bg-card)] rounded-lg border items-center hover:shadow-sm transition-shadow group relative"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {/* Project Name */}
              <div className="col-span-5 flex items-center gap-3">
                 <div className="w-5 h-5 rounded border border-gray-300 bg-[var(--color-bg-card)]" />
                 <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                   {project.name}
                 </span>
              </div>

              {/* Priority */}
              <div className="col-span-2 flex items-center gap-2 text-sm">
                {project.priority !== 'NONE' && (
                  <div className="flex gap-0.5 items-end h-4">
                    <div className={`w-1 rounded-full ${project.priority === 'LOW' ? 'bg-gray-300' : project.priority === 'MEDIUM' ? 'bg-orange-500 h-2' : 'bg-red-500 h-3'}`} />
                    <div className={`w-1 rounded-full ${project.priority === 'LOW' || project.priority === 'MEDIUM' ? 'bg-gray-300 h-2' : 'bg-red-500 h-4'}`} />
                  </div>
                )}
                {project.priority === 'NONE' && <div className="w-3 h-3 rounded-full border-2 border-gray-300" />}
                <span className={getPriorityColor(project.priority)}>
                  {project.priority === 'NONE' ? 'No Priority' : project.priority.charAt(0) + project.priority.slice(1).toLowerCase()}
                </span>
              </div>

              {/* Lead */}
              <div className="col-span-2 flex items-center">
                 <img src={project.lead || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"} className="w-6 h-6 rounded-full border border-[var(--color-border)]" alt="Lead" />
              </div>

              {/* Due Date */}
              <div className="col-span-2 text-sm text-gray-600">
                 {project.dueDate ? new Date(project.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end relative">
                <button 
                  onClick={() => setOpenMenuId(openMenuId === project._id ? null : project._id)}
                  className="p-1 rounded text-gray-400 hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {openMenuId === project._id && (
                  <div className="absolute right-0 top-full mt-1 w-32 rounded-lg py-1 shadow-lg border z-10 bg-[var(--color-bg-card)]">
                    <button 
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this project?')) {
                          await deleteProject(project._id);
                          setOpenMenuId(null);
                        }
                      }} 
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add Project Row */}
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-3 mt-2 w-full rounded-lg text-sm font-medium hover:bg-[var(--color-bg-hover)] group border border-transparent hover:border-[var(--color-border)] transition-colors"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            <Plus className="w-4 h-4 group-hover:text-black transition-colors" />
            Add Project
          </button>
        </div>
      </div>

      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
