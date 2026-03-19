import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollIntro from './components/intro';
import Navbar from './components/navbar';
import LandingPage from './pages/landing';
import FeaturesPage from './pages/features';
import TechnologyPage from './pages/technology';
import DrivePage from './pages/drive';
import AppDashboard from './pages/Appdashboard';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (!showIntro) {
      window.scrollTo(0, 0);
    }
  }, [showIntro]);

  if (showIntro) {
    return <ScrollIntro onComplete={() => setShowIntro(false)} />;
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
            <Route path="/app" element={<AppDashboard />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}