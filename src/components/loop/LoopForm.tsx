import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoops } from '../../contexts/LoopContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { CalendarDays, Globe, Lock, AlarmCheck } from 'lucide-react';

const EMOJI_OPTIONS = [
  '📚', '🧘', '🏃', '💪', '🍎', '💧', '💪', '🧠', '🎯', '✍️', 
  '🎨', '🎵', '🧹', '💤', '🚰', '💊', '🧼', '⏰', '🚫', '🍬'
];

const LoopForm: React.FC = () => {
  const { addLoop } = useLoops();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState<string>('📚');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'custom' | '3x-per-week'>('daily');
  const [isPublic, setIsPublic] = useState(false);
  const [customDays, setCustomDays] = useState<number[]>([0, 2, 4]); // Mon, Wed, Fri by default
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (frequency === 'custom' && customDays.length === 0) {
      newErrors.customDays = 'Select at least one day';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    addLoop({
      title,
      emoji,
      frequency,
      customDays: frequency === 'custom' ? customDays : undefined,
      startDate: new Date(),
      isPublic,
    });
    
    navigate('/');
  };
  
  const handleCustomDayToggle = (day: number) => {
    setCustomDays(prev => 
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };
  
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Loop</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <Input
              label="What do you want to accomplish?"
              placeholder="Read 10 pages, Drink water, etc."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              error={errors.title}
              icon={<AlarmCheck size={20} />}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Choose an emoji</label>
            <div className="grid grid-cols-10 gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`h-10 w-10 flex items-center justify-center text-xl rounded-lg ${
                    emoji === e
                      ? 'bg-primary-100 border-2 border-primary-500'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">How often?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={`py-2 px-4 rounded-lg text-center text-sm ${
                  frequency === 'daily'
                    ? 'bg-primary-100 border border-primary-500 text-primary-700'
                    : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <CalendarDays size={18} className="mx-auto mb-1" />
                Daily
              </button>
              
              <button
                type="button"
                onClick={() => setFrequency('weekdays')}
                className={`py-2 px-4 rounded-lg text-center text-sm ${
                  frequency === 'weekdays'
                    ? 'bg-primary-100 border border-primary-500 text-primary-700'
                    : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <CalendarDays size={18} className="mx-auto mb-1" />
                Weekdays
              </button>
              
              <button
                type="button"
                onClick={() => setFrequency('3x-per-week')}
                className={`py-2 px-4 rounded-lg text-center text-sm ${
                  frequency === '3x-per-week'
                    ? 'bg-primary-100 border border-primary-500 text-primary-700'
                    : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <CalendarDays size={18} className="mx-auto mb-1" />
                3x Per Week
              </button>
              
              <button
                type="button"
                onClick={() => setFrequency('custom')}
                className={`py-2 px-4 rounded-lg text-center text-sm ${
                  frequency === 'custom'
                    ? 'bg-primary-100 border border-primary-500 text-primary-700'
                    : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <CalendarDays size={18} className="mx-auto mb-1" />
                Custom
              </button>
            </div>
          </div>
          
          {frequency === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select days:</label>
              <div className="flex space-x-1">
                {dayLabels.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleCustomDayToggle(index)}
                    className={`w-9 h-9 rounded-full text-xs ${
                      customDays.includes(index)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {errors.customDays && <p className="mt-1 text-sm text-error-500">{errors.customDays}</p>}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 py-2 px-3 rounded-lg text-center text-sm ${
                  !isPublic
                    ? 'bg-primary-100 border border-primary-500 text-primary-700'
                    : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <Lock size={18} className="mx-auto mb-1" />
                Private
              </button>
              
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 py-2 px-3 rounded-lg text-center text-sm ${
                  isPublic
                    ? 'bg-primary-100 border border-primary-500 text-primary-700'
                    : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <Globe size={18} className="mx-auto mb-1" />
                Public
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {isPublic
                ? 'Anyone can see and clone your loop'
                : 'Only you can see this loop'}
            </p>
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              fullWidth
              size="lg"
            >
              Create Loop
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoopForm;