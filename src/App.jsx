import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import pages
import Home from './pages/Home';
import FormEditor from './pages/FormEditor';
import FormViewer from './pages/FormViewer';
import FormResults from './pages/FormResults';
import PublishedForms from './pages/PublishedForms';
import FeatureNotImplemented from './pages/FeatureNotImplemented';

// Import components
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            {/* Home page - List of forms */}
            <Route path="/" element={<Home />} />
            
            {/* My Forms - Dashboard with all forms */}
            <Route path="/forms" element={<Home />} />
            
            {/* Published forms */}
            <Route path="/published" element={<PublishedForms />} />
            
            {/* Form editor - Create/edit forms */}
            <Route path="/editor" element={<FormEditor />} />
            <Route path="/editor/:id" element={<FormEditor />} />
            
            {/* Form viewer - Redirected to feature not implemented */}
            <Route path="/form/:id" element={<FeatureNotImplemented />} />
            <Route path="/forms/:id/respond" element={<FeatureNotImplemented />} />
            
            {/* Form results - View responses and analytics */}
            <Route path="/results/:id" element={<FormResults />} />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#374151',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;