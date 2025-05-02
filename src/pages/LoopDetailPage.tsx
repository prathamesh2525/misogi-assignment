import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useLoops } from '../contexts/LoopContext';
import { useAuth } from '../contexts/AuthContext';
import LoopCalendar from '../components/loop/LoopCalendar';
import Button from '../components/ui/Button';
import { ArrowLeft, Copy, Trash2, Award, Calendar, BarChart } from 'lucide-react';

const LoopDetailPage: React.FC = () => {
  const { loopId } = useParams<{ loopId: string }>();
  const { getLoopById, deleteLoop, toggleCompletion, cloneLoop } = useLoops();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Get the loop by ID
  const loop = loopId ? getLoopById(loopId) : undefined;
  
  if (!loop) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-medium mb-2">Loop not found</h2>
          <p className="text-gray-600 mb-6">The loop you're looking for doesn't exist or has been deleted.</p>
          <Link to="/">
            <Button variant="outline">Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const isOwner = isAuthenticated && user?.id === loop.userId;
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this loop?')) {
      deleteLoop(loop.id);
      navigate('/');
    }
  };
  
  const handleClone = () => {
    if (!isAuthenticated) {
      alert('You need to log in to clone this loop!');
      return;
    }
    
    cloneLoop(loop.id);
    navigate('/');
  };
  
  const handleToggleCompletion = () => {
    if (!isAuthenticated) {
      alert('You need to log in to mark completions!');
      return;
    }
    
    toggleCompletion(loop.id, new Date());
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              {loop.emoji && (
                <span className="text-4xl" role="img" aria-label="Loop emoji">
                  {loop.emoji}
                </span>
              )}
              <h1 className="text-2xl font-bold">{loop.title}</h1>
            </div>
            
            <div className="flex space-x-2">
              {isOwner && (
                <Button
                  variant="error"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
              
              {!isOwner && isAuthenticated && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Copy size={16} />}
                  onClick={handleClone}
                >
                  Clone
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>
              {loop.frequency === 'daily' && 'Every day'}
              {loop.frequency === 'weekdays' && 'Weekdays only'}
              {loop.frequency === '3x-per-week' && '3 times per week'}
              {loop.frequency === 'custom' && 'Custom schedule'}
              {' • '}
              Started {format(new Date(loop.startDate), 'MMM d, yyyy')}
              {' • '}
              {loop.isPublic ? 'Public loop' : 'Private loop'}
            </p>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
              <Award size={24} className="text-primary-500 mb-1" />
              <span className="text-2xl font-bold text-primary-500">{loop.streakCount}</span>
              <span className="text-sm text-gray-600">Current streak</span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
              <Calendar size={24} className="text-primary-500 mb-1" />
              <span className="text-2xl font-bold">{loop.longestStreak}</span>
              <span className="text-sm text-gray-600">Longest streak</span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
              <BarChart size={24} className="text-primary-500 mb-1" />
              <span className="text-2xl font-bold">{Math.round(loop.completionRate)}%</span>
              <span className="text-sm text-gray-600">Completion rate</span>
            </div>
          </div>
          
          {isAuthenticated && (isOwner || loop.isPublic) && (
            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                variant={
                  loop.completions.some(c => 
                    format(new Date(c.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && c.completed
                  ) ? 'success' : 'primary'
                }
                onClick={handleToggleCompletion}
                className="px-8"
              >
                {loop.completions.some(c => 
                  format(new Date(c.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && c.completed
                ) ? 'Completed Today ✓' : 'Mark as Complete'}
              </Button>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">Progress Calendar</h2>
          <LoopCalendar loop={loop} showMonths={3} />
        </div>
        
        {loop.cheers.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Cheers</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(
                loop.cheers.reduce<Record<string, number>>((acc, cheer) => {
                  acc[cheer.reaction] = (acc[cheer.reaction] || 0) + 1;
                  return acc;
                }, {})
              ).map(([reaction, count]) => (
                <div
                  key={reaction}
                  className="px-3 py-2 bg-gray-50 rounded-full text-sm border border-gray-200"
                >
                  {reaction} <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoopDetailPage;