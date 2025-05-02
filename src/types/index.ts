export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
};

export type Loop = {
  id: string;
  userId: string;
  title: string;
  emoji?: string;
  frequency: 'daily' | 'weekdays' | 'custom' | '3x-per-week';
  customDays?: number[]; // 0-6 for days of week
  startDate: Date;
  isPublic: boolean;
  createdAt: Date;
  completions: Completion[];
  streakCount: number;
  longestStreak: number;
  completionRate: number;
  cheers: Cheer[];
};

export type Completion = {
  id: string;
  loopId: string;
  date: Date; // The date of completion
  completed: boolean;
};

export type Cheer = {
  id: string;
  loopId: string;
  userId: string;
  reaction: string; // emoji
  createdAt: Date;
};

export enum LoopState {
  ACTIVE = 'active',
  BROKEN = 'broken',
  COMPLETED = 'completed',
}

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};