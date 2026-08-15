import { create } from 'zustand';
import { authApi, tasksApi, projectsApi } from '@/lib/api';
import type { User, Task, TaskStats, TaskFilter, Project } from '@/types';

// ─── Auth Store ──────────────────────────────────────────────
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  guestLogin: (username?: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
  updateTheme: (theme: string) => Promise<void>;
  updateColorMode: (colorMode: string) => Promise<void>;
  updateProfile: (data: { fullName?: string; title?: string; username?: string; email?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  guestLogin: async (username?: string) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.guestLogin(username);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({
        user: data.user,
        token: data.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.login({ username, password });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({
        user: data.user,
        token: data.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (username: string, password: string, email?: string) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.register({ username, password, email });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({
        user: data.user,
        token: data.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true });
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
  },

  updateTheme: async (theme: string) => {
    try {
      await authApi.updateTheme(theme);
      const user = get().user;
      if (user) {
        const updatedUser = { ...user, theme };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      }
    } catch (error) {
      throw error;
    }
  },

  updateColorMode: async (colorMode: string) => {
    try {
      await authApi.updateColorMode(colorMode);
      const user = get().user;
      if (user) {
        const updatedUser = { ...user, colorMode };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      }
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await authApi.updateProfile(data);
      const user = get().user;
      if (user) {
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      }
    } catch (error) {
      throw error;
    }
  }
}));

// ─── UI Store ─────────────────────────────────────────────────
export type Page = 'tasks' | 'projects' | 'settings';
export type ViewMode = 'board' | 'list';

interface UIState {
  activePage: Page;
  viewMode: ViewMode;
  visibleFields: {
    priority: boolean;
    members: boolean;
    dueDate: boolean;
    labels: boolean;
    status: boolean;
    reporter: boolean;
  };

  setActivePage: (page: Page) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleField: (field: keyof UIState['visibleFields']) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activePage: 'tasks',
  viewMode: 'board',
  visibleFields: {
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
    reporter: true,
  },

  setActivePage: (page) => set({ activePage: page }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleField: (field) => set((state) => ({
    visibleFields: {
      ...state.visibleFields,
      [field]: !state.visibleFields[field],
    }
  })),
}));

// ─── Tasks Store ──────────────────────────────────────────────
interface TasksState {
  tasks: Task[];
  stats: TaskStats | null;
  isLoading: boolean;
  filter: TaskFilter;
  selectedTask: Task | null;

  fetchTasks: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilter: (filter: Partial<TaskFilter>) => void;
  clearFilter: () => void;
  setSelectedTask: (task: Task | null) => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  stats: null,
  isLoading: false,
  filter: {},
  selectedTask: null,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const filter = get().filter;
      const params: Record<string, string> = {};
      if (filter.status) params.status = filter.status;
      if (filter.priority) params.priority = filter.priority;
      if (filter.category) params.category = filter.category;
      if (filter.search) params.search = filter.search;
      if (filter.sortBy) params.sortBy = filter.sortBy;
      if (filter.sortOrder) params.sortOrder = filter.sortOrder;

      const { data } = await tasksApi.getAll(params);
      set({ tasks: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchStats: async () => {
    try {
      const { data } = await tasksApi.getStats();
      set({ stats: data });
    } catch (error) {
      throw error;
    }
  },

  createTask: async (task: Partial<Task>) => {
    try {
      await tasksApi.create(task as any);
      await get().fetchTasks();
      await get().fetchStats();
    } catch (error) {
      throw error;
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    try {
      await tasksApi.update(id, updates as any);
      await get().fetchTasks();
      await get().fetchStats();
    } catch (error) {
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    try {
      await tasksApi.delete(id);
      await get().fetchTasks();
      await get().fetchStats();
    } catch (error) {
      throw error;
    }
  },

  setFilter: (filter: Partial<TaskFilter>) => {
    set((state) => ({ filter: { ...state.filter, ...filter } }));
    get().fetchTasks();
  },

  clearFilter: () => {
    set({ filter: {} });
    get().fetchTasks();
  },

  setSelectedTask: (task: Task | null) => {
    set({ selectedTask: task });
  },
}));

// ─── Projects Store ───────────────────────────────────────────
interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  filter: TaskFilter;

  fetchProjects: () => Promise<void>;
  createProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setFilter: (filter: Partial<TaskFilter>) => void;
  clearFilter: () => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  isLoading: false,
  filter: {},

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const { data } = await projectsApi.getAll();
      set({ projects: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createProject: async (project: Partial<Project>) => {
    try {
      await projectsApi.create(project as any);
      await get().fetchProjects();
    } catch (error) {
      throw error;
    }
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    try {
      await projectsApi.update(id, updates as any);
      await get().fetchProjects();
    } catch (error) {
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    try {
      await projectsApi.delete(id);
      await get().fetchProjects();
    } catch (error) {
      throw error;
    }
  },

  setFilter: (filter: Partial<TaskFilter>) => {
    set((state) => ({ filter: { ...state.filter, ...filter } }));
  },

  clearFilter: () => {
    set({ filter: {} });
  },
}));
