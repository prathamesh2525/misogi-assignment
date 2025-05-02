import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Loop, LoopState } from '../../types';
import { useLoops } from '../../contexts/LoopContext';
import { Trash2, Copy, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoopCardProps {
  loop: Loop;
  showActions?: boolean;
  isPublic?: boolean;
}

const LoopCard: React.FC<LoopCardProps> = ({ loop, showActions = true, isPublic = false }) => {
  const { getLoopState, toggleCompletion, deleteLoop, addCheer, cloneLoop } = useLoops();
  const { isAuthenticated, user } = useAuth();
  const loopState = getLoopState(loop);
  
  const handleToggleCompletion = () => {
    toggleCompletion(loop.id, new Date());
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm('Are you sure you want to delete this loop?')) {
      deleteLoop(loop.id);
    }
  };
  
  const handleCheer = (e: React.MouseEvent, reaction: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('You need to log in to cheer!');
      return;
    }
    
    addCheer(loop.id, reaction);
  };
  
  const handleClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('You need to log in to clone this loop!');
      return;
    }
    
    cloneLoop(loop.id);
  };
  
  // Group cheers by reaction
  const cheerCounts: Record<string, number> = {};
  
  loop.cheers.forEach(cheer => {
    if (cheerCounts[cheer.reaction]) {
      cheerCounts[cheer.reaction]++;
    } else {
      cheerCounts[cheer.reaction] = 1;
    }
  });
  
  const hasUserCheered = isAuthenticated && loop.cheers.some(cheer => cheer.userId === user?.id);
  
  const stateStyles = {
    [LoopState.ACTIVE]: 'bg-accent-500',
    [LoopState.BROKEN]: 'bg-error-500',
    [LoopState.COMPLETED]: 'bg-success-500',
  };
  
  const stateLabels = {
    [LoopState.ACTIVE]: 'Active',
    [LoopState.BROKEN]: 'Broken',
    [LoopState.COMPLETED]: 'Completed',
  };
  
  return (
    <Link 
      to={`/loop/${loop.id}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden flex flex-col"
    >
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            {loop.emoji && (
              <span className="text-2xl" role="img" aria-label="Loop emoji">
                {loop.emoji}
              </span>
            )}
            <h3 className="font-bold text-lg">{loop.title}</h3>
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs text-white ${stateStyles[loopState]}`}>
            {stateLabels[loopState]}
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              {loop.frequency === 'daily' && 'Every day'}
              {loop.frequency === 'weekdays' && 'Weekdays only'}
              {loop.frequency === '3x-per-week' && '3 times per week'}
              {loop.frequency === 'custom' && 'Custom schedule'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Started {format(new Date(loop.startDate), 'MMM d, yyyy')}
            </p>
          </div>
          
          {isAuthenticated && !isPublic && (
            <button
              onClick={handleToggleCompletion}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                loop.completions.some(c => 
                  format(new Date(c.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && c.completed
                )
                  ? 'bg-accent-500 border-accent-600 text-white animate-pulse-success'
                  : 'border-gray-300 hover:border-accent-500'
              }`}
            >
              {loop.completions.some(c => 
                format(new Date(c.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && c.completed
              ) && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="flex space-x-4">
            <div>
              <span className="font-medium text-primary-500">{loop.streakCount}</span>
              <span className="text-gray-500 ml-1">day streak</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">{loop.longestStreak}</span>
              <span className="text-gray-500 ml-1">best</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="font-medium">{Math.round(loop.completionRate)}%</span>
            <div className="ml-2 bg-gray-200 rounded-full h-2 w-16 overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${loop.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {showActions && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
          <div className="flex space-x-2">
            {Object.entries(cheerCounts).map(([reaction, count]) => (
              <button
                key={reaction}
                onClick={(e) => handleCheer(e, reaction)}
                className={`px-2 py-1 rounded-full text-xs border ${
                  hasUserCheered
                    ? 'border-primary-300 bg-primary-50 text-primary-500'
                    : 'border-gray-300 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                {reaction} {count}
              </button>
            ))}
            
            {Object.keys(cheerCounts).length < 3 && isAuthenticated && (
              <button
                onClick={(e) => handleCheer(e, '❤️')}
                className="px-2 py-1 rounded-full text-xs border border-gray-300 hover:border-primary-300 hover:bg-primary-50"
              >
                <Heart size={12} className="inline mr-1" />
                Cheer
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            {isPublic && isAuthenticated && (
              <button
                onClick={handleClone}
                className="text-gray-500 hover:text-primary-500"
                title="Clone this loop"
              >
                <Copy size={16} />
              </button>
            )}
            
            {!isPublic && user?.id === loop.userId && (
              <button
                onClick={handleDelete}
                className="text-gray-500 hover:text-error-500"
                title="Delete loop"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </Link>
  );
};

export default LoopCard;