import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import LoopForm from '../components/loop/LoopForm';
import Button from '../components/ui/Button';

const NewLoopPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 text-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-medium mb-2">Sign in to create loops</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to create new habit loops.</p>
          <Link to="/login">
            <Button>Log in</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Create New Loop</h1>
      <LoopForm />
    </div>
  );
};

export default NewLoopPage;