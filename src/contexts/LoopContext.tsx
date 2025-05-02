import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Loop, Completion, LoopState, Cheer } from '../types';
import { useAuth } from './AuthContext';
import { mockLoops } from '../data/mockData';
import { isToday, parseISO, format, compareDesc } from 'date-fns';

type LoopContextType = {
  loops: Loop[];
  publicLoops: Loop[];
  addLoop: (loop: Omit<Loop, 'id' | 'userId' | 'createdAt' | 'completions' | 'streakCount' | 'longestStreak' | 'completionRate' | 'cheers'>) => void;
  toggleCompletion: (loopId: string, date: Date) => void;
  deleteLoop: (loopId: string) => void;
  getLoopState: (loop: Loop) => LoopState;
  addCheer: (loopId: string, reaction: string) => void;
  cloneLoop: (loopId: string) => void;
  getLoopById: (loopId: string) => Loop | undefined;
};

const LoopContext = createContext<LoopContextType>({
  loops: [],
  publicLoops: [],
  addLoop: () => {},
  toggleCompletion: () => {},
  deleteLoop: () => {},
  getLoopState: () => LoopState.ACTIVE,
  addCheer: () => {},
  cloneLoop: () => {},
  getLoopById: () => undefined,
});

export const useLoops = () => useContext(LoopContext);

export const LoopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [loops, setLoops] = useState<Loop[]>([]);
  const [publicLoops, setPublicLoops] = useState<Loop[]>([]);

  // Load initial data
  useEffect(() => {
    if (user) {
      // Filter loops for the current user
      const userLoops = mockLoops.filter(loop => loop.userId === user.id);
      setLoops(userLoops);
    } else {
      setLoops([]);
    }
    
    // Get public loops for explore section
    const publicLoopsData = mockLoops.filter(loop => loop.isPublic);
    setPublicLoops(publicLoopsData);
  }, [user]);

  const calculateStreakStats = (completions: Completion[]): { streakCount: number; longestStreak: number; completionRate: number } => {
    if (completions.length === 0) {
      return { streakCount: 0, longestStreak: 0, completionRate: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let totalDays = completions.length;
    let completedDays = completions.filter(c => c.completed).length;

    // Sort completions by date (newest first)
    const sortedCompletions = [...completions].sort((a, b) => 
      compareDesc(new Date(a.date), new Date(b.date))
    );

    // Calculate current streak
    for (const completion of sortedCompletions) {
      if (completion.completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let tempStreak = 0;
    for (const completion of sortedCompletions) {
      if (completion.completed) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return {
      streakCount: currentStreak,
      longestStreak,
      completionRate: totalDays > 0 ? (completedDays / totalDays) * 100 : 0,
    };
  };

  const getLoopState = (loop: Loop): LoopState => {
    const { completions } = loop;
    
    if (completions.length === 0) {
      return LoopState.ACTIVE;
    }

    // Check if there's a completion for today
    const todayCompletion = completions.find(c => 
      isToday(new Date(c.date)) && c.completed
    );

    if (todayCompletion) {
      return LoopState.ACTIVE;
    }

    // Sort completions by date (newest first)
    const sortedCompletions = [...completions].sort((a, b) => 
      compareDesc(new Date(a.date), new Date(b.date))
    );

    // If the most recent completion is not completed, the streak is broken
    if (sortedCompletions[0] && !sortedCompletions[0].completed) {
      return LoopState.BROKEN;
    }

    return LoopState.ACTIVE;
  };

  const addLoop = (loopData: Omit<Loop, 'id' | 'userId' | 'createdAt' | 'completions' | 'streakCount' | 'longestStreak' | 'completionRate' | 'cheers'>) => {
    if (!user) return;

    const newLoop: Loop = {
      id: uuidv4(),
      userId: user.id,
      ...loopData,
      createdAt: new Date(),
      completions: [],
      streakCount: 0,
      longestStreak: 0,
      completionRate: 0,
      cheers: [],
    };

    setLoops(prevLoops => [...prevLoops, newLoop]);
    
    if (newLoop.isPublic) {
      setPublicLoops(prevPublicLoops => [...prevPublicLoops, newLoop]);
    }
  };

  const toggleCompletion = (loopId: string, date: Date) => {
    setLoops(prevLoops => {
      return prevLoops.map(loop => {
        if (loop.id === loopId) {
          const dateStr = format(date, 'yyyy-MM-dd');
          
          // Find if there's an existing completion for this date
          const existingCompletionIndex = loop.completions.findIndex(
            c => format(new Date(c.date), 'yyyy-MM-dd') === dateStr
          );
          
          let updatedCompletions;
          
          if (existingCompletionIndex >= 0) {
            // Toggle existing completion
            updatedCompletions = [...loop.completions];
            updatedCompletions[existingCompletionIndex] = {
              ...updatedCompletions[existingCompletionIndex],
              completed: !updatedCompletions[existingCompletionIndex].completed,
            };
          } else {
            // Create new completion
            updatedCompletions = [
              ...loop.completions,
              {
                id: uuidv4(),
                loopId,
                date,
                completed: true,
              },
            ];
          }

          const stats = calculateStreakStats(updatedCompletions);
          
          return {
            ...loop,
            completions: updatedCompletions,
            ...stats,
          };
        }
        return loop;
      });
    });

    // Also update public loops if needed
    setPublicLoops(prevPublicLoops => {
      return prevPublicLoops.map(loop => {
        if (loop.id === loopId) {
          // Find the updated loop from the user's loops
          const updatedLoop = loops.find(l => l.id === loopId);
          if (updatedLoop) {
            return updatedLoop;
          }
        }
        return loop;
      });
    });
  };

  const deleteLoop = (loopId: string) => {
    setLoops(prevLoops => prevLoops.filter(loop => loop.id !== loopId));
    setPublicLoops(prevPublicLoops => prevPublicLoops.filter(loop => loop.id !== loopId));
  };

  const addCheer = (loopId: string, reaction: string) => {
    if (!user) return;

    const newCheer: Cheer = {
      id: uuidv4(),
      loopId,
      userId: user.id,
      reaction,
      createdAt: new Date(),
    };

    // Update both lists
    setLoops(prevLoops => {
      return prevLoops.map(loop => {
        if (loop.id === loopId) {
          return {
            ...loop,
            cheers: [...loop.cheers, newCheer],
          };
        }
        return loop;
      });
    });

    setPublicLoops(prevPublicLoops => {
      return prevPublicLoops.map(loop => {
        if (loop.id === loopId) {
          return {
            ...loop,
            cheers: [...loop.cheers, newCheer],
          };
        }
        return loop;
      });
    });
  };

  const cloneLoop = (loopId: string) => {
    if (!user) return;

    const loopToClone = [...loops, ...publicLoops].find(loop => loop.id === loopId);
    if (!loopToClone) return;

    const clonedLoop: Loop = {
      id: uuidv4(),
      userId: user.id,
      title: `${loopToClone.title} (cloned)`,
      emoji: loopToClone.emoji,
      frequency: loopToClone.frequency,
      customDays: loopToClone.customDays,
      startDate: new Date(),
      isPublic: false, // Default to private for cloned loops
      createdAt: new Date(),
      completions: [],
      streakCount: 0,
      longestStreak: 0,
      completionRate: 0,
      cheers: [],
    };

    setLoops(prevLoops => [...prevLoops, clonedLoop]);
  };

  const getLoopById = (loopId: string): Loop | undefined => {
    return [...loops, ...publicLoops].find(loop => loop.id === loopId);
  };

  return (
    <LoopContext.Provider
      value={{
        loops,
        publicLoops,
        addLoop,
        toggleCompletion,
        deleteLoop,
        getLoopState,
        addCheer,
        cloneLoop,
        getLoopById,
      }}
    >
      {children}
    </LoopContext.Provider>
  );
};