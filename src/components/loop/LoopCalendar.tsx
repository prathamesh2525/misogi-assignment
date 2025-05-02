import React from 'react';
import { subDays, format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns';
import { Loop } from '../../types';

interface LoopCalendarProps {
  loop: Loop;
  showMonths?: number;
}

const LoopCalendar: React.FC<LoopCalendarProps> = ({ loop, showMonths = 1 }) => {
  const generateCalendarData = () => {
    const today = new Date();
    const months = [];
    
    for (let i = 0; i < showMonths; i++) {
      const monthDate = subDays(today, i * 30);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      
      const days = eachDayOfInterval({ start, end });
      
      months.push({
        month: format(monthDate, 'MMMM yyyy'),
        days,
      });
    }
    
    return months;
  };
  
  const getCompletionStatus = (date: Date) => {
    // Find completion for this day
    const completion = loop.completions.find(c => 
      isSameDay(new Date(c.date), date)
    );
    
    if (!completion) return 'none';
    
    return completion.completed ? 'completed' : 'missed';
  };
  
  const getCompletionColor = (date: Date, frequency: string) => {
    // For weekdays frequency, weekends should be gray
    if (frequency === 'weekdays' && isWeekend(date)) {
      return 'bg-gray-100';
    }
    
    // For 3x per week, we need a more complex logic - simplified here
    if (frequency === '3x-per-week') {
      // For demo purposes, let's say Mon/Wed/Fri are the targets
      const dayOfWeek = date.getDay();
      if (![1, 3, 5].includes(dayOfWeek)) {
        return 'bg-gray-100';
      }
    }
    
    // For custom days
    if (frequency === 'custom' && loop.customDays) {
      const dayOfWeek = date.getDay();
      if (!loop.customDays.includes(dayOfWeek)) {
        return 'bg-gray-100';
      }
    }
    
    const status = getCompletionStatus(date);
    
    switch (status) {
      case 'completed':
        return 'bg-accent-500 border-accent-600';
      case 'missed':
        return 'bg-error-100 border-error-200';
      default:
        return 'bg-gray-200 border-gray-300';
    }
  };
  
  const calendarData = generateCalendarData();
  
  return (
    <div className="space-y-4">
      {calendarData.map((monthData, monthIndex) => (
        <div key={monthIndex} className="bg-white rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">{monthData.month}</h3>
          </div>
          
          <div className="p-3">
            <div className="grid grid-cols-7 gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={index} className="h-6 flex items-center justify-center text-xs text-gray-500">
                  {day}
                </div>
              ))}
              
              {monthData.days.map((day, dayIndex) => {
                const dayOfMonth = day.getDate();
                const today = new Date();
                const isToday = isSameDay(day, today);
                
                return (
                  <div 
                    key={dayIndex}
                    className={`relative h-8 rounded-md overflow-hidden ${
                      isToday ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <div
                      className={`absolute inset-1 rounded-md border ${getCompletionColor(day, loop.frequency)}`}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {dayOfMonth}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-accent-500 rounded-sm mr-2"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-error-100 border border-error-200 rounded-sm mr-2"></div>
          <span>Missed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-100 rounded-sm mr-2"></div>
          <span>Not scheduled</span>
        </div>
      </div>
    </div>
  );
};

export default LoopCalendar;