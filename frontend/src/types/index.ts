export interface TaskMember {
  userId: string;
  username: string;
  avatar?: string;
  fullName?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  isGuest: boolean;
  theme: string;
  colorMode: string;
  role: string;
  avatar?: string;
  fullName?: string;
  title?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export enum TaskPriority {
  NONE = 'NONE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate?: string;
  dueDate?: string;
  category?: string;
  tags: string[];
  order: number;
  parentId?: string;
  comments?: {
    _id?: string;
    text: string;
    authorName: string;
    authorAvatar: string;
    createdAt?: string;
  }[];
  userId: string | any;
  createdAt: string;
  updatedAt: string;
  members?: TaskMember[];
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  completionRate: number;
}

export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  lead?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
