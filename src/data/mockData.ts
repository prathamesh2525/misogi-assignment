import { User, Loop } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays } from 'date-fns';

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Jane Cooper',
    email: 'jane@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 'user-2',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    createdAt: new Date('2023-02-20'),
  },
];

// Generate mock completions for a loop
const generateCompletions = (loopId: string, daysCount: number = 30, completionRate: number = 0.8) => {
  const completions = [];
  const today = new Date();
  
  for (let i = 0; i < daysCount; i++) {
    const date = subDays(today, i);
    const completed = Math.random() < completionRate;
    
    completions.push({
      id: uuidv4(),
      loopId,
      date,
      completed,
    });
  }
  
  return completions;
};

// Generate mock cheers
const generateCheers = (loopId: string, count: number = 3) => {
  const cheers = [];
  const reactions = ['👏', '🔥', '💪', '🙌', '❤️', '🎉'];
  
  for (let i = 0; i < count; i++) {
    cheers.push({
      id: uuidv4(),
      loopId,
      userId: i % 2 === 0 ? 'user-1' : 'user-2',
      reaction: reactions[Math.floor(Math.random() * reactions.length)],
      createdAt: subDays(new Date(), Math.floor(Math.random() * 7)),
    });
  }
  
  return cheers;
};

// Mock loops
export const mockLoops: Loop[] = [
  {
    id: 'loop-1',
    userId: 'user-1',
    title: 'Read 10 pages',
    emoji: '📚',
    frequency: 'daily',
    startDate: subDays(new Date(), 30),
    isPublic: true,
    createdAt: subDays(new Date(), 30),
    completions: generateCompletions('loop-1', 30, 0.9),
    streakCount: 5,
    longestStreak: 12,
    completionRate: 83,
    cheers: generateCheers('loop-1', 5),
  },
  {
    id: 'loop-2',
    userId: 'user-1',
    title: 'Morning meditation',
    emoji: '🧘',
    frequency: 'weekdays',
    startDate: subDays(new Date(), 45),
    isPublic: false,
    createdAt: subDays(new Date(), 45),
    completions: generateCompletions('loop-2', 45, 0.7),
    streakCount: 2,
    longestStreak: 15,
    completionRate: 67,
    cheers: [],
  },
  {
    id: 'loop-3',
    userId: 'user-2',
    title: 'No sugar after 7pm',
    emoji: '🍬',
    frequency: 'daily',
    startDate: subDays(new Date(), 20),
    isPublic: true,
    createdAt: subDays(new Date(), 20),
    completions: generateCompletions('loop-3', 20, 0.85),
    streakCount: 8,
    longestStreak: 8,
    completionRate: 85,
    cheers: generateCheers('loop-3', 7),
  },
  {
    id: 'loop-4',
    userId: 'user-2',
    title: 'Push-ups',
    emoji: '💪',
    frequency: '3x-per-week',
    startDate: subDays(new Date(), 60),
    isPublic: true,
    createdAt: subDays(new Date(), 60),
    completions: generateCompletions('loop-4', 60, 0.6),
    streakCount: 0,
    longestStreak: 6,
    completionRate: 60,
    cheers: generateCheers('loop-4', 2),
  },
  {
    id: 'loop-5',
    userId: 'user-1',
    title: 'Study Spanish',
    emoji: '🇪🇸',
    frequency: 'weekdays',
    startDate: subDays(new Date(), 14),
    isPublic: true,
    createdAt: subDays(new Date(), 14),
    completions: generateCompletions('loop-5', 14, 0.95),
    streakCount: 10,
    longestStreak: 10,
    completionRate: 93,
    cheers: generateCheers('loop-5', 8),
  },
];