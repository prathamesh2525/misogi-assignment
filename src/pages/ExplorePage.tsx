import React, { useState } from 'react';
import { useLoops } from '../contexts/LoopContext';
import LoopCard from '../components/loop/LoopCard';
import { Search } from 'lucide-react';

const ExplorePage: React.FC = () => {
  const { publicLoops } = useLoops();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter loops based on search term
  const filteredLoops = publicLoops.filter((loop) =>
    loop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (loop.emoji && loop.emoji.includes(searchTerm))
  );
  
  // Group loops by category (frequency)
  const groupedLoops = filteredLoops.reduce<Record<string, typeof publicLoops>>(
    (acc, loop) => {
      const category = loop.frequency;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(loop);
      return acc;
    },
    {}
  );
  
  const renderCategory = (title: string, loops: typeof publicLoops) => (
    <div key={title} className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loops.map((loop) => (
          <LoopCard key={loop.id} loop={loop} isPublic />
        ))}
      </div>
    </div>
  );
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Explore Loops</h1>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for loops..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredLoops.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-medium mb-2">No matching loops found</h2>
          <p className="text-gray-600">Try a different search term or check back later for more loops.</p>
        </div>
      ) : searchTerm ? (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLoops.map((loop) => (
              <LoopCard key={loop.id} loop={loop} isPublic />
            ))}
          </div>
        </div>
      ) : (
        <>
          {groupedLoops['daily'] && renderCategory('Daily Habits', groupedLoops['daily'])}
          {groupedLoops['weekdays'] && renderCategory('Weekday Habits', groupedLoops['weekdays'])}
          {groupedLoops['3x-per-week'] && renderCategory('3x Per Week', groupedLoops['3x-per-week'])}
          {groupedLoops['custom'] && renderCategory('Custom Schedules', groupedLoops['custom'])}
        </>
      )}
    </div>
  );
};

export default ExplorePage;