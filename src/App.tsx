import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoopProvider } from './contexts/LoopContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NewLoopPage from './pages/NewLoopPage';
import LoopDetailPage from './pages/LoopDetailPage';

function App() {
  return (
    <AuthProvider>
      <LoopProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navigation />
            <main className="flex-grow pb-20 sm:pb-0">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/new" element={<NewLoopPage />} />
                <Route path="/loop/:loopId" element={<LoopDetailPage />} />
              </Routes>
            </main>
            <footer className="py-6 bg-white border-t border-gray-200">
              <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
                <p>LoopList - Build better habits with social accountability</p>
              </div>
            </footer>
          </div>
        </Router>
      </LoopProvider>
    </AuthProvider>
  );
}

export default App;