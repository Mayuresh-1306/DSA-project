import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CinematicIntro from './components/intro';
import Navbar from './components/navbar';
import LandingPage from './pages/landing';
import FeaturesPage from './pages/features';
import TechnologyPage from './pages/technology';
import DrivePage from './pages/drive';
import AppDashboard from './pages/Appdashboard';
import RideBooking from './pages/RideBooking';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

// Simple Route Protector
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('smartride_jwt_token');
  if (!token) return <Navigate to="/signin" replace />;
  return children;
};

export default function App() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('smartride_intro_seen');
    const isSignedIn = localStorage.getItem('smartride_jwt_token');

    if (!hasSeenIntro && !isSignedIn) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem('smartride_intro_seen', 'true');
    setShowIntro(false);
  };

  if (showIntro) {
    return <CinematicIntro onComplete={handleIntroComplete} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col fade-in">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/technology" element={<TechnologyPage />} />
            <Route path="/drive" element={<DrivePage />} />
            
            {/* Protected Routes */}
            <Route path="/book" element={<ProtectedRoute><RideBooking /></ProtectedRoute>} />
            <Route path="/app" element={<ProtectedRoute><AppDashboard /></ProtectedRoute>} />
            
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}