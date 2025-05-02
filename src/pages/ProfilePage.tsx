import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLoops } from '../contexts/LoopContext';
import LoopCard from '../components/loop/LoopCard';
import Button from '../components/ui/Button';
import { User, Mail, Calendar, Award } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { loops } = useLoops();
  
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-medium mb-2">Sign in to view your profile</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <Link to="/login">
            <Button>Log in</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Calculate profile statistics
  const activeLoopsCount = loops.length;
  const totalCompletions = loops.reduce((acc, loop) => acc + loop.completions.filter(c => c.completed).length, 0);
  const longestStreak = loops.reduce((acc, loop) => Math.max(acc, loop.longestStreak), 0);
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:mr-6 mb-4 md:mb-0 flex justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              
              <div className="mt-2 flex items-center justify-center md:justify-start text-gray-600">
                <Mail size={16} className="mr-1" />
                <span>{user.email}</span>
              </div>
              
              <div className="mt-2 flex items-center justify-center md:justify-start text-gray-600">
                <Calendar size={16} className="mr-1" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex justify-center">
              <Button
                variant="outline"
                onClick={logout}
              >
                Log out
              </Button>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
              <Award size={24} className="text-primary-500 mb-1" />
              <span className="text-2xl font-bold">{activeLoopsCount}</span>
              <span className="text-sm text-gray-600">Active Loops</span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
              <Award size={24} className="text-primary-500 mb-1" />
              <span className="text-2xl font-bold">{totalCompletions}</span>
              <span className="text-sm text-gray-600">Total Completions</span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
              <Award size={24} className="text-primary-500 mb-1" />
              <span className="text-2xl font-bold">{longestStreak}</span>
              <span className="text-sm text-gray-600">Longest Streak</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Your Loops</h2>
        
        {loops.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-xl font-medium mb-2">No loops yet</h2>
            <p className="text-gray-600 mb-6">Start tracking your first habit loop!</p>
            <Link to="/new">
              <Button>Create Loop</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loops.map((loop) => (
              <LoopCard key={loop.id} loop={loop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;