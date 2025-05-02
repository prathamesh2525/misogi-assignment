import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Timer, Home, Compass, User, Plus } from 'lucide-react';
import Button from './ui/Button';

const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navLinks = [
    {
      to: '/',
      label: 'Home',
      icon: <Home size={20} />,
      requiresAuth: false,
    },
    {
      to: '/explore',
      label: 'Explore',
      icon: <Compass size={20} />,
      requiresAuth: false,
    },
    {
      to: '/new',
      label: 'New Loop',
      icon: <Plus size={20} />,
      requiresAuth: true,
      special: true,
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: <User size={20} />,
      requiresAuth: true,
    },
  ];
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Timer className="text-primary-500" size={28} />
          <span className="font-bold text-xl text-gray-900">LoopList</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <div className="flex space-x-2">
              <Link to="/login">
                <Button variant="outline" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
              >
                Log out
              </Button>
              <Link to="/profile" className="flex items-center">
                <span className="text-sm font-medium mr-2 hidden sm:inline">{user?.name}</span>
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around">
          {navLinks
            .filter(link => !link.requiresAuth || isAuthenticated)
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center py-2 px-3 ${
                  isActive(link.to)
                    ? 'text-primary-500'
                    : 'text-gray-500 hover:text-gray-900'
                } ${link.special ? 'relative -top-4' : ''}`}
              >
                {link.special ? (
                  <div className="bg-primary-500 text-white p-3 rounded-full shadow-lg">
                    {link.icon}
                  </div>
                ) : (
                  <div>{link.icon}</div>
                )}
                <span className="text-xs mt-1">{link.label}</span>
              </Link>
            ))}
        </div>
      </nav>
      
      {/* Desktop Navigation */}
      <nav className="hidden sm:block border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {navLinks
              .filter(link => !link.requiresAuth || isAuthenticated)
              .filter(link => !link.special) // Remove special items for desktop
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center py-3 px-1 border-b-2 ${
                    isActive(link.to)
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center">
                    {link.icon}
                    <span className="ml-2">{link.label}</span>
                  </span>
                </Link>
              ))}
              
            {isAuthenticated && (
              <Link
                to="/new"
                className="flex items-center py-3 px-1 border-b-2 ml-auto border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
              >
                <Button
                  size="sm"
                  icon={<Plus size={16} />}
                  iconPosition="left"
                >
                  New Loop
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;