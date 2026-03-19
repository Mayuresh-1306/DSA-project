import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollIntro from './components/intro';
import Navbar from './components/navbar';
import LandingPage from './pages/landing';
import FeaturesPage from './pages/features';
import TechnologyPage from './pages/technology';
import DrivePage from './pages/drive';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AppDashboard from './pages/Appdashboard';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

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
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/app" element={<AppDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}