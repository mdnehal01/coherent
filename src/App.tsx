import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
<<<<<<< HEAD
=======
import { ThemeProvider } from './contexts/ThemeContext';
>>>>>>> 97bfcc7 (Added the team functionality)
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import CTASection from './components/CTASection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import DemoPage from './pages/DemoPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
<<<<<<< HEAD

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              <Features />
              <Testimonials />
              <Pricing />
              <CTASection />
              <Contact />
            </main>
          } />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route 
            path="/dashboard/*" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
=======
import TeamSelectionPage from './pages/TeamSelectionPage';
import TeamDashboardPage from './pages/TeamDashboardPage';
import ProjectDashboardPage from './pages/ProjectDashboardPage';
import AddMembersPage from './pages/AddMembersPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <main>
                <Hero />
                <Features />
                <Testimonials />
                <Pricing />
                <CTASection />
                <Contact />
              </main>
            } />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/team" element={
              <PrivateRoute>
                <TeamSelectionPage />
              </PrivateRoute>
            } />
            <Route path="/team/:teamId" element={
              <PrivateRoute>
                <TeamDashboardPage />
              </PrivateRoute>
            } />
            <Route path="/team/:teamId/project/:projectId" element={
              <PrivateRoute>
                <ProjectDashboardPage />
              </PrivateRoute>
            } />
            <Route path="/team/add-members" element={
              <PrivateRoute>
                <AddMembersPage />
              </PrivateRoute>
            } />
            <Route 
              path="/dashboard/*" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
          </Routes>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white',
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
>>>>>>> 97bfcc7 (Added the team functionality)
  );
}

export default App;