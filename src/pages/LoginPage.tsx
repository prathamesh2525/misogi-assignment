import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, Timer } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-13rem)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <Timer className="text-primary-500" size={36} />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Log in to LoopList</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-error-500 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            autoComplete="email"
            icon={<Mail size={18} />}
          />
          
          <Input
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            icon={<Lock size={18} />}
          />
          
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Log in
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-500 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
          
          <p className="mt-4 text-xs text-gray-500">
            For demo purpose, use:<br />
            email: jane@example.com<br />
            (any password will work)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;