import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, User, Timer } from 'lucide-react';

const SignupPage: React.FC = () => {
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await signup(name, email, password);
      navigate('/');
    } catch (err) {
      setError('Unable to create account. Email might already be in use.');
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-13rem)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <Timer className="text-primary-500" size={36} />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Create your account</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-error-500 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full name"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            autoComplete="name"
            icon={<User size={18} />}
          />
          
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
            Create account
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-700 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;