export type Priority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  category: string;
  createdAt: string;
  completedAt?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  rawText: string;
  wordCount: number;
  readingTimeMin: number;
  summary: string;
  keyPoints: string[];
  keywords: string[];
  status: 'ready' | 'processing' | 'error';
  errorMessage?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'nova';
  text: string;
  timestamp: string;
  category?: 'brainstorm' | 'summary' | 'planning' | 'explanation' | 'general';
  suggestedFollowUps?: string[];
}

export interface ActivityItem {
  id: string;
  type: 'task' | 'document' | 'note' | 'assistant';
  title: string;
  description: string;
  timestamp: string;
}

export interface UserSettings {
  displayName: string;
  email: string;
  role: string;
  theme: 'dark' | 'midnight' | 'cyber';
  notifications: boolean;
  soundEffects: boolean;
  autoSummarize: boolean;
  dailyGoalTasks: number;
}
