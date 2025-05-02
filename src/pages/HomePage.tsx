import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoops } from '../contexts/LoopContext';
import { useAuth } from '../contexts/AuthContext';
import LoopCard from '../components/loop/LoopCard';
import Button from '../components/ui/Button';
import { Plus } from 'lucide-react';

enum FilterOption {
  ALL = 'all',
  ACTIVE = 'active',
  BROKEN = 'broken',
}

const HomePage: React.FC = () => {
  const { loops } = useLoops();
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<FilterOption>(FilterOption.ALL);
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-13rem)] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Build better habits with LoopList</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          Track your daily micro-habits, build streaks, and share your progress with a supportive community.
        </p>
        <Link to="/signup">
          <Button size="lg">Get Started</Button>
        </Link>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-primary-500 text-3xl mb-3">📊</div>
            <h3 className="text-lg font-medium mb-2">Visual Progress</h3>
            <p className="text-gray-600">Track your streaks with beautiful visualizations that keep you motivated.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-primary-500 text-3xl mb-3">🔄</div>
            <h3 className="text-lg font-medium mb-2">Build Consistency</h3>
            <p className="text-gray-600">Simple daily check-ins help you build consistent habits that last.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-primary-500 text-3xl mb-3">👥</div>
            <h3 className="text-lg font-medium mb-2">Social Accountability</h3>
            <p className="text-gray-600">Share your progress, get encouragement, and discover trending habits.</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Filter loops based on the selected filter
  const filteredLoops = loops.filter(loop => {
    if (filter === FilterOption.ALL) return true;
    const { getLoopState } = useLoops();
    const state = getLoopState(loop);
    return (
      (filter === FilterOption.ACTIVE && state === 'active') ||
      (filter === FilterOption.BROKEN && state === 'broken')
    );
  });
  
  // Check if there are any loops
  const hasLoops = loops.length > 0;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Loops</h1>
        
        {hasLoops && (
          <div className="flex space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {Object.values(FilterOption).map((option) => (
                <button
                  key={option}
                  onClick={() => setFilter(option)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === option
                      ? 'bg-white shadow-sm text-primary-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {option === FilterOption.ALL && 'All'}
                  {option === FilterOption.ACTIVE && 'Active'}
                  {option === FilterOption.BROKEN && 'Broken'}
                </button>
              ))}
            </div>
            
            <Link to="/new">
              <Button
                icon={<Plus size={16} />}
                iconPosition="left"
                size="sm"
              >
                New
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      {!hasLoops ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-xl font-medium mb-2">Start your first habit loop</h2>
          <p className="text-gray-600 mb-6">Track daily progress and build consistent streaks.</p>
          <Link to="/new">
            <Button
              icon={<Plus size={18} />}
              iconPosition="left"
            >
              Create Loop
            </Button>
          </Link>
        </div>
      ) : filteredLoops.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-medium mb-2">No loops match the filter</h2>
          <p className="text-gray-600 mb-6">Try selecting a different filter or create a new loop.</p>
          <button
            onClick={() => setFilter(FilterOption.ALL)}
            className="text-primary-500 hover:text-primary-700 font-medium"
          >
            View all loops
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLoops.map((loop) => (
            <LoopCard key={loop.id} loop={loop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;